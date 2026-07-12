<?php

namespace Database\Factories;

use App\Models\Orcamento;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrcamentoFactory extends Factory
{
    protected $model = Orcamento::class;

    public function definition(): array
    {
        /* Utilizei fake()->boolean(90) nos atributos para ter 10% de
        chance de os atributos serem nulos ou terem valores inconsistentes */

        $ano = fake()->boolean(90) ?
            fake()->numberBetween(2022, 2026) :
            null;

        $dotacaoInicial = fake()->boolean(90) ?
            fake()->randomFloat(2, 1000000, 50000000) :
            null;

        $suplementacoes = fake()->boolean(90) ?
            fake()->randomFloat(2, 0, 10000000) :
            ($dotacaoInicial ?? 0) + fake()->randomFloat(2, -1000000, 0);

        $anulacoes = fake()->boolean(90) ?
            fake()->randomFloat(2, 0, $dotacaoInicial ?? 0) :
            fake()->randomFloat(2, $dotacaoInicial ?? 0, 1000000);

        $dotacaoAtualizada = ($dotacaoInicial ?? 0) + $suplementacoes - $anulacoes;

        $valorEmpenhado = fake()->boolean(90) ?
            fake()->randomFloat(2, 0, max($dotacaoAtualizada, 0)) :
            fake()->randomFloat(2, max($dotacaoAtualizada, 0), max($dotacaoAtualizada, 0) + 1000000);

        $valorLiquidado = fake()->boolean(90) ?
            fake()->randomFloat(2, 0, $valorEmpenhado) :
            fake()->randomFloat(2, $valorEmpenhado, $valorEmpenhado + 1000000);

        $valorPago = fake()->boolean(90) ?
            fake()->randomFloat(2, 0, $valorLiquidado) :
            fake()->randomFloat(2, $valorLiquidado, $valorLiquidado + 1000000);

        return [
            'ano' => $ano,
            'dotacao_inicial' => $dotacaoInicial,
            'suplementacoes' => $suplementacoes,
            'anulacoes' => $anulacoes,
            'valor_empenhado' => $valorEmpenhado,
            'valor_liquidado' => $valorLiquidado,
            'valor_pago' => $valorPago,
            'revisor_id' => null,
            'revisado_em' => null,
        ];
    }

    public function revisado(): static
    {
        return $this->state(fn () => [
            'revisor_id' => \App\Models\User::inRandomOrder()->value('id'),
            'revisado_em' => fake()->dateTimeBetween('-1 year', 'now'),
            'observacao_revisao' => fake()->sentence(10),
        ]);
    }
}
