<?php

namespace Database\Seeders;

use App\Models\Gallery;
use Illuminate\Database\Seeder;

class GallerySeeder extends Seeder
{
    public function run(): void
    {
        // 1. Limpiar datos previos si los hay
        Gallery::truncate();

        // 2. Crear 10 obras de arte aleatorias usando la factory
        Gallery::factory()->count(10)->create();

        // 3. Crear el registro maestro de la publicidad paródica inicial
        Gallery::factory()->parodyAd()->create([
            'title' => 'SABER MÁS: CLICK AQUI',
            'ad_image_desktop' => 'https://i.postimg.cc/50vj0vNR/PDESK1.png',
            'ad_image_mobile' => 'https://i.postimg.cc/503dnNPN/PWEB1.png'
        ]);
    }
}