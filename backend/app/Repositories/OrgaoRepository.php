<?php

namespace App\Repositories;

use App\Models\Orgao;
use Illuminate\Database\Eloquent\Builder;

class OrgaoRepository
{
    public function __construct(
    ) {}

    public function search(array $filters)
    {
        return Orgao::query()
            ->when(
                !empty($filters['busca']),
                fn (Builder $query) => $query->where(function (Builder $q) use ($filters) {
                    $q->where('nome', 'like', "%{$filters['busca']}%")
                    ->orWhere('sigla', 'like', "%{$filters['busca']}%");
                })
            )
            ->when(
                $filters['ativo'] !== null,
                fn (Builder $query) => $query->where('ativo', $filters['ativo'])
            )
            ->paginate($filters['per_page']);
    }
}