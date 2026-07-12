<?php

namespace App\Services;

use App\Repositories\AcaoRepository;

class AcaoService
{
    public function __construct(
        protected AcaoRepository $acaoRepository
    ) {}

    public function index(): mixed
    {
        return $this->acaoRepository->index();
    }
}
