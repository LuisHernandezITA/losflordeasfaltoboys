<?php

namespace Database\Factories;

use App\Models\Gallery;
use Illuminate\Database\Eloquent\Factories\Factory;

class GalleryFactory extends Factory
{
    protected $model = Gallery::class;

    // CORREGIDO: Cambiado : void por : array
    public function definition(): array
{
    // Un listado de imágenes estables con estéticas oscuras, abstractas o textiles
    $artImages = [
        'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600', // Abstracto fluido
        'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600', // Textura geométrica oscura
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600', // Arte digital
        'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600', // Ilustración abstracta
        'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=600', // Textura textil/ropa
    ];

    return [
        'title' => strtoupper($this->faker->words(3, true)),
        'autor' => '@' . $this->faker->userName,
        'technique' => $this->faker->randomElement([
            'Textile paint airbrushing on raw denim',
            'Japanese boro mending / Patchwork',
            'Digital Graphic Art / Brutalist design',
            'AI-assisted video morphing archive'
        ]),
        'year' => $this->faker->numberBetween(2024, 2026),
        // CORRECCIÓN AQUÍ: Cambiamos el Faker inestable por el array aleatorio
        'image_url' => $this->faker->randomElement($artImages),
        'is_parody_ad' => false,
        'ad_image_desktop' => null,
        'ad_image_mobile' => null,
        'ad_link_url' => null,
    ];
}

    /**
     * Estado específico para generar el Banner Publicitario.
     */
    public function parodyAd(): static
    {
        return $this->state(fn (array $attributes) => [
            'title' => '¡URGENTE: SOLTERAS EN TU ZONA!',
            'autor' => null,
            'technique' => null,
            'year' => null,
            'image_url' => null,
            'is_parody_ad' => true,
            'ad_image_desktop' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200', 
            'ad_image_mobile' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=500',
            'ad_link_url' => 'https://losflordeasfalto.com/drop-exclusivo',
        ]);
    }
}