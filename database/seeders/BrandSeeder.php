<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Brand;
use Illuminate\Support\Str;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            [
                'name' => 'Saintimental',
                'banner_url' => 'https://i.postimg.cc/k5RgR8vk/Towena-Route.jpg', // Cambia por el banner real de prueba
                'alt_text' => 'Saintimental Banner',
            ],
            // Puedes agregar más marcas predeterminadas si lo deseas
        ];

        foreach ($brands as $brand) {
            Brand::create([
                'name' => $brand['name'],
                'slug' => Str::slug($brand['name']),
                'banner_url' => $brand['banner_url'],
                'alt_text' => $brand['alt_text'],
            ]);
        }
    }
}