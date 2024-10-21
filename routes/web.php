<?php

use App\Http\Controllers\BrandController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\RetailController;
use App\Http\Controllers\InventoryController;
use Inertia\Inertia;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TypeController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SupplierController;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');



Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::get('/categories/create', [CategoryController::class, 'create'])->name('categories.create');
    Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    Route::get('/locations', [LocationController::class, 'index'])->name('locations.index');
    Route::post('/locations', [LocationController::class, 'store'])->name('locations.store');
    Route::get('/locations/create', [LocationController::class, 'create'])->name('locations.create');
    Route::put('/locations/{location}', [LocationController::class, 'update'])->name('locations.update');
    Route::delete('/locations/{location}', [LocationController::class, 'destroy'])->name('locations.destroy');
    Route::get('/locations/{location}', [LocationController::class, 'show'])->name('locations.show');

    Route::get('/products', [ProductController::class, 'index'])->name('product.index');
    Route::post('/products', [ProductController::class, 'store'])->name('product.store');
    Route::get('/products/create', [ProductController::class, 'create'])->name('product.create');
    Route::put('/products/{product}', [ProductController::class, 'update'])->name('product.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('product.destroy');
    Route::get('/products/generate-qr/{id}', [ProductController::class, 'generateQr'])->name('product.generate-qr');

    Route::get('/brands', [BrandController::class, 'index'])->name('brand.index');
    Route::post('/brands', [BrandController::class, 'store'])->name('brand.store');
    Route::get('/brands/create', [BrandController::class, 'create'])->name('brand.create');
    Route::delete('/brands/{brand}', [BrandController::class, 'destroy'])->name('brand.destroy');
    Route::put('/brands/{brand}', [BrandController::class, 'update'])->name('brand.update');

    Route::get('/inventory', [InventoryController::class, 'index'])->name('inventory.index');
    Route::get('/inventory/create', [InventoryController::class, 'create'])->name('inventory.create');
    Route::post('/inventory/create', [InventoryController::class, 'store'])->name('inventory.store');
    Route::put('/inventory/{inventory}', [InventoryController::class, 'update'])->name('inventory.update');
    Route::delete('/inventory/{inventory}', [InventoryController::class, 'destroy'])->name('inventory.destroy');
    Route::put('/inventory/stock-in/{inventory}', [InventoryController::class, 'stockIn'])->name('inventory.stock-in');
    Route::put('/inventory/stock-out/{inventory}', [InventoryController::class, 'stockOut'])->name('inventory.stock-out');
    Route::put('/inventory/move-stock/{inventory}', [InventoryController::class, 'moveStock'])->name('inventory.move-stock');

    Route::get('/suppliers', [SupplierController::class, 'index'])->name('supplier.index');
    Route::get('/suppliers/create', [SupplierController::class, 'create'])->name('supplier.create');
    Route::post('/suppliers', [SupplierController::class, 'store'])->name('supplier.store');
    Route::delete('/suppliers/{supplier}', [SupplierController::class, 'destroy'])->name('supplier.destroy');
    Route::put('/suppliers/{supplier}', [SupplierController::class, 'update'])->name('supplier.update');


    Route::get('/retails', [RetailController::class, 'index'])->name('retail.index');
    Route::post('/retails', [RetailController::class, 'store'])->name('retail.store');
    Route::get('/retails/create', [RetailController::class, 'create'])->name('retail.create');
    Route::put('/retails/{retail}', [RetailController::class, 'update'])->name('retails.update');
    Route::get('/retails/{retail}', [RetailController::class, 'show'])->name('retails.show');
    Route::delete('/retails/{retail}', [RetailController::class, 'destroy'])->name('retail.destroy');
    Route::post('/retails/extend/{retail}', [RetailController::class, 'extendSubscription'])->name('retail.extend');


    Route::get('/types', [TypeController::class, 'index'])->name('type.index');
    Route::post('/types', [TypeController::class, 'store'])->name('type.store');
    Route::get('/types/create', [TypeController::class, 'create'])->name('type.create');
    Route::put('/types/{type}', [TypeController::class, 'update'])->name('type.update');
    Route::delete('/types/{type}', [TypeController::class, 'destroy'])->name('type.destroy');


    Route::get('/stock-movements', [StockMovementController::class, 'index'])->name('stock-movements.index');
    Route::get('/stock-movements/download', [StockMovementController::class, 'download'])->name('stock-movements.download');
    Route::get('/stock-movements/print-pdf', [StockMovementController::class, 'printPdf'])->name('stock-movements.print-pdf');
});






require __DIR__ . '/auth.php';
