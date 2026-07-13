<?php

namespace App\Repositories;

use App\Models\Contrato;
use App\Models\Orcamento;
use App\Models\Orgao;

class DashboardRepository
{
    public function get(): array
    {
        $totalOrgaos = Orgao::count();
        $totalContratos = Contrato::count();

        $agregado = Orcamento::withoutGlobalScopes()
            ->selectRaw('
                SUM(dotacao_inicial + suplementacoes - anulacoes) AS orcamento_total,
                SUM(valor_empenhado) AS empenhado,
                SUM(valor_liquidado) AS liquidado,
                SUM(valor_pago) AS pago
            ')
            ->first();

        $orcamentoTotal = (float) ($agregado->orcamento_total ?? 0);
        $empenhado      = (float) ($agregado->empenhado ?? 0);
        $liquidado      = (float) ($agregado->liquidado ?? 0);
        $pago           = (float) ($agregado->pago ?? 0);

        $saldo = $orcamentoTotal - $empenhado;

        $percentualExecucao = $orcamentoTotal > 0 ?
            round(($empenhado / $orcamentoTotal) * 100, 2) :
            0.0;

        return [
            'total_orgaos'         => $totalOrgaos,
            'total_contratos'      => $totalContratos,
            'orcamento_total'      => $orcamentoTotal,
            'empenhado'            => $empenhado,
            'liquidado'            => $liquidado,
            'pago'                 => $pago,
            'saldo'                => $saldo,
            'percentual_execucao'  => $percentualExecucao,
        ];
    }
}
