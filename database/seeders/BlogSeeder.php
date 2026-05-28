<?php

namespace Database\Seeders;

use App\Models\Blog;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    public function run(): void
    {
        // Genera 10 notas de prueba para que veas el diseño en tu front antes de meter datos reales
        Blog::factory()->count(10)->create();
    }
}