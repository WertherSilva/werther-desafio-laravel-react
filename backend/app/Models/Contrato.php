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

    protected $appends = [
        'status'
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

    protected function status(): Attribute
    {
        return Attribute::get(function (): ContratoStatus {
            if ($this->encerrado_em !== null) {
                return ContratoStatus::ENCERRADO;
            }

            if ($this->suspenso_em !== null) {
                return ContratoStatus::SUSPENSO;
            }

            $hoje = Carbon::today();

            if ($this->data_fim !== null && $this->data_fim->lt($hoje)) {
                return ContratoStatus::VENCIDO;
            }

            return ContratoStatus::VIGENTE;
        });
    }

    #[Scope]
    public function encerrado(Builder $query): void
    {
        $query->whereNotNull('encerrado_em');
    }

    #[Scope]
    public function suspenso(Builder $query): void
    {
        $query->whereNull('encerrado_em')->whereNotNull('suspenso_em');
    }

    #[Scope]
    public function vencido(Builder $query): void
    {
        $query->whereNull('encerrado_em')
            ->whereNull('suspenso_em')
            ->whereNotNull('data_fim')
            ->where('data_fim', '<', Carbon::today());
    }

    #[Scope]
    public function vigente(Builder $query): void
    {
        $query->whereNull('encerrado_em')
            ->whereNull('suspenso_em')
            ->where(function (Builder $q) {
                $q->whereNull('data_fim')
                ->orWhere('data_fim', '>=', Carbon::today());
            });

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
