<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\AuthenticationException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Garantir que a acentuação venha visivelmente correta (unescaped) nos Jsons
        $middleware->appendToGroup('api', \App\Http\Middleware\ForceJsonUnescaped::class);

        // Garantir que a resposta de todos os requests de rotas válidas seja sempre em Json
        $middleware->prependToGroup('api', \App\Http\Middleware\ForceJsonResponse::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Garantir que erros como rota não encontrada sejam retornatos no formato Json
        $exceptions->shouldRenderJsonWhen(function ($request, Throwable $e) {
            return true;
        });

        $exceptions->render(function (AuthenticationException $e, $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json(
                    [
                        'message' => 'Usuário não autenticado.',
                        'error' => 'user_not_authenticated',
                    ],
                    401
                )->setEncodingOptions(JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            }
        });

        $exceptions->render(function (JWTException $e, $request) {
            return response()->json(
                [
                    'message' => 'Token não encontrado.',
                    'error' => 'missing_token',
                ],
                401)->setEncodingOptions(JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        });

        $exceptions->render(function (TokenInvalidException $e, $request) {
            return response()->json(
                [
                    'message' => 'Token inválido.',
                    'error' => 'invalid_token',
                ],
                401)->setEncodingOptions(JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        });

        $exceptions->render(function (TokenExpiredException $e, $request) {
            return response()->json(
                [
                    'message' => 'Token expirado, faça login novamente.',
                    'error' => 'expired_token',
                ],
                401)->setEncodingOptions(JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        });

        $exceptions->render(function (NotFoundHttpException $e, $request) {
        return response()->json([
            'message' => 'Item não encontrado.',
            'error' => 'item_not_found',
        ], 404);
    });
    })->create();
