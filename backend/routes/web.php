<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/login', function (Request $request) {
    return response()->json(['message' => 'Invalid route.'], 401);
})->name('login');
