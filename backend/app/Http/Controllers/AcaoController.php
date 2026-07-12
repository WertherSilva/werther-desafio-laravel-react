<?php

namespace App\Http\Controllers;

use App\Services\AcaoService;
use App\Http\Resources\AcaoResource;

class AcaoController extends Controller
{
    public function __construct(
        protected AcaoService $acaoService
    ) {}

    public function index()
    {
        $result = $this->acaoService->index();

        return AcaoResource::collection($result);
    }
}
