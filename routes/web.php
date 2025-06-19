<?php

use App\Http\Controllers\MapController;
use App\Http\Controllers\MapDirectoryController;
use Illuminate\Support\Facades\Route;

Route::get('/map', [MapController::class, 'index'])->name('map');

Route::get('/map-config', function () {
    return response()->json([
        'googleMapsApiKey' => env('GOOGLE_MAPS_API_KEY')
    ]);
});
Route::get('/', [MapDirectoryController::class, 'index']);

