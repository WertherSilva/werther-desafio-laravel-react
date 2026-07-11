<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrgaoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'sigla' => $this->nome,
            'nome' => $this->nome,
            'ativo' => $this->ativo,
        ];
    }
}
