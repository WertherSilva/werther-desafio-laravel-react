<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

class Orgao extends Model
{
    protected $fillable = [
        'sigla',
        'nome',
        'ativo'
    ];

    protected $appends = [
        'status'
    ];

    protected $hidden = [
        'ativo'
    ];

    protected function casts(): array
    {
        return [
            'ativo' => 'boolean',
        ];
    }

    protected function status(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->ativo ? 'ativo' : 'inativo'
        );
    }

    public function unidadesGestoras(): HasMany
    {
        return $this->hasMany(UnidadeGestora::class);
    }

    public function orcamentos(): HasManyThrough
    {
        return $this->hasManyThrough(Orcamento::class, UnidadeGestora::class);
    }

    #[Scope]
    public function ativo(Builder $query): void
    {
        $query->where('ativo', true);
    }
}