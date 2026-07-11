<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Orgao;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::updateOrCreate(
            ['email' => 'analista@seplag.rj.gov.br'],
            [
                'name' => 'Analista Seplag',
                'email' => 'analista@seplag.rj.gov.br',
                'password' => 'orcamento@2026',
            ]
        );

        $orgaos = [
            ['sigla' => 'SEPLAG', 'nome' => 'Secretaria de Estado de Planejamento e Gestão', 'ativo' => true],
            ['sigla' => 'SEEDUC', 'nome' => 'Secretaria de Estado de Educação', 'ativo' => true],
            ['sigla' => 'SES', 'nome' => 'Secretaria de Estado de Saúde', 'ativo' => true],
            ['sigla' => 'SEFAZ', 'nome' => 'Secretaria de Estado de Fazenda', 'ativo' => true],
            ['sigla' => 'SEINFRA', 'nome' => 'Secretaria de Estado de Infraestrutura e Obras', 'ativo' => true],
            ['sigla' => 'SEAS', 'nome' => 'Secretaria de Estado de Assistência Social e Direitos Humanos', 'ativo' => true],
            ['sigla' => 'SECTI', 'nome' => 'Secretaria de Estado de Ciência, Tecnologia e Inovação', 'ativo' => true],
            ['sigla' => 'SEAGRO', 'nome' => 'Secretaria de Estado de Agricultura, Pecuária e Abastecimento', 'ativo' => true],
            ['sigla' => 'SETUR', 'nome' => 'Secretaria de Estado de Turismo', 'ativo' => false],
            ['sigla' => 'SEAMB', 'nome' => 'Secretaria de Estado do Ambiente e Sustentabilidade', 'ativo' => false],
            ['sigla' => 'CASA CIVIL', 'nome' => 'Secretaria de Estado da Casa Civil', 'ativo' => true],
            ['sigla' => 'PMERJ', 'nome' => 'Polícia Militar do Estado do Rio de Janeiro', 'ativo' => false],
            ['sigla' => 'PCERJ', 'nome' => 'Polícia Civil do Estado do Rio de Janeiro', 'ativo' => true],
            ['sigla' => 'CBMERJ', 'nome' => 'Corpo de Bombeiros Militar do Estado do Rio de Janeiro', 'ativo' => true],
            ['sigla' => 'DETRAN-RJ', 'nome' => 'Departamento de Trânsito do Estado do Rio de Janeiro', 'ativo' => true],
            ['sigla' => 'DER-RJ', 'nome' => 'Departamento de Estradas de Rodagem do Estado do Rio de Janeiro', 'ativo' => false],
            ['sigla' => 'FAETEC', 'nome' => 'Fundação de Apoio à Escola Técnica', 'ativo' => true],
            ['sigla' => 'EMOP', 'nome' => 'Empresa de Obras Públicas do Estado do Rio de Janeiro', 'ativo' => false],
            ['sigla' => 'UERJ', 'nome' => 'Universidade do Estado do Rio de Janeiro', 'ativo' => true],
            ['sigla' => 'PGE', 'nome' => 'Procuradoria Geral do Estado', 'ativo' => true],
        ];

        foreach ($orgaos as $orgao) {
            Orgao::updateOrCreate(
                ['sigla' => $orgao['sigla']],
                $orgao
            );
        }
    }
}
