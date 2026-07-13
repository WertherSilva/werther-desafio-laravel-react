<?php

namespace App\Http\Controllers;

use App\Services\GraficosService;

class GraficosController extends Controller
{
    public function __construct(
        private GraficosService $graficosService
    ) {}

    public function get()
    {
        return response()->json($this->graficosService->get());
    }
}