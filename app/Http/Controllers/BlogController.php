<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    public function index()
    {
        try {
            $blogs = Blog::orderBy('published_at', 'desc')->get();
            return response()->json($blogs, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al listar blogs: ' . $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'banner' => 'required|url',
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|unique:blogs,slug',
            'author' => 'required|string|max:255',
            'published_at' => 'required|date',
            'category' => 'nullable|string|max:255',
            'content' => 'required|string', // Párrafo principal
            'content_secondary' => 'nullable|string', // Párrafo secundario opcional
            'extra_image' => 'nullable|url',
            'image_position' => 'nullable|in:left,right',
            'youtube_url' => 'nullable|url',
            'external_url' => 'nullable|url',
        ]);

        try {
            if (empty($validated['slug'])) {
                $validated['slug'] = Str::slug($validated['title']);
            }

            // Asignar valor por defecto si no se especifica posición
            if (empty($validated['image_position'])) {
                $validated['image_position'] = 'left';
            }

            $blog = Blog::create($validated);
            return response()->json($blog, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al guardar la nota: ' . $e->getMessage()], 500);
        }
    }

    public function show(Request $request)
    {
        try {
            $blog = null;
            if ($request->has('id')) {
                $blog = Blog::find($request->id);
            } elseif ($request->has('slug')) {
                $blog = Blog::where('slug', $request->slug)->first();
            }

            if ($blog) {
                return response()->json($blog, 200);
            } else {
                return response()->json(['message' => 'Post no encontrado'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al cargar la nota: ' . $e->getMessage()], 500);
        }
    }

    public function edit(Request $request)
    {
        try {
            $blog = Blog::find($request->id);
            if ($blog) {
                return response()->json($blog, 200);
            } else {
                return response()->json(['message' => 'Post no encontrado'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al consultar la nota: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $blog = Blog::find($id);

        if (!$blog) {
            return response()->json(['message' => 'Post no encontrado'], 404);
        }

        $validated = $request->validate([
            'banner' => 'sometimes|required|url',
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'nullable|string|unique:blogs,slug,' . $id,
            'author' => 'sometimes|required|string|max:255',
            'published_at' => 'sometimes|required|date',
            'category' => 'nullable|string|max:255',
            'content' => 'sometimes|required|string',
            'content_secondary' => 'nullable|string',
            'extra_image' => 'nullable|url',
            'image_position' => 'nullable|in:left,right',
            'youtube_url' => 'nullable|url',
            'external_url' => 'nullable|url',
        ]);

        try {
            if (isset($validated['title']) && empty($validated['slug'])) {
                $validated['slug'] = Str::slug($validated['title']);
            }

            $blog->update($validated);
            return response()->json($blog, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al actualizar la nota: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $blog = Blog::find($id);
            if (!$blog) {
                return response()->json(['message' => 'Post no encontrado'], 404);
            }
            $blog->delete();
            return response()->json(['message' => 'Post eliminado correctamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al eliminar la nota: ' . $e->getMessage()], 500);
        }
    }
}