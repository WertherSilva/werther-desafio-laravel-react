<?php

namespace App\Services;

use App\Repositories\ProgramaRepository;

class ProgramaService
{
    public function __construct(
        protected ProgramaRepository $programaRepository
    ) {}

    public function index(): mixed
    {
        return $this->programaRepository->index();
    }
}
