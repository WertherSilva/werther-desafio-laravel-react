<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrcamentoRevisarRequest;
use App\Services\OrcamentoService;
use App\Http\Resources\Orcamento\OrcamentoResource;
use App\Http\Requests\OrcamentoSearchRequest;
use App\Http\Resources\Orcamento\OrcamentoWithContratosResource;

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

    public function findById(int $id)
    {
        $result = $this->orcamentoService->findById($id);
        
        return new OrcamentoWithContratosResource($result);
    }

    public function revisar(int $id, OrcamentoRevisarRequest $request)
    {
        $result = $this->orcamentoService->revisar($id, $request->validated('observacao_revisao'));

        return response()->json([
            'data' => new OrcamentoResource($result),
            'message' => 'Orçamento revisado com sucesso.'
        ]);
    }
}
