<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Programa extends Model
{
    protected $fillable = [
        'codigo',
        'nome'
    ];

    public function acoes(): HasMany
    {
        return $this->hasMany(Acao::class);
    }

    public function orcamentos(): HasManyThrough
    {
        return $this->hasManyThrough(Orcamento::class, Acao::class);
    }
}
