<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Banner;

class BannerSeeder extends Seeder
{
    public function run(): void
    {
        Banner::create([
            'image_url' => 'https://i.postimg.cc/pXvzztxZ/b1.png',
            'alt_text' => 'VER MÄS?',
            'link_url' => '/promo1',
            'interval' => 2000
        ]);

        Banner::create([
            'image_url' => 'https://i.postimg.cc/9fwrsxC9/b2.png',
            'alt_text' => '+ooOOOOo0',
            'link_url' => '/promo2',
            'interval' => 1000
        ]);

        Banner::create([
            'image_url' => 'https://i.postimg.cc/fL4JsxRt/b3.png',
            'alt_text' => 'VER MÄS',
            'link_url' => '/promo3',
            'interval' => 2000
        ]);

        Banner::create([
            'image_url' => 'https://i.postimg.cc/q76zWm48/b4.png',
            'alt_text' => 'INSTA!!',
            'link_url' => '/promo4',
            'interval' => 2000
        ]);
    }
}