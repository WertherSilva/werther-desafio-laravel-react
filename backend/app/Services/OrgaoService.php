<?php

namespace App\Services;

use App\Repositories\OrgaoRepository;

class OrgaoService
{
    public function __construct(
        protected OrgaoRepository $orgaoRepository
    ) {}

    public function search(array $filters): mixed
    {
        return $this->orgaoRepository->search($filters);
    }
}
