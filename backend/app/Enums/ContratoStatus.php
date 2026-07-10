<?php

namespace App\Enums;

enum ContratoStatus: string
{
    case Vigente = 'vigente';
    case Vencido = 'vencido';
    case Encerrado = 'encerrado';
    case Suspenso = 'suspenso';
}
