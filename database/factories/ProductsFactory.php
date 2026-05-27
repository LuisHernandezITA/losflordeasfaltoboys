<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Category;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Products>
 */
class ProductsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'description' => fake()->paragraph(3),
            'category_id' => Category::all()->isNotEmpty() ? Category::all()->random()->id : 1, 
            'price' => fake()->randomFloat(2, 10, 150),
            'available_stock' => fake()->numberBetween(5, 50),
            
            // Simuladores de URL de imágenes de stock
            'image_primary' => 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
            'image_detail_1' => 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500',
            'image_detail_2' => 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500',
            
            'seller_url' => 'https://www.instagram.com/snuff.mexa.conc', // URL base dummy
            'designer' => fake()->randomElement(['SNUFF MEXA', 'OUTSIDER LAB', 'M.I.A DESIGN']),
            'shipping_type' => fake()->randomElement([0, 1, 2]), // Local, Nacional o Internacional
            
            'addition_date' => fake()->dateTimeBetween('-1 years', 'now'),
            'available' => fake()->boolean(90),
        ];
    }
}