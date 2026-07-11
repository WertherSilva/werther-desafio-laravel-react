<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Orgao extends Model
{
    protected $fillable = [
        'sigla',
        'nome',
        'ativo'
    ];

    protected function casts(): array
    {
        return [
            'ativo' => 'boolean',
        ];
    }

    public function unidadesGestoras(): HasMany
    {
        return $this->hasMany(UnidadeGestora::class);
    }

    public function orcamentos(): HasManyThrough
    {
        return $this->hasManyThrough(Orcamento::class, UnidadeGestora::class);
    }
}