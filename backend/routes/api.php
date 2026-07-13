<?php

use App\Http\Controllers\AcaoController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContratoController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrcamentoController;
use App\Http\Controllers\OrgaoController;
use App\Http\Controllers\ProgramaController;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    
    Route::middleware('auth:api')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

Route::middleware('auth:api')->group(function () {
    Route::get('/teste', function () {
        return 'se estou vendo isso estou autenticado';
    });
    
    Route::prefix('orcamentos')->group(function () {
        Route::get('/', [OrcamentoController::class, 'search']);
        Route::get('/{id}', [OrcamentoController::class, 'findById'])->whereNumber('id');
        Route::patch('/{id}/revisao', [OrcamentoController::class, 'revisar'])->whereNumber('id');
    });
        
    Route::get('/orgaos', [OrgaoController::class, 'search']);
    Route::get('/contratos', [ContratoController::class, 'search']);
    Route::get('/programas', [ProgramaController::class, 'index']);
    Route::get('/acoes', [AcaoController::class, 'index']);
    Route::get('/dashboard', [DashboardController::class, 'get']);
});
