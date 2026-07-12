<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

class Orcamento extends Model
{
    protected $fillable = [
        'ano',
        'dotacao_inicial',
        'suplementacoes',
        'anulacoes',
        'valor_empenhado',
        'valor_liquidado',
        'valor_pago',
        'orgao_id',
        'unidade_gestora_id',
        'acao_id',
        'subfuncao_id',
        'natureza_despesa_id',
        'fonte_recurso_id',
        'revisor_id',
        'revisado_em'
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

    protected function dotacaoAtualizada(): Attribute
    {
        return Attribute::get(function (): float {
                return $this->dotacao_inicial + $this->suplementacoes - $this->anulacoes;
        });
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
            UnidadeGestora::class,
            'id',
            'id',
            'unidade_gestora_id',
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
        $query->selectRaw(
            '(dotacao_inicial + suplementacoes - anulacoes) as dotacao_atualizada'
        );
    }
}
