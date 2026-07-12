<?php

namespace App\Http\Resources;

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
            'dotacao_atualizada' => $this->dotacao_atualizada,
            'valor_empenhado' => $this->valor_empenhado,
            'valor_liquidado' => $this->valor_liquidado,
            'valor_pago' => $this->valor_pago,
            'revisado_em' => $this->revisado_em,
            'unidade_gestora' => new UnidadeGestoraWithOrgaoResource($this->whenLoaded('unidadeGestora')),
            'acao' => new AcaoWithProgramaResource($this->whenLoaded('acao')),
            'subfuncao' => new SubfuncaoWithFuncaoResource($this->whenLoaded('subfuncao')),
            'natureza_despesa' => new NaturezaDespesaResource($this->whenLoaded('naturezaDespesa')),
            'fonte_recurso' => new FonteRecursoResource($this->whenLoaded('fonteRecurso')),
            'revisor' => new UserResource($this->whenLoaded('revisor')),
        ];
    }
}