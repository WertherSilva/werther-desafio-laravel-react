<?php

namespace App\Http\Controllers;

use App\Services\ContratoService;
use App\Http\Requests\ContratoSearchRequest;
use App\Http\Resources\Contrato\ContratoWithOrcamentoResource;

class ContratoController extends Controller
{
    public function __construct(
        protected ContratoService $contratoService
    ) {}

    public function search(ContratoSearchRequest $request)
    {
        $filters = $request->validated();
        $result = $this->contratoService->search($filters);

        return ContratoWithOrcamentoResource::collection($result);
    }
}
