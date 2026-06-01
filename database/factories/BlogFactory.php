<?php

namespace Database\Factories;

use App\Models\Blog;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class BlogFactory extends Factory
{
    protected $model = Blog::class;

    public function definition(): array
    {
        $title = $this->faker->sentence(6);
        $hasExtraImage = $this->faker->boolean(70); // 70% de probabilidad de tener imagen extra
        $hasVideo = $this->faker->boolean(50);      // 50% de probabilidad de tener video de YT

        // Párrafo principal robusto (Simula 3 bloques de texto largos)
        $p1 = $this->faker->paragraphs(3, false);
        $content_main = implode("\n\n", $p1);

        // Párrafo secundario robusto (Simula 2 bloques de texto largos)
        $content_sec = $hasExtraImage ? implode("\n\n", $this->faker->paragraphs(2, false)) : null;

        return [
            'banner' => 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=800',
            'title' => $title,
            'slug' => Str::slug($title),
            'author' => 'Snuff Mexa Team',
            'published_at' => $this->faker->date(),
            'category' => $this->faker->randomElement(['Música', 'Eventos', 'Lanzamientos', 'Local']),
            'content' => $content_main, 
            'content_secondary' => $content_sec,
            'extra_image' => $hasExtraImage ? 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600' : null,
            'image_position' => $this->faker->randomElement(['left', 'right']),
            'youtube_url' => $hasVideo ? 'https://www.youtube.com/watch?v=TgLI31Rt944' : null, 
            'external_url' => $this->faker->randomElement([
                'https://open.spotify.com', 
                'https://instagram.com', 
                null
            ]),
        ];
    }
}