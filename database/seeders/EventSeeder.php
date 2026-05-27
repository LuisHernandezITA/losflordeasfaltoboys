<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\EventImage;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        // Crea 5 eventos, y a cada uno le mete entre 4 y 8 imágenes dinámicas para la galería
        Event::factory(5)->create()->each(function ($event) {
            EventImage::factory(rand(4, 8))->create([
                'event_id' => $event->id
            ]);
        });
    }
}