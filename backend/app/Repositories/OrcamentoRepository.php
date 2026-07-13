<?php

namespace App\Repositories;

use App\Enums\OrcamentoStatus;
use App\Models\Orcamento;
use Illuminate\Database\Eloquent\Builder;

class OrcamentoRepository
{
    public function __construct(
    ) {}

    public function search(array $filters)
    {
        return Orcamento::query()
            ->withDotacaoAtualizada()
            ->withStatus()
            ->withSaldo()
            ->with([
                'unidadeGestora.orgao',
                'acao.programa',
                'subfuncao.funcao',
                'naturezaDespesa',
                'fonteRecurso',
                'revisor',
            ])
            ->when(
                !empty($filters['orgao_id']),
                fn (Builder $query) => $query->porOrgao($filters['orgao_id'])
            )
            ->when(
                !empty($filters['programa_id']),
                fn (Builder $query) => $query->porPrograma($filters['programa_id'])
            )
            ->when(
                !empty($filters['acao_id']),
                fn (Builder $query) => $query->where('acao_id', $filters['acao_id'])
            )
            ->when(
                !empty($filters['ano']),
                fn (Builder $query) => $query->where('ano', $filters['ano'])
            )
            ->when(
                !empty($filters['status']),
                fn (Builder $query) => $query->porStatus(OrcamentoStatus::from($filters['status']))
            )
            ->when(
                isset($filters['percentual_minimo']) || isset($filters['percentual_maximo']),
                fn (Builder $query) => $query->porPercentualExecucao(
                    $filters['percentual_minimo'] ?? null,
                    $filters['percentual_maximo'] ?? null
                )
            )->orderBy($filters['sort_by'], $filters['sort_direction'])
            ->paginate($filters['per_page']);
    }
}
