<?php

namespace App\Repositories;

use App\Models\Contrato;
use App\Models\Orcamento;

class GraficosRepository
{
    public function get(): array
    {
        return [
            'execucao_por_orgao'    => $this->execucaoPorOrgao(),
            'execucao_por_programa' => $this->execucaoPorPrograma(),
            'empenhado_x_pago'      => $this->empenhadoXPago(),
            'top_contratos'         => $this->topContratos(),
        ];
    }

    public function execucaoPorOrgao(): array
    {
        return Orcamento::withoutGlobalScopes()
            ->join('unidades_gestoras', 'unidades_gestoras.id', '=', 'orcamentos.unidade_gestora_id')
            ->join('orgaos', 'orgaos.id', '=', 'unidades_gestoras.orgao_id')
            ->selectRaw('
                orgaos.id AS orgao_id,
                orgaos.sigla AS orgao_sigla,
                orgaos.nome AS orgao_nome,
                SUM(orcamentos.dotacao_inicial + orcamentos.suplementacoes - orcamentos.anulacoes) AS orcamento_total,
                SUM(orcamentos.valor_empenhado) AS execucao
            ')
            ->groupBy('orgaos.id', 'orgaos.sigla', 'orgaos.nome')
            ->orderByDesc('orcamento_total')
            ->get()
            ->map(function ($row) {
                $orcamentoTotal = (float) $row->orcamento_total;
                $execucao = (float) $row->execucao;

                return [
                    'orgao_id' => $row->orgao_id,
                    'orgao_sigla' => $row->orgao_sigla,
                    'orgao_nome' => $row->orgao_nome,
                    'orcamento_total' => $orcamentoTotal,
                    'execucao' => $execucao,
                    'percentual_execucao' => $orcamentoTotal > 0 ?
                        round(($execucao / $orcamentoTotal) * 100, 2) :
                        0.0,
                ];
            })
            ->toArray();
    }

    public function execucaoPorPrograma(): array
    {
        return Orcamento::withoutGlobalScopes()
            ->join('acoes', 'acoes.id', '=', 'orcamentos.acao_id')
            ->join('programas', 'programas.id', '=', 'acoes.programa_id')
            ->selectRaw('
                programas.id AS programa_id,
                programas.codigo AS programa_codigo,
                programas.nome AS programa_nome,
                SUM(orcamentos.dotacao_inicial + orcamentos.suplementacoes - orcamentos.anulacoes) AS orcamento_total,
                SUM(orcamentos.valor_empenhado) AS execucao
            ')
            ->groupBy('programas.id', 'programas.codigo', 'programas.nome')
            ->orderByDesc('orcamento_total')
            ->get()
            ->map(function ($row) {
                $orcamentoTotal = (float) $row->orcamento_total;
                $execucao = (float) $row->execucao;

                return [
                    'programa_id' => $row->programa_id,
                    'programa_codigo' => $row->programa_codigo,
                    'programa_nome' => $row->programa_nome,
                    'orcamento_total' => $orcamentoTotal,
                    'execucao' => $execucao,
                    'percentual_execucao' => $orcamentoTotal > 0 ?
                        round(($execucao / $orcamentoTotal) * 100, 2) :
                        0.0,
                ];
            })
            ->toArray();
    }

    public function empenhadoXPago(): array
    {
        return Orcamento::withoutGlobalScopes()
            ->selectRaw('
                ano,
                SUM(valor_empenhado) AS empenhado,
                SUM(valor_liquidado) AS liquidado,
                SUM(valor_pago) AS pago
            ')
            ->groupBy('ano')
            ->orderBy('ano')
            ->get()
            ->map(fn ($row) => [
                'ano' => $row->ano,
                'empenhado' => (float) $row->empenhado,
                'liquidado' => (float) $row->liquidado,
                'pago' => (float) $row->pago,
            ])
            ->toArray();
    }

    public function topContratos(int $limite = 10): array
    {
        return Contrato::query()
            ->join('orcamentos', 'orcamentos.id', '=', 'contratos.orcamento_id')
            ->join('unidades_gestoras', 'unidades_gestoras.id', '=', 'orcamentos.unidade_gestora_id')
            ->join('orgaos', 'orgaos.id', '=', 'unidades_gestoras.orgao_id')
            ->join('fornecedores', 'fornecedores.id', '=', 'contratos.fornecedor_id')
            ->select([
                'contratos.id',
                'contratos.numero',
                'contratos.objeto',
                'contratos.valor',
                'contratos.data_inicio',
                'contratos.data_fim',
                'fornecedores.nome as fornecedor_nome',
                'orgaos.sigla as orgao_sigla',
                'orgaos.nome as orgao_nome',
            ])
            ->orderByDesc('contratos.valor')
            ->limit($limite)
            ->get()
            ->map(fn ($row) => [
                'id' => $row->id,
                'numero' => $row->numero,
                'objeto' => $row->objeto,
                'valor' => (float) $row->valor,
                'data_inicio' => $row->data_inicio,
                'data_fim' => $row->data_fim,
                'fornecedor_nome' => $row->fornecedor_nome,
                'orgao_sigla' => $row->orgao_sigla,
                'orgao_nome' => $row->orgao_nome,
            ])
            ->toArray();
    }
}