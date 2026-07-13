<?php

namespace App\Http\Resources\Acao;

use App\Http\Resources\ProgramaResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AcaoWithProgramaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'codigo' => $this->codigo,
            'nome' => $this->nome,
            'programa_id' => $this->programa_id,
            'programa' => new ProgramaResource($this->whenLoaded('programa')),
        ];
    }
}
