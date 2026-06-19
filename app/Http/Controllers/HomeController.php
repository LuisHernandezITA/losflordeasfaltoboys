<?php

namespace App\Http\Controllers;

// CORREGIDO: Se cambió de 'Product' a 'Products' para coincidir con tu modelo real
use App\Models\Products; 
use App\Models\Blog;    
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // Por si necesitas usar DB query builder en el futuro

class HomeController extends Controller
{
    public function index()
    {
        try {
            // 1. Obtener el último blog subido (ordena por id desc)
            $ultimoBlog = Blog::orderBy('id', 'desc')->first();

            // 2. Obtener los últimos 3 productos subidos
            // CORREGIDO: Usamos el modelo real 'Products' y ordenamos por ID de la misma manera que en tu método newest()
            $ultimosProductos = Products::orderBy('id', 'desc')
                ->take(20)
                ->get();

            // Retorno exitoso en formato JSON
            return response()->json([
                'ultimoBlog' => $ultimoBlog,
                'productos'  => $ultimosProductos
            ], 200);

        } catch (\Exception $e) {
            // En caso de que ocurra otro fallo (ej. que la tabla blog no exista aún), 
            // este bloque evitará que React se quede en blanco y te dirá exactamente qué pasó en los logs de Laravel.
            return response()->json([
                'error' => 'Fallo en el servidor',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}