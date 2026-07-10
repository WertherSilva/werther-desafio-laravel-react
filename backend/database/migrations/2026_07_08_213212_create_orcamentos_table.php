<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orcamentos', function (Blueprint $table) {
            $table->id();

            /* Foi utilizado unsignedSmallInteger pois suporta valores até
            65.535 ocupando menos espaço que o Integer padrão */
            $table->unsignedSmallInteger('ano')->nullable();

            // Tamanho de 15 para ser capaz de armazenar até a casa de trilhões
            $table->decimal('dotacao_inicial', 15, 2)->nullable();
            $table->decimal('suplementacoes', 15, 2)->nullable()->default(0);
            $table->decimal('anulacoes', 15, 2)->nullable()->default(0);
            $table->decimal('dotacao_atualizada', 15, 2)->nullable();
            $table->decimal('valor_empenhado', 15, 2)->nullable();
            $table->decimal('valor_liquidado', 15, 2)->nullable();
            $table->decimal('valor_pago', 15, 2)->nullable();

            $table->foreignId('unidade_gestora_id')
                ->nullable()
                ->constrained('unidades_gestoras')
                ->restrictOnDelete();

            $table->foreignId('acao_id')
                ->nullable()
                ->constrained('acoes')
                ->restrictOnDelete();

            $table->foreignId('subfuncao_id')
                ->nullable()
                ->constrained('subfuncoes')
                ->restrictOnDelete();

            $table->foreignId('natureza_despesa_id')
                ->nullable()
                ->constrained('naturezas_despesa')
                ->restrictOnDelete();

            $table->foreignId('fonte_recurso_id')
                ->nullable()
                ->constrained('fontes_recurso')
                ->restrictOnDelete();

            $table->foreignId('revisor_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('revisado_em')->nullable();
            $table->timestamps();

            $table->index('ano');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orcamentos');
    }
};
