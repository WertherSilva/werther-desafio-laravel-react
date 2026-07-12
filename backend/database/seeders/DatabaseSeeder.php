<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Orgao;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'analista@seplag.rj.gov.br'],
            [
                'name' => 'Analista Seplag',
                'email' => 'analista@seplag.rj.gov.br',
                'password' => 'orcamento@2026',
            ]
        );

        $this->call([
            OrcamentoSeeder::class,
        ]);
    }
}
