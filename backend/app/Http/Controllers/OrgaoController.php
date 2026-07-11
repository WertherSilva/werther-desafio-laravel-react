<?php

namespace App\Http\Controllers;

use App\Services\OrgaoService;
use App\Http\Resources\OrgaoResource;
use Illuminate\Http\Request;

class OrgaoController extends Controller
{
    public function __construct(
        protected OrgaoService $orgaoService
    ) {}

    public function search(Request $request)
    {
        $filters = $request->all();
        $result = $this->orgaoService->search($filters);

        // Utilizado Resource para ter controle do que expor do modelo
        return OrgaoResource::collection($result);
    }
}
