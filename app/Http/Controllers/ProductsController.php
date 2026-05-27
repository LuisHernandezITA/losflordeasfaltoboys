<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProductsController extends Controller
{
    public function index()
    {
        // Es mejor usar el Modelo para mantener consistencia, pero dejamos el get original
        $products = DB::table('products')->get();
        return response()->json($products, 200);
    }

    public function newest()
    {
        $products = DB::table('products')
            ->orderBy('id', 'desc')
            ->take(6)
            ->get();

        return response()->json($products, 200);
    }

    public function show(Request $request)
    {
        // .get() devuelve una colección. Si buscas por ID, .first() o .find() es más limpio,
        // pero mantenemos tu lógica usando first para que no mande un array vacío si falla
        $product = Products::where('id', $request->id)->first();

        if ($product) {
            return response()->json($product, 200);
        } else {
            return response()->json(['message' => 'Product not found'], 404);
        }
    }

    public function store(Request $request)
    {
        // Aquí ya mapeamos los nuevos campos que venían en el modelo
        $product = Products::create([
            'name'            => $request->name,
            'description'     => $request->description,
            'category_id'     => $request->category_id,
            'price'           => $request->price,
            'available_stock' => $request->available_stock,
            'image_primary'   => $request->image_primary,   // Nuevo
            'image_detail_1'  => $request->image_detail_1,  // Nuevo
            'image_detail_2'  => $request->image_detail_2,  // Nuevo
            'seller_url'      => $request->seller_url,      // Nuevo
            'designer'        => $request->designer,        // Nuevo (Marca/Diseñador)
            'shipping_type'   => $request->shipping_type,   // Nuevo (Estado de entrega)
            'addition_date'   => Carbon::now(),
            'available'       => $request->available ?? true
        ]);

        // Nota: Products::create() ya guarda el registro automáticamente si usas Eloquent, 
        // no hace falta un $product->save() extra abajo.

        return response()->json($product, 210); // O 201 Created
    }

    public function edit(Request $request)
    {
        $product = Products::find($request->id);

        if ($product) {
            return response()->json($product, 200);
        } else {
            return response()->json(['message' => 'Product not found'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $product = Products::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Actualización con los nuevos campos asignados
        $product->name            = $request->input('name');
        $product->description     = $request->input('description');
        $product->category_id     = $request->input('category_id');
        $product->price           = $request->input('price');
        $product->available_stock = $request->input('available_stock');
        $product->image_primary   = $request->input('image_primary');   // Nuevo
        $product->image_detail_1  = $request->input('image_detail_1');  // Nuevo
        $product->image_detail_2  = $request->input('image_detail_2');  // Nuevo
        $product->seller_url      = $request->input('seller_url');      // Nuevo
        $product->designer        = $request->input('designer');        // Nuevo
        $product->shipping_type   = $request->input('shipping_type');   // Nuevo
        $product->addition_date   = $request->input('addition_date');
        $product->available       = $request->input('available');

        $product->save();

        return response()->json(['message' => 'Successfully updated product'], 200);
    }

    public function destroy($id)
    {
        $product = Products::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Elimina en cascada en el carrito antes de borrar el producto
        $product->shoppingCart()->delete();
        $product->delete();

        return response()->json(['message' => 'Successfully deleted product'], 200);
    }
}