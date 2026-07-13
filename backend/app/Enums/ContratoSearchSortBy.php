<?php

namespace App\Enums;

enum ContratoSearchSortBy: string
{
    case VALOR = 'valor';
    case DATA_INICIO = 'data_inicio';
    case DATA_FIM = 'data_fim';
    case ENCERRADO_EM = 'encerrado_em';
    case SUSPENSO_EM = 'suspenso_em';
}
