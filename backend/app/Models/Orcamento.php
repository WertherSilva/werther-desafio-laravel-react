<?php

namespace App\Models;

use App\Enums\OrcamentoStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class Orcamento extends Model
{
    use HasFactory;

    protected $fillable = [
        'ano',
        'dotacao_inicial',
        'suplementacoes',
        'anulacoes',
        'valor_empenhado',
        'valor_liquidado',
        'valor_pago',
        'observacao_revisao',
        'unidade_gestora_id',
        'acao_id',
        'subfuncao_id',
        'natureza_despesa_id',
        'fonte_recurso_id',
        'revisor_id',
        'revisado_em',
    ];

    protected function casts(): array
    {
        return [
            'ano' => 'integer',
            'dotacao_inicial' => 'decimal:2',
            'suplementacoes' => 'decimal:2',
            'anulacoes' => 'decimal:2',
            'valor_empenhado' => 'decimal:2',
            'valor_liquidado' => 'decimal:2',
            'valor_pago' => 'decimal:2',
            'revisado_em' => 'datetime',
        ];
    }

    public function unidadeGestora(): BelongsTo
    {
        return $this->belongsTo(UnidadeGestora::class);
    }

    public function orgao(): HasOneThrough
    {
        return $this->hasOneThrough(
            Orgao::class,           // Entidade que quero retornar (no caso órgão)
            UnidadeGestora::class,  // Entidade que possui o relacionamento direto com orçamento (no caso unidade gestora)
            'id',                   // Chave primária na tabela unidades_gestoras utilizada como estrangeira
            'id',                   // Chave primária na tabela orgaos utilizada como estrangeira
            'unidade_gestora_id',   // Chave estrangeira na tabela orcamentos referente à unidade gestora
            'orgao_id'              // Chave estrangeira na tabela unidades_gestoras referente ao órgão
        );
    }

    public function acao(): BelongsTo
    {
        return $this->belongsTo(Acao::class);
    }

    public function programa(): HasOneThrough
    {
        return $this->hasOneThrough(
            Programa::class,
            Acao::class,
            'id',
            'id',
            'acao_id',
            'programa_id'
        );
    }

    public function subfuncao(): BelongsTo
    {
        return $this->belongsTo(Subfuncao::class);
    }

    public function funcao(): HasOneThrough
    {
        return $this->hasOneThrough(
            Funcao::class,
            Subfuncao::class,
            'id',
            'id',
            'subfuncao_id',
            'funcao_id'
        );
    }

    public function naturezaDespesa(): BelongsTo
    {
        return $this->belongsTo(NaturezaDespesa::class);
    }

    public function fonteRecurso(): BelongsTo
    {
        return $this->belongsTo(FonteRecurso::class);
    }

    public function revisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'revisor_id');
    }

    public function contratos(): HasMany
    {
        return $this->hasMany(Contrato::class);
    }

    #[Scope]
    public function withDotacaoAtualizada(Builder $query): void
    {
        // Se ainda não houver nenhuma seleção, garante o orcamentos.* primeiro
        if (empty($query->getQuery()->columns)) {
            $query->select('orcamentos.*');
        }

        $query->addSelect(DB::raw('(dotacao_inicial + suplementacoes - anulacoes) AS dotacao_atualizada'));
    }

    #[Scope]
    public function withStatus(Builder $query): void
    {
        if (empty($query->getQuery()->columns)) {
            $query->select('orcamentos.*');
        }

        $query->addSelect([DB::raw("
                CASE
                    WHEN
                        valor_empenhado > 0 AND
                        (valor_liquidado = 0 OR valor_liquidado IS NULL) AND
                        (valor_pago = 0 OR valor_pago IS NULL)
                    THEN '" . OrcamentoStatus::EMPENHADO->value . "'
                    WHEN
                        valor_liquidado > 0 AND
                        (
                            valor_pago < valor_liquidado OR
                            valor_pago = 0 OR
                            valor_pago IS NULL
                        )
                    THEN '" . OrcamentoStatus::LIQUIDADO->value . "'
                    WHEN
                        valor_pago > 0 AND
                        valor_pago >= valor_liquidado
                    THEN '" . OrcamentoStatus::PAGO->value . "'
                    ELSE NULL
                END AS status
            ")
        ]);
    }

    #[Scope]
    public function withSaldo(Builder $query): void
    {
        if (empty($query->getQuery()->columns)) {
            $query->select('orcamentos.*');
        }

        $query->addSelect(DB::raw('((dotacao_inicial + suplementacoes - anulacoes) - valor_empenhado) AS saldo'));
    }

    #[Scope]
    public function porOrgao(Builder $query, int $orgaoId): void
    {
        $query->whereHas('orgao', fn($q) => $q->where('orgaos.id', $orgaoId));
    }

    #[Scope]
    public function porPrograma(Builder $query, int $programaId): void
    {
        $query->whereHas('programa', fn($q) => $q->where('programas.id', $programaId));
    }

    #[Scope]
    public function porStatus(Builder $query, OrcamentoStatus $status): void
    {
        match ($status) {
            OrcamentoStatus::EMPENHADO => $query
                ->where('valor_empenhado', '>', 0)
                ->where(function (Builder $q) {
                    $q->where('valor_liquidado', '=', 0)->orWhereNull('valor_liquidado');
                })
                ->where(function (Builder $q) {
                    $q->where('valor_pago', '=', 0)->orWhereNull('valor_pago');
                }),

            OrcamentoStatus::LIQUIDADO => $query
            ->where('valor_liquidado', '>', 0)
            ->where(function (Builder $q) {
                $q->whereColumn('valor_pago', '<', 'valor_liquidado')
                  ->orWhere('valor_pago', '=', 0)
                  ->orWhereNull('valor_pago');
            }),

            OrcamentoStatus::PAGO => $query
                ->where('valor_pago', '>', 0)
                ->whereColumn('valor_pago', '>=', 'valor_liquidado'),
        };
    }

    #[Scope]
    public function porPercentualExecucao(Builder $query, ?float $min = null, ?float $max = null): void
    {
        $formula = '(dotacao_inicial + suplementacoes - anulacoes)';

        if (isset($min) && !empty($min)) {
            $fatorMin = $min / 100;
            $query->whereRaw("valor_empenhado >= ? * $formula", [$fatorMin]);
        }

        if (isset($max) && !empty($max)) {
            $fatorMax = $max / 100;
            $query->whereRaw("valor_empenhado <= ? * $formula", [$fatorMax]);
        }
    }
}
