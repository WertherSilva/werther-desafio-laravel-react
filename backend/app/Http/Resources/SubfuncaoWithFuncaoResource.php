<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubfuncaoWithFuncaoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'funcao_id' => $this->funcao_id,
            'funcao' => new FuncaoResource($this->whenLoaded('funcao')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}