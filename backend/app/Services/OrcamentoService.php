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
}
