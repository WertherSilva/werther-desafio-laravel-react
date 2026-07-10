<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contratos', function (Blueprint $table) {
            $table->id();

            $table->string('numero')->nullable();
            $table->string('objeto')->nullable();
            $table->decimal('valor', 15, 2)->nullable();
            $table->date('data_inicio')->nullable();
            $table->date('data_fim')->nullable();

            $table->foreignId('orcamento_id')
                ->nullable()
                ->constrained('orcamentos')
                ->nullOnDelete();

            $table->foreignId('fornecedor_id')
                ->nullable()
                ->constrained('fornecedores')
                ->nullOnDelete();

            $table->timestamp('suspenso_em')->nullable();
            $table->timestamp('encerrado_em')->nullable();
            $table->timestamps();

            // Campos utilizados para definir o status, utilizado como filtro no GET
            $table->index(['encerrado_em', 'suspenso_em', 'data_fim']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contratos');
    }
};
