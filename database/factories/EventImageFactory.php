<?php

namespace Database\Factories;

use App\Models\EventImage;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventImageFactory extends Factory
{
    protected $model = EventImage::class;

    public function definition(): array
{
    return [
        'image_path' => $this->faker->imageUrl(),
        'target_url' => '/', 
    ];
}
}