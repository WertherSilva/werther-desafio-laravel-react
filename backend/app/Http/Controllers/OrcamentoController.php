<?php

namespace App\Http\Controllers;

use App\Services\OrcamentoService;
use App\Http\Resources\OrcamentoResource;
use App\Http\Requests\OrcamentoSearchRequest;

class OrcamentoController extends Controller
{
    public function __construct(
        protected OrcamentoService $orcamentoService
    ) {}

    public function search(OrcamentoSearchRequest $request)
    {
        $filters = $request->validated();
        $result = $this->orcamentoService->search($filters);

        return OrcamentoResource::collection($result);
    }
}
