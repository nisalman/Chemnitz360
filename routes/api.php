<?php

use Illuminate\Support\Facades\Route;

Route::get('/overpass', function () {
    $url = 'https://overpass-api.de/api/interpreter?data=[out:json];(node(around:1000,50.8323,12.9253)[amenity=theatre];node(around:1000,50.8323,12.9253)[amenity=restaurant];node(around:1000,50.8323,12.9253)[tourism=artwork];node(around:1000,50.8323,12.9253)[tourism=museum];);out;';
    return Http::get($url)->json();
});
