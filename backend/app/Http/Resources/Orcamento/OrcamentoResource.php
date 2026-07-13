<?php

namespace App\Http\Resources\Orcamento;

use App\Http\Resources\Acao\AcaoWithProgramaResource;
use App\Http\Resources\FonteRecursoResource;
use App\Http\Resources\NaturezaDespesaResource;
use App\Http\Resources\SubfuncaoWithFuncaoResource;
use App\Http\Resources\UnidadeGestoraWithOrgaoResource;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrcamentoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ano' => $this->ano,
            'dotacao_inicial' => $this->dotacao_inicial,
            'suplementacoes' => $this->suplementacoes,
            'anulacoes' => $this->anulacoes,
            'dotacao_atualizada' => $this->whenHas('dotacao_atualizada'),
            'valor_empenhado' => $this->valor_empenhado,
            'valor_liquidado' => $this->valor_liquidado,
            'valor_pago' => $this->valor_pago,
            'percentual_execucao' => $this->whenHas('percentual_execucao'),
            'status' => $this->whenHas('status'),
            'saldo' => $this->whenHas('saldo'),
            'unidade_gestora' => new UnidadeGestoraWithOrgaoResource($this->whenLoaded('unidadeGestora')),
            'acao' => new AcaoWithProgramaResource($this->whenLoaded('acao')),
            'subfuncao' => new SubfuncaoWithFuncaoResource($this->whenLoaded('subfuncao')),
            'natureza_despesa' => new NaturezaDespesaResource($this->whenLoaded('naturezaDespesa')),
            'fonte_recurso' => new FonteRecursoResource($this->whenLoaded('fonteRecurso')),
            'revisor' => new UserResource($this->whenLoaded('revisor')),
            'revisado_em' => $this->revisado_em,
            'observacao_revisao' => $this->observacao_revisao,
        ];
    }
}