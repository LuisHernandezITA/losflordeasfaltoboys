<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GalleryController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | METODOS PÚBLICOS (Para el Frontend de la Tienda)
    |--------------------------------------------------------------------------
    */

    /**
     * Obtiene el catálogo completo de obras artísticas expuestas.
     */
    public function getArtworks()
    {
        try {
            // Usamos el scope que definimos en el Modelo para aislar el arte
            $artworks = Gallery::onlyArtworks()->orderBy('year', 'desc')->get();
            
            return response()->json([
                'success' => true,
                'data' => $artworks
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Obtiene únicamente el banner activo de publicidad irónica.
     */
    public function getActiveAd()
    {
        try {
            // Buscamos el registro que tenga la bandera de parodia en true
            $activeAd = Gallery::onlyAds()->first();

            return response()->json([
                'success' => true,
                'data' => $activeAd
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | METODOS ADMINISTRATIVOS (CRUD Protegido para Obras)
    |--------------------------------------------------------------------------
    */

    /**
     * Guarda una nueva obra de arte en la base de datos.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title'     => 'required|string|max:255',
            'autor'     => 'required|string|max:255',
            'technique' => 'required|string|max:255',
            'year'      => 'required|integer',
            'image_url' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 400);
        }

        try {
            $artwork = Gallery::create([
                'title'        => $request->title,
                'autor'        => $request->autor,
                'technique'    => $request->technique,
                'year'         => $request->year,
                'image_url'    => $request->image_url,
                'is_parody_ad' => false // Forzamos que sea obra de arte
            ]);

            return response()->json(['success' => true, 'message' => 'Obra guardada con éxito', 'data' => $artwork], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Devuelve los datos de una obra específica para cargarla en el formulario de edición.
     */
    public function edit(Request $request)
    {
        // Buscamos mediante el id enviado en el cuerpo de la petición (siguiendo tu estándar actual)
        $artwork = Gallery::onlyArtworks()->find($request->id);

        if (!$artwork) {
            return response()->json(['success' => false, 'message' => 'Obra no encontrada'], 404);
        }

        return response()->json(['success' => true, 'data' => $artwork], 200);
    }

    /**
     * Actualiza los datos de una pieza artística.
     */
    public function update(Request $request, $id)
    {
        $artwork = Gallery::onlyArtworks()->find($id);

        if (!$artwork) {
            return response()->json(['success' => false, 'message' => 'Obra no encontrada'], 404);
        }

        try {
            $artwork->update($request->only(['title', 'autor', 'technique', 'year', 'image_url']));
            
            return response()->json(['success' => true, 'message' => 'Obra modificada correctamente', 'data' => $artwork], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Elimina de forma permanente una obra de la galería.
     */
    public function destroy($id)
    {
        $artwork = Gallery::onlyArtworks()->find($id);

        if (!$artwork) {
            return response()->json(['success' => false, 'message' => 'Obra no encontrada'], 404);
        }

        try {
            $artwork->delete();
            return response()->json(['success' => true, 'message' => 'Obra eliminada con éxito'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | GESTIÓN DEL ESPACIO PUBLICITARIO
    |--------------------------------------------------------------------------
    */

    /**
     * Crea o actualiza de manera directa el anuncio paródico responsivo.
     */
    public function updateParodyAd(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ad_image_desktop' => 'required|string',
            'ad_image_mobile'  => 'required|string',
            'title'            => 'nullable|string|max:255',
            'ad_link_url'      => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 400);
        }

        try {
            // Buscamos si ya existe un registro de anuncio publicitario maestro
            $ad = Gallery::onlyAds()->first();

            if ($ad) {
                // Si existe, actualizamos sus enlaces e imágenes
                $ad->update([
                    'title'            => $request->title ?? $ad->title,
                    'ad_image_desktop' => $request->ad_image_desktop,
                    'ad_image_mobile'  => $request->ad_image_mobile,
                    'ad_link_url'      => $request->ad_link_url
                ]);
                $message = "Espacio publicitario actualizado correctamente.";
            } else {
                // Si por alguna razón corriste la app sin el Seeder, lo creamos de cero
                $ad = Gallery::create([
                    'title'            => $request->title ?? 'ANUNCIO PATROCINADO',
                    'is_parody_ad'     => true,
                    'ad_image_desktop' => $request->ad_image_desktop,
                    'ad_image_mobile'  => $request->ad_image_mobile,
                    'ad_link_url'      => $request->ad_link_url
                ]);
                $message = "Espacio publicitario maestro inicializado con éxito.";
            }

            return response()->json(['success' => true, 'message' => $message, 'data' => $ad], 200);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}