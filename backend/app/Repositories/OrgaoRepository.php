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
        $query = Orgao::query();

        if (isset($filters['busca']) && !empty($filters['busca'])) {
            $query->where(function (Builder $q) use ($filters) {
                $q->where('nome', 'like', '%' . $filters['busca'] . '%')
                ->orWhere('sigla', 'like', '%' . $filters['busca'] . '%');
            });
        }

        if (isset($filters['ativo']) && is_bool($filters['ativo'])) {
            $query->where('ativo', $filters['ativo']);
        }

        // $per_page = (isset($filters['per_page']) &&
        //     is_int($filters['per_page']) &&
        //     $filters['per_page'] > 0) ?
        //     $filters['per_page'] :
        //     5;

        return $query->paginate($filters['per_page']);
    }
}
