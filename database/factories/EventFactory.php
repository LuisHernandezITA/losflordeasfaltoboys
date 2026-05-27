<?php

namespace Database\Factories;

use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->randomElement(['ORPHANS DELUXE', 'HOLY SIBAL', 'TRASH ISLAND', 'UNDEAD']),
            'date' => $this->faker->date(),
            'description' => 'FALL WINTER COLLECTION LOOKBOOK - ' . $this->faker->paragraph(2),
            'location' => $this->faker->randomElement(['Seoul, SK', 'Tokyo, JP', 'Mexico City, MX', 'Rome, IT']),
            // Imagen vertical/horizontal alternativa de Unsplash orientada a moda urbana/fotografía cruda
            'banner_path' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800', 
        ];
    }
}