<?php

namespace App\Services;

use App\Repositories\GraficosRepository;

class GraficosService
{
    public function __construct(
        protected GraficosRepository $graficosRepository
    ) {}

    public function get(): mixed
    {
        return $this->graficosRepository->get();
    }
}
