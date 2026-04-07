<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\GameController;
use App\Http\Controllers\Api\InstallController;
use App\Http\Controllers\Api\LookupController;

// Jogos
Route::get('/games',        [GameController::class, 'index']);
Route::get('/games/{slug}', [GameController::class, 'show']);

// Instalações
Route::get('/installs',                      [InstallController::class, 'index']);
Route::post('/installs',                     [InstallController::class, 'store']);
Route::patch('/installs/{id}/status',        [InstallController::class, 'updateStatus']);

// Lookups
Route::get('/genres',    [LookupController::class, 'genres']);
Route::get('/platforms', [LookupController::class, 'platforms']);
Route::get('/tags',      [LookupController::class, 'tags']);

// Rotas de administração — jogos
Route::get('/admin/games',         [App\Http\Controllers\Api\Admin\GameAdminController::class, 'index']);
Route::post('/admin/games',        [App\Http\Controllers\Api\Admin\GameAdminController::class, 'store']);
Route::get('/admin/games/{id}',    [App\Http\Controllers\Api\Admin\GameAdminController::class, 'show']);
Route::put('/admin/games/{id}',    [App\Http\Controllers\Api\Admin\GameAdminController::class, 'update']);
Route::delete('/admin/games/{id}', [App\Http\Controllers\Api\Admin\GameAdminController::class, 'destroy']);

// Rotas de administração — lookups
Route::post('/admin/genres',          [App\Http\Controllers\Api\Admin\LookupAdminController::class, 'storeGenre']);
Route::delete('/admin/genres/{id}',   [App\Http\Controllers\Api\Admin\LookupAdminController::class, 'destroyGenre']);
Route::post('/admin/platforms',       [App\Http\Controllers\Api\Admin\LookupAdminController::class, 'storePlatform']);
Route::delete('/admin/platforms/{id}',[App\Http\Controllers\Api\Admin\LookupAdminController::class, 'destroyPlatform']);
Route::post('/admin/tags',            [App\Http\Controllers\Api\Admin\LookupAdminController::class, 'storeTag']);
Route::delete('/admin/tags/{id}',     [App\Http\Controllers\Api\Admin\LookupAdminController::class, 'destroyTag']);

// Rotas de administração — versions
Route::post('/admin/versions',              [App\Http\Controllers\Api\Admin\VersionAdminController::class, 'store']);
Route::patch('/admin/versions/{id}/latest', [App\Http\Controllers\Api\Admin\VersionAdminController::class, 'setLatest']);
Route::delete('/admin/versions/{id}',       [App\Http\Controllers\Api\Admin\VersionAdminController::class, 'destroy']);

// Rotas de administração — screenshots
Route::post('/admin/screenshots',        [App\Http\Controllers\Api\Admin\ScreenshotAdminController::class, 'store']);
Route::patch('/admin/screenshots/{id}',  [App\Http\Controllers\Api\Admin\ScreenshotAdminController::class, 'update']);
Route::delete('/admin/screenshots/{id}', [App\Http\Controllers\Api\Admin\ScreenshotAdminController::class, 'destroy']);

// Rota de download
Route::post('/download/{versionId}/start',    [App\Http\Controllers\Api\DownloadController::class, 'start']);
Route::get('/download/{key}/progress',        [App\Http\Controllers\Api\DownloadController::class, 'progress']);
Route::get('/download/{key}/file',            [App\Http\Controllers\Api\DownloadController::class, 'file']);

// Rota de registro de versão (para o instalador)
Route::post('/admin/versions/register', [App\Http\Controllers\Api\Admin\VersionAdminController::class, 'register']);