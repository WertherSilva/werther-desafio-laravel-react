<?php

namespace App\Http\Controllers;

use App\Services\OrgaoService;
use App\Http\Resources\OrgaoResource;
use App\Http\Requests\OrgaoSearchRequest;

class OrgaoController extends Controller
{
    public function __construct(
        protected OrgaoService $orgaoService
    ) {}

    public function search(OrgaoSearchRequest $request)
    {
        $filters = $request->validated();
        $result = $this->orgaoService->search($filters);

        // Utilizado Resource para ter controle do que expor do modelo
        return OrgaoResource::collection($result);
    }
}
