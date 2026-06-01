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
            'title' => 'SISTEMA COMPROMETIDO: CLICK AQUÍ',
            'ad_image_desktop' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200',
            'ad_image_mobile' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500'
        ]);
    }
}