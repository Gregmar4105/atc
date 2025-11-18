<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AtcApiController;
use App\Http\Controllers\NotamController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//api route for n8n
Route::get('/weather', [AtcApiController::class, 'getWeather']);

// FIX: Removed the line break in the route definition to fix the 404 error.
Route::post('/generate-batch-notams', [NotamController::class, 'generateBatch']);