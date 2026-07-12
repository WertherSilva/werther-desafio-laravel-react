<?php

namespace App\Http\Controllers;

use App\Services\ProgramaService;
use App\Http\Resources\ProgramaResource;

class ProgramaController extends Controller
{
    public function __construct(
        protected ProgramaService $programaService
    ) {}

    public function index()
    {
        $result = $this->programaService->index();

        return ProgramaResource::collection($result);
    }
}
