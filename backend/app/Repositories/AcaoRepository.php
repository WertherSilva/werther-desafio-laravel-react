<?php

namespace App\Repositories;

use App\Models\Acao;

class AcaoRepository
{
    public function __construct(
    ) {}

    public function index()
    {
        return Acao::all();
    }
}