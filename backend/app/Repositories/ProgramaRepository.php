<?php

namespace App\Repositories;

use App\Models\Programa;

class ProgramaRepository
{
    public function __construct(
    ) {}

    public function index()
    {
        return Programa::all();
    }
}