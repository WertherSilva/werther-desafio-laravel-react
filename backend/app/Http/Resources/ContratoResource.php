<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContratoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'numero' => $this->numero,
            'objeto' => $this->objeto,
            'valor' => $this->valor,
            'data_inicio' => $this->data_inicio?->format('Y-m-d'),
            'data_fim' => $this->data_fim?->format('Y-m-d'),
            'suspenso_em' => $this->suspenso_em?->format('Y-m-d'),
            'encerrado_em' => $this->encerrado_em?->format('Y-m-d'),
            'status' => $this->status,
            'fornecedor' => new FornecedorResource($this->whenLoaded('fornecedor')),
        ];
    }
}
