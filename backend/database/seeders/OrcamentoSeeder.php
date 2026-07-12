<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\File;
use App\Models\Acao;
use App\Models\Contrato;
use App\Models\FonteRecurso;
use App\Models\Fornecedor;
use App\Models\Funcao;
use App\Models\NaturezaDespesa;
use App\Models\Orcamento;
use App\Models\Orgao;
use App\Models\Programa;
use App\Models\Subfuncao;
use App\Models\UnidadeGestora;
use Illuminate\Database\Seeder;

class OrcamentoSeeder extends Seeder
{
    private array $dados;

    public function run(): void
    {
       $json = File::get(database_path('seeders/data/dados-referencia.json'));
       $this->dados = json_decode($json, true);

        $this->seedOrgaos();
        $this->seedUnidadesGestoras();
        $this->seedProgramas();
        $this->seedAcoes();
        $this->seedFuncoes();
        $this->seedNaturezasDespesa();
        $this->seedFontesRecurso();
        $this->seedFornecedores();
        $this->seedOrcamentos();
        $this->seedContratos();

        $this->command->info('Seeders executados com sucesso.');
    }

    private function seedOrgaos(): void
    {
        foreach ($this->dados['orgaos'] as $orgao) {
            Orgao::updateOrCreate(
                ['sigla' => $orgao['sigla']],
                [
                    'sigla' => $orgao['sigla'],
                    'nome' => $orgao['nome'],
                    'ativo' => fake()->boolean(),
                ]
            );
        }

        $this->command->info('Orgaos criados: ' . Orgao::count());
    }

    private function seedUnidadesGestoras(): void
    {
        foreach ($this->dados['unidades_gestoras_exemplos'] as $unidadeGestora) {
            $orgaoId = fake()->numberBetween(1, count($this->dados['orgaos']));

            UnidadeGestora::updateOrCreate(
                ['nome' => $unidadeGestora, 'orgao_id' => $orgaoId],
                ['nome' => $unidadeGestora, 'orgao_id' => $orgaoId]
            );
        }

        $this->command->info('Unidades Gestoras criadas: ' . UnidadeGestora::count());
    }

    private function seedProgramas(): void
    {
        foreach ($this->dados['programas'] as $programa) {
            Programa::updateOrCreate(
                ['codigo' => $programa['codigo']],
                ['codigo' => $programa['codigo'], 'nome' => $programa['nome']]
            );
        }

        $this->command->info('Programas criados: ' . Programa::count());
    }

    private function seedAcoes(): void
    {
        $programasPorCodigo = Programa::pluck('id', 'codigo');

        foreach ($this->dados['acoes'] as $acao) {
            $programaId = $programasPorCodigo[$acao['programa']] ?? null;

            Acao::updateOrCreate(
                ['codigo' => $acao['codigo']],
                ['codigo' => $acao['codigo'], 'nome' => $acao['nome'], 'programa_id' => $programaId]
            );
        }

        $this->command->info('Acoes criadas: ' . Acao::count());
    }

    private function seedFuncoes(): void
    {
        foreach ($this->dados['funcoes'] as $funcao) {
            $funcaoCriada = Funcao::updateOrCreate(
                ['codigo' => $funcao['codigo']],
                ['codigo' => $funcao['codigo'], 'nome' => $funcao['nome']]
            );

            $this->seedSubfuncoes($funcao['subfuncoes'], $funcaoCriada->id);
        }

        $this->command->info('Funcoes criadas: ' . Funcao::count());
        $this->command->info('Subfuncoes criadas: ' . Subfuncao::count());
    }

    private function seedSubfuncoes(array $subfuncoes, int $funcaoId): void
    {
        foreach ($subfuncoes as $subfuncao) {
            Subfuncao::updateOrCreate(
                ['nome' => $subfuncao],
                ['nome' => $subfuncao, 'funcao_id' => $funcaoId]
            );
        }
    }

    private function seedNaturezasDespesa(): void
    {
        foreach ($this->dados['naturezas_despesa'] as $nome) {
            NaturezaDespesa::updateOrCreate(
                ['nome' => $nome],
                ['nome' => $nome]
            );
        }

        $this->command->info('Naturezas Despesa criadas: ' . NaturezaDespesa::count());
    }

    private function seedFontesRecurso(): void
    {
        foreach ($this->dados['fontes_recurso'] as $nome) {
            FonteRecurso::updateOrCreate(
                ['nome' => $nome],
                ['nome' => $nome]
            );
        }

        $this->command->info('Fontes Recurso criadas: ' . FonteRecurso::count());
    }

    private function seedFornecedores(): void
    {
        foreach ($this->dados['fornecedores'] as $nome) {
            Fornecedor::updateOrCreate(
                ['nome' => $nome],
                ['nome' => $nome]
            );
        }

        $this->command->info('Fornecedores criados: ' . Fornecedor::count());
    }

    private function seedOrcamentos(): void
    {
        $unidadesGestorasIds = UnidadeGestora::pluck('id')->toArray();
        $acoesIds = Acao::pluck('id')->toArray();
        $subfuncoesIds = Subfuncao::pluck('id')->toArray();
        $naturezasDespesaIds = NaturezaDespesa::pluck('id')->toArray();
        $fontesRecursoIds = FonteRecurso::pluck('id')->toArray();

        $foreignKeys = fn () => [
            'unidade_gestora_id' => fake()->randomElement($unidadesGestorasIds),
            'acao_id' => fake()->randomElement($acoesIds),
            'subfuncao_id' => fake()->randomElement($subfuncoesIds),
            'natureza_despesa_id' => fake()->randomElement($naturezasDespesaIds),
            'fonte_recurso_id' => fake()->randomElement($fontesRecursoIds),
        ];

        // Criar metade dos orcamentos já revisados
        Orcamento::factory()->count(250)->create($foreignKeys);
        Orcamento::factory()->count(250)->revisado()->create($foreignKeys);

        $this->command->info('Orcamentos criados: ' . Orcamento::count());
    }

    private function seedContratos(): void
    {
        // Deixar 50 dos 500 orcamentos sem contratos
        $orcamentosIds = Orcamento::inRandomOrder()->take(450)->pluck('id')->toArray();

        $fornecedoresIds = Fornecedor::pluck('id')->toArray();

        $foreignKeys = fn () => [
            'orcamento_id' => fake()->randomElement($orcamentosIds),
            'fornecedor_id' => fake()->randomElement($fornecedoresIds),
        ];

        Contrato::factory()->count(120)->vigente()->create($foreignKeys);
        Contrato::factory()->count(90)->vencido()->create($foreignKeys);
        Contrato::factory()->count(60)->encerrado()->create($foreignKeys);
        Contrato::factory()->count(30)->suspenso()->create($foreignKeys);

        $this->command->info('Contratos criados: ' . Contrato::count());
    }
}
