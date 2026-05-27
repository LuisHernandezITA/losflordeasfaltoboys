<?php

namespace Database\Factories;

use App\Models\EventImage;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventImageFactory extends Factory
{
    protected $model = EventImage::class;

    public function definition(): array
    {
        $lookbookImages = [
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600',
            'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600',
            'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600',
            'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600',
            'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600'
        ];

        return [
            'image_path' => $this->faker->randomElement($lookbookImages),
        ];
    }
}