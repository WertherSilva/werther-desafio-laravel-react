<?php

namespace App\Services;

use App\Repositories\ContratoRepository;

class ContratoService
{
    public function __construct(
        protected ContratoRepository $contratoRepository
    ) {}

    public function search(array $filters): mixed
    {
        return $this->contratoRepository->search($filters);
    }
}
