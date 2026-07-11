<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Closure;

class ForceJsonResponse
{
    public function handle(Request $request, Closure $next)
    {
        $request->headers->set('Accept', 'application/json');

        return $next($request);
    }
}