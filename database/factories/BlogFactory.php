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
        
        return [
            'banner' => 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=800',
            'title' => $title,
            'slug' => Str::slug($title),
            'author' => 'Snuff Mexa Team',
            'published_at' => $this->faker->date(),
            'category' => $this->faker->randomElement(['Música', 'Eventos', 'Lanzamientos', 'Local']),
            'content' => $this->faker->paragraphs(4, true),
            'external_url' => $this->faker->randomElement([
                'https://open.spotify.com', 
                'https://instagram.com', 
                null
            ]),
        ];
    }
}