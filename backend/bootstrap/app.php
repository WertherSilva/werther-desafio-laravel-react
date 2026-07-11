<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Auth\AuthenticationException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Garantir que a acentuação venha visivelmente correta (unescaped) nos JSONs
        $middleware->appendToGroup('api', \App\Http\Middleware\ForceJsonUnescaped::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (AuthenticationException $e, $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'message' => 'User not authenticated.',
                ], 401);
            }
        });

        $exceptions->render(function (JWTException $e, $request) {
            return response()->json([
                'message' => 'Token was missing.',
                'error' => 'missing_token',
            ], 401);
        });

        $exceptions->render(function (TokenInvalidException $e, $request) {
            return response()->json([
                'message' => 'Invalid token.',
                'error' => 'invalid_token',
            ], 401);
        });

        $exceptions->render(function (TokenExpiredException $e, $request) {
            return response()->json([
                'message' => 'Expired token, please login again.',
                'error' => 'expired_token',
            ], 401);
        });
    })->create();
