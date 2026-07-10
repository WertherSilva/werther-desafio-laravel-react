<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subfuncoes', function (Blueprint $table) {
            $table->id();

            $table->string('codigo')->nullable();
            $table->string('nome')->nullable();

            $table->foreignId('funcao_id')
                ->nullable()
                ->constrained('funcoes')
                ->restrictOnDelete(); 

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subfuncoes');
    }
};
