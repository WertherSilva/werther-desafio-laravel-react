<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Funcao extends Model
{
    protected $table = 'funcoes';

    protected $fillable = [
        'codigo',
        'nome'
    ];

    public function subfuncoes(): HasMany
    {
        return $this->hasMany(Subfuncao::class);
    }

    public function orcamentos(): HasManyThrough
    {
        return $this->hasManyThrough(Orcamento::class, Subfuncao::class);
    }
}
