<?php

namespace App\Repositories;

use App\Enums\ContratoStatus;
use App\Models\Contrato;
use Illuminate\Database\Eloquent\Builder;

class ContratoRepository
{
    public function __construct(
    ) {}

    public function search(array $filters)
    {
        return Contrato::query()
            ->withStatus()
            ->with([
                'orcamento',
                'fornecedor',
            ])
            ->when(
                !empty($filters['orgao_id']),
                fn (Builder $query) => $query->where('orgao_id', $filters['orgao_id'])
            )
            ->when(
                !empty($filters['status']),
                fn (Builder $query) => $query->where('status', $filters['status'])
            )
            ->when(
                !empty($filters['fornecedor_id']),
                fn (Builder $query) => $query->where('fornecedor_id', $filters['fornecedor_id'])
            )
            ->whereNotNull('orcamento_id')
            ->orderBy($filters['sort_by'], $filters['sort_direction'])
            ->paginate($filters['per_page']);
    }
}
