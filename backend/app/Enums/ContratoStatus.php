<?php

namespace App\Enums;

enum ContratoStatus: string
{
    case VIGENTE = 'vigente';
    case VENCIDO = 'vencido';
    case ENCERRADO = 'encerrado';
    case SUSPENSO = 'suspenso';
}
