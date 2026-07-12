<?php

namespace App\Enums;

enum OrcamentoStatus: string
{
    case EMPENHADO = 'empenhado';
    case LIQUIDADO = 'liquidado';
    case PAGO = 'pago';
}
