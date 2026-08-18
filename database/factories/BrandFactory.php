<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class BrandFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->company();
        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'banner_url' => fake()->imageUrl(1280, 400, 'fashion'),
            'alt_text' => fake()->sentence(3),
        ];
    }
}