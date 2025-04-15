<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AstromenList;

Route::get('/', [AstromenList::class, 'render'])->name('home');
Route::post('/edit', [AstromenList::class, 'editFormSent'])->name('edit');
Route::post('/new', [AstromenList::class, 'newFormSent'])->name('new');
Route::post('/delete', [AstromenList::class, 'deleteFormSent'])->name('delete');
Route::get('/astroman_exists', [AstromenList::class, 'astromanExists'])->name('astroman_exists');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
