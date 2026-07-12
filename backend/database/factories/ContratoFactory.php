<?php

namespace Database\Factories;

use App\Models\Contrato;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContratoFactory extends Factory
{
    protected $model = Contrato::class;

    public function definition(): array
    {
        $dataInicio = fake()->dateTimeBetween('-3 years', '-6 months');
        $dataFim = fake()->dateTimeBetween($dataInicio, '+2 years');
        $numero = fake()->unique()->randomNumber(3) . '/' . $dataInicio->format('Y');
        $objeto = fake()->unique()->sentence(10);
        $valor = fake()->randomFloat(2, 10000, 5000000);

        return [
            'numero' => $numero,
            'objeto' => $objeto,
            'valor' => $valor,
            'data_inicio' => $dataInicio,
            'data_fim' => $dataFim,
            'suspenso_em' => null,
            'encerrado_em' => null,
        ];
    }

    public function vigente(): static
    {
        return $this->state(fn () => [
            'data_fim' => fake()->dateTimeBetween('+1 month', '+2 years'),
            'suspenso_em' => null,
            'encerrado_em' => null,
        ]);
    }

    public function vencido(): static
    {
        return $this->state(fn () => [
            'data_fim' => fake()->dateTimeBetween('-2 years', '-1 month'),
            'suspenso_em' => null,
            'encerrado_em' => null,
        ]);
    }

    public function suspenso(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'encerrado_em' => null,
                'suspenso_em' => fake()->dateTimeBetween($attributes['data_inicio'], $attributes['data_fim']),
            ];
        });
    }

    public function encerrado(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'suspenso_em' => null,
                'encerrado_em' => fake()->dateTimeBetween($attributes['data_inicio'], $attributes['data_fim']),
            ];
        });
    }
}
