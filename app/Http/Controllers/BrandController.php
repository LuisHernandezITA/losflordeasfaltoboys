<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BrandController extends Controller
{
    public function index()
    {
        // Retorna todas las marcas personalizadas con banners
        return DB::table('brands')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:brands,name',
            'banner_url' => 'required|string',
            'alt_text' => 'nullable|string',
        ]);

        $brand = Brand::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name), // Genera el slug automáticamente de forma segura
            'banner_url' => $request->banner_url,
            'alt_text' => $request->alt_text,
        ]);

        return response()->json($brand, 201);
    }

    public function edit($id)
    {
        $brand = Brand::find($id);
        return $brand ? $brand : response()->json(['message' => 'Brand not found'], 404);
    }

    public function update(Request $request, $id)
    {
        $brand = Brand::find($id);

        if (!$brand) {
            return response()->json(['message' => 'Brand not found'], 404);
        }

        $request->validate([
            'name' => 'required|string|unique:brands,name,' . $id,
            'banner_url' => 'required|string',
            'alt_text' => 'nullable|string',
        ]);

        $brand->name = $request->input('name');
        $brand->slug = Str::slug($request->input('name')); // Actualiza el slug si cambia el nombre
        $brand->banner_url = $request->input('banner_url');
        $brand->alt_text = $request->input('alt_text');

        $brand->save();

        return response()->json(['message' => 'Successfully updated brand'], 200);
    }

    public function destroy($id)
    {
        $brand = Brand::find($id);

        if (!$brand) {
            return response()->json(['message' => 'Brand not found'], 404);
        }

        $brand->delete();

        return response()->json(['message' => 'Successfully deleted brand'], 200);
    }
}