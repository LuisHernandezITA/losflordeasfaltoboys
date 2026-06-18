<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Products;

class ProductsSeeder extends Seeder
{
    public function run(): void
    {
        // Tus URLs originales para mantener la estética
        $images = [
            "https://i.postimg.cc/ZYWX9S33/ejemplo.png",
            "https://i.postimg.cc/v8Wkw4h7/snu7.jpg",
            "https://i.postimg.cc/6pQmZYXz/snu8.jpg",
            "https://i.postimg.cc/yxXbmGxp/snu6.jpg",
            "https://i.postimg.cc/c1P2wbB1/ejemplo5.png",
            "https://i.postimg.cc/2jgMhK7k/ejemplo2.png"
        ];

        $brands = [
            "SNUFF MEXA", "OUTSIDER LAB", "URBAN VIBE", "NEO TOKYO", "STREET SOUL",
            "CORE DRIFT", "VOID APPAREL", "ZENITH WEAR", "APEX CUTS", "VELVET RAGE",
            "SHADOW THREADS", "GHOST MODE", "PRISM CLOTHING", "RADICAL FORM", "KINETIC STYLE",
            "SOLAR PUNK", "LUNAR WEAR", "MOSS & STONE", "CRAFTED CHAOS", "SILENT ECHO",
            "NOMAD GEAR", "TITAN TEXTILES", "FRACTAL FASHION", "EMBER STUDIO", "IRON PULSE",
            "AURA DESIGN", "VORTEX VESTURE", "SIGNAL CLOTH", "DUSK DIVISION", "OASIS LAB",
            "CARBON COPY", "RITUAL WEAR", "HYPER LOOP", "ZEN GARDEN", "BLEAK BEAUTY",
            "FLUX APPAREL", "ONYX EDITION", "STATIC FLOW", "BASE LAYER", "CORE ESSENCE"
        ];

        for ($i = 1; $i <= 40; $i++) {
            Products::create([
                'name' => "Producto " . $i,
                'description' => "Intervención exclusiva " . $i,
                'category_id' => rand(1, 3),
                'price' => rand(20, 150) + 0.99,
                'available_stock' => rand(10, 100),
                // Aquí elegimos una imagen al azar de tu lista original
                'image_primary' => $images[array_rand($images)],
                'image_detail_1' => $images[array_rand($images)],
                'image_detail_2' => $images[array_rand($images)],
                'seller_url' => "https://www.instagram.com/losflordeasfalto",
                'designer' => $brands[$i - 1], 
                'shipping_type' => rand(0, 2),
                'addition_date' => now()->subDays(rand(0, 30)),
                'available' => true
            ]);
        }
    }
}