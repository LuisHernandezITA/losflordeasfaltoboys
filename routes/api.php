<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\AccessTokensController;
use App\Http\Controllers\ProductColorsController;
use App\Http\Controllers\ProductSizesController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ColorController;
use App\Http\Controllers\SizeController;
use App\Http\Controllers\ShoppingCartController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\MusicController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\BlogController; 
use App\Http\Controllers\HomeController;
use App\Http\Controllers\GalleryController; // <-- Controlador de Galería y Publicidad Irónica

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- 1. RUTAS PÚBLICAS (Cualquier visitante las ve) ---
Route::post('register', [RegisterController::class, 'register']);
Route::post('login', [RegisterController::class, 'login']);

// RUTA PARA LA VISTA PRINCIPAL (Trae el último blog y los 3 productos)
Route::get('/home_data', [HomeController::class, 'index']); 

Route::get('/products_index', [ProductsController::class, 'index']);
Route::get('/products_newest', [ProductsController::class, 'newest']);
Route::post('/products_show', [ProductsController::class, 'show']);

Route::get('/category_index', [CategoryController::class, 'index']);
Route::get('/color_index', [ColorController::class, 'index']);
Route::get('/size_index', [SizeController::class, 'index']);
Route::get('/banners_index', [BannerController::class, 'index']);
Route::get('/music_index', [MusicController::class, 'index']);

Route::get('/events_index', [EventController::class, 'index']); 
Route::post('/events_show', [EventController::class, 'show']);

// --- NUEVAS RUTAS PÚBLICAS PARA EL BLOG ---
Route::get('/blogs_index', [BlogController::class, 'index']); 
Route::post('/blogs_show', [BlogController::class, 'show']);   

Route::post('/getProductSizes', [ProductSizesController::class, 'getProductSizes']);
Route::post('/getProductColors', [ProductColorsController::class, 'getProductColors']);

// --- NUEVAS RUTAS PÚBLICAS PARA LA GALERÍA Y PUBLICIDAD ---
Route::get('/gallery_artworks', [GalleryController::class, 'getArtworks']); 
Route::get('/gallery_active_ad', [GalleryController::class, 'getActiveAd']);


// --- 2. RUTAS PARA USUARIOS NORMALES (Clientes logueados) ---
Route::middleware(['auth:api'])->group(function () {
    
    // Perfil de usuario y Tokens de sesión
    Route::post('/user_show', [UserController::class, 'show']);
    $table = Route::get('/accesstokens_index', [AccessTokensController::class, 'index']);
    Route::delete('/accesstokens/destroy', [AccessTokensController::class, 'destroy']);

    // Carrito de compras
    Route::post('/addcart', [ShoppingCartController::class, 'addToCart']);
    Route::post('/getProductsInCart', [ShoppingCartController::class, 'getProductsInCart']);
    Route::post('/updateQuantity', [ShoppingCartController::class, 'updateQuantity']);
    Route::post('/removeProductFromCart', [ShoppingCartController::class, 'removeProductFromCart']);
});


// --- 3. RUTAS EXCLUSIVAS PARA ADMINISTRADORES ---
Route::middleware(['auth:api', 'isAdmin'])->group(function () {

    // Gestión de Usuarios
    Route::get('/user_index', [UserController::class, 'index']);
    Route::delete('/user_destroy/{id}', [UserController::class, 'destroy']);

    // CRUD Categorías
    Route::get('categories/{id}/edit', [CategoryController::class, 'edit']);
    Route::post('categories_store', [CategoryController::class, 'store']);
    Route::put('categories_update/{id}', [CategoryController::class, 'update']);
    Route::delete('categories_destroy/{id}', [CategoryController::class, 'destroy']);

    // CRUD Banners
    Route::get('banners/{id}/edit', [BannerController::class, 'edit']);
    Route::post('banners_store', [BannerController::class, 'store']);
    Route::put('banners_update/{id}', [BannerController::class, 'update']);
    Route::delete('banners_destroy/{id}', [BannerController::class, 'destroy']);

    // CRUD Music
    Route::post('/music_store', [MusicController::class, 'store']);
    Route::get('/music_edit/{id}', [MusicController::class, 'edit']);
    Route::put('/music_update/{id}', [MusicController::class, 'update']);
    Route::delete('/music_destroy/{id}', [MusicController::class, 'destroy']);

    // CRUD Productos (Completo)
    Route::get('/products/{id}/edit', [ProductsController::class, 'edit']);
    Route::post('/products_store', [ProductsController::class, 'store']); 
    Route::put('/products_update/{id}', [ProductsController::class, 'update']); 
    Route::delete('/products_destroy/{id}', [ProductsController::class, 'destroy']);

    // Gestión de Atributos de Producto (Colores y Tallas)
    Route::post('/productcolors_store', [ProductColorsController::class, 'store']);
    Route::delete('/productcolors_destroy/{id}', [ProductColorsController::class, 'destroy']);
    Route::post('/productsizes_store', [ProductSizesController::class, 'store']);
    Route::delete('/productsizes_destroy/{id}', [ProductSizesController::class, 'destroy']);

    // CRUD DE EVENTOS (LOOKBOOKS)
    Route::post('/events_store', [EventController::class, 'store']);       
    Route::post('/events_edit', [EventController::class, 'edit']);         
    Route::put('/events_update/{id}', [EventController::class, 'update']); 
    Route::delete('/events_destroy/{id}', [EventController::class, 'destroy']); 

    // --- NUEVO CRUD DE BLOGS PARA EL ADMINISTRADOR ---
    Route::post('/blogs_store', [BlogController::class, 'store']);         
    Route::post('/blogs_edit', [BlogController::class, 'edit']);           
    Route::put('/blogs_update/{id}', [BlogController::class, 'update']);   
    Route::delete('/blogs_destroy/{id}', [BlogController::class, 'destroy']); 

    // --- NUEVO CRUD DE GALERÍA Y PUBLICIDAD PARA EL ADMINISTRADOR ---
    Route::post('/gallery_store', [GalleryController::class, 'store']);         
    Route::post('/gallery_edit', [GalleryController::class, 'edit']);           
    Route::put('/gallery_update/{id}', [GalleryController::class, 'update']);   
    Route::delete('/gallery_destroy/{id}', [GalleryController::class, 'destroy']); 
    Route::post('/gallery_update_ad', [GalleryController::class, 'updateParodyAd']); // Ruta directa para el Banner de Publicidad
});