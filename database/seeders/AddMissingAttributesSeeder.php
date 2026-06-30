<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Size;
use App\Models\Color;

class AddMissingAttributesSeeder extends Seeder
{
    public function run(): void
    {
        // Nuevas tallas
        $sizes = ['XS', 'XXL', '3XL'];
        foreach ($sizes as $name) {
            Size::updateOrCreate(['name' => $name], ['name' => $name]);
        }

        // Nuevos colores renderizables (Nombres estándar de CSS)
        $colors = [ 
            'Orange', 'Crimson', 'Purple', 
            'Teal', 'Olive',
        ];
        foreach ($colors as $name) {
            Color::updateOrCreate(['name' => $name], ['name' => $name]);
        }
    }
}