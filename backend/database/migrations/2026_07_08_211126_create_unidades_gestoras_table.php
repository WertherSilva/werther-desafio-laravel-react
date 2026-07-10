<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('unidades_gestoras', function (Blueprint $table) {
            $table->id();

            $table->string('nome')->nullable();

            /* Restrict para só permitir apagar um órgão depois
            de mover as unidades gestoras para outro órgão */
            $table->foreignId('orgao_id')
                ->nullable()
                ->constrained('orgaos')
                ->restrictOnDelete(); 

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('unidades_gestoras');
    }
};
