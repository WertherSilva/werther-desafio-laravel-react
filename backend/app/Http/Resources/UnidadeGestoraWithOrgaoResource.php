<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UnidadeGestoraWithOrgaoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'orgao_id' => $this->orgao_id,
            'orgao' => new OrgaoResource($this->whenLoaded('orgao')),
        ];
    }
}