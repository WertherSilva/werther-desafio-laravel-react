<?php

namespace App\Services;

use App\Repositories\OrcamentoRepository;

class OrcamentoService
{
    public function __construct(
        protected OrcamentoRepository $orcamentoRepository
    ) {}

    public function search(array $filters): mixed
    {
        return $this->orcamentoRepository->search($filters);
    }

    public function findById(int $id): mixed
    {
        return $this->orcamentoRepository->findById($id);
    }

    public function revisar(int $id, string $observacao_revisao)
    {
        return $this->orcamentoRepository->revisar($id, $observacao_revisao);
    }
}
