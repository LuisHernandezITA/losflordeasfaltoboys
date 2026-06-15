<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventImage;
use Illuminate\Http\Request;

class EventController extends Controller
{
    /**
     * Listar todos los eventos con sus imágenes (para el inicio/index).
     */
    public function index()
    {
        try {
            $events = Event::with('images')->orderBy('date', 'desc')->get();
            return response()->json($events, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al listar eventos: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Mostrar un evento específico con su galería en React (Vía POST con $request->id).
     */
    public function show(Request $request)
    {
        try {
            // Buscamos el id que viene en el cuerpo de la petición desde React
            $event = Event::with('images')->find($request->id);

            if ($event) {
                return response()->json($event, 200);
            } else {
                return response()->json(['message' => 'Event not found'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener el evento: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Cargar datos del evento para el formulario de edición del Admin.
     */
    public function edit(Request $request)
    {
        try {
            $event = Event::with('images')->find($request->id);

            if ($event) {
                return response()->json($event, 200);
            } else {
                return response()->json(['message' => 'Event not found'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al editar el evento: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Crear un nuevo evento junto con su Banner y su galería (URLs directas/Strings).
     */
    public function store(Request $request)
    {
        $request->validate([
            'title'          => 'required|string|max:255',
            'date'           => 'required|date',
            'description'    => 'nullable|string',
            'location'       => 'required|string|max:255',
            'banner_path'    => 'required|string', 
            'gallery_images' => 'nullable|array',  
        ]);

        try {
            $event = new Event();
            $event->title       = $request->input('title');
            $event->date        = $request->input('date');
            $event->description = $request->input('description');
            $event->location    = $request->input('location');
            $event->banner_path = $request->input('banner_path'); 
            $event->save();

            if ($request->has('gallery_images')) {
                foreach ($request->input('gallery_images') as $img) {
                    // Si el dato viene como array, extraemos los campos, si no, usamos default
                    $path = is_array($img) ? ($img['image_path'] ?? '') : $img;
                    $url  = is_array($img) ? ($img['target_url'] ?? '/') : '/';

                    if (!empty($path)) {
                        $event->images()->create([
                            'image_path' => $path,
                            'target_url' => $url
                        ]);
                    }
                }
            }

            return response()->json([
                'message' => '¡Evento y galería creados con éxito!',
                'event' => $event->load('images')
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al guardar el evento: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'title'          => 'required|string|max:255',
            'date'           => 'required|date',
            'description'    => 'nullable|string',
            'location'       => 'required|string|max:255',
            'banner_path'    => 'required|string',
            'gallery_images' => 'nullable|array',
        ]);

        try {
            $event = Event::find($id);

            if (!$event) {
                return response()->json(['message' => 'Evento no encontrado'], 404);
            }

            $event->title       = $request->input('title');
            $event->date        = $request->input('date');
            $event->description = $request->input('description');
            $event->location    = $request->input('location');
            $event->banner_path = $request->input('banner_path');
            $event->save();

            if ($request->has('gallery_images')) {
                $event->images()->delete();

                foreach ($request->input('gallery_images') as $img) {
                    $path = is_array($img) ? ($img['image_path'] ?? '') : $img;
                    $url  = is_array($img) ? ($img['target_url'] ?? '/') : '/';

                    if (!empty($path)) {
                        $event->images()->create([
                            'image_path' => $path,
                            'target_url' => $url
                        ]);
                    }
                }
            }

            return response()->json([
                'message' => '¡Evento actualizado con éxito!',
                'event' => $event->load('images')
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al actualizar el evento: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $event = Event::findOrFail($id);
            $event->images()->delete();
            $event->delete();

            return response()->json(['message' => 'Evento eliminado correctamente.'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al eliminar el evento: ' . $e->getMessage()], 500);
        }
    }
}