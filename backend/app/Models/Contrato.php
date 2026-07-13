<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Enums\ContratoStatus;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class Contrato extends Model
{
    use HasFactory;

    protected $fillable = [
        'numero',
        'objeto',
        'valor',
        'data_inicio',
        'data_fim',
        'suspenso_em',
        'encerrado_em',
        'orcamento_id',
        'fornecedor_id',
    ];

    protected function casts(): array
    {
        return [
            'data_inicio' => 'datetime',
            'data_fim' => 'datetime',
            'encerrado_em' => 'datetime',
            'suspenso_em' => 'datetime',
        ];
    }

    #[Scope]
    public function withStatus(Builder $query): void
    {
        if (empty($query->getQuery()->columns)) {
            $query->select('contratos.*');
        }

        $hoje = Carbon::today()->toDateString();

        $query->addSelect([DB::raw("
                CASE
                    WHEN
                        encerrado_em IS NOT NULL
                    THEN '" . ContratoStatus::ENCERRADO->value . "'
                    WHEN
                        encerrado_em IS NULL AND
                        suspenso_em IS NOT NULL
                    THEN '" . ContratoStatus::SUSPENSO->value . "'
                    WHEN
                        encerrado_em IS NULL AND
                        suspenso_em IS NULL AND
                        data_fim < '" . $hoje . "'
                    THEN '" . ContratoStatus::VENCIDO->value . "'
                    WHEN
                        encerrado_em IS NULL AND
                        suspenso_em IS NULL AND
                        (
                            data_fim IS NULL OR
                            data_fim >= '" . $hoje . "'
                        )
                    THEN '" . ContratoStatus::VIGENTE->value . "'
                    ELSE NULL
                END AS status
            ")
        ]);
    }

    public function orcamento(): BelongsTo
    {
        return $this->belongsTo(Orcamento::class);
    }

    public function fornecedor(): BelongsTo
    {
        return $this->belongsTo(Fornecedor::class);
    }
}
