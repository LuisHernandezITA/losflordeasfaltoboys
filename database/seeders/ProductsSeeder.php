<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Products;

class ProductsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. King D T-Shirt
        Products::create([
            'name' => "KING D T-Shirt",
            'description' => "King DDD T-Shirt Fall Collection",
            'category_id' => 1,
            'price' => 25.00,
            'available_stock' => 90,
            'image_primary' => "https://i.postimg.cc/ydR5dxHH/snu9.jpg",
            'image_detail_1' => "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500",
            'image_detail_2' => "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
            'seller_url' => "https://www.instagram.com/snuff.mexa.conc",
            'designer' => "SNUFF MEXA",
            'shipping_type' => 0, // Envío Local
            'addition_date' => '2023-10-10',
            'available' => true
        ]);

        // 2. Shagg Pants MX
        Products::create([
            'name' => "Shagg Pants MX",
            'description' => "Comfortable pants Shagg Collection",
            'category_id' => 3,
            'price' => 55.00,
            'available_stock' => 60,
            'image_primary' => "https://i.postimg.cc/v8Wkw4h7/snu7.jpg",
            'image_detail_1' => "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
            'image_detail_2' => "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=500",
            'seller_url' => "https://www.instagram.com/snuff.mexa.conc",
            'designer' => "SNUFF MEXA",
            'shipping_type' => 1, // Nacional
            'addition_date' => '2023-10-11',
            'available' => true
        ]);

        // 3. NY Snuff Cap
        Products::create([
            'name' => "NY Snuff Cap",
            'description' => "Niu York Cap Mexican Outlet",
            'category_id' => 2,
            'price' => 60.00,
            'available_stock' => 40,
            'image_primary' => "https://i.postimg.cc/6pQmZYXz/snu8.jpg",
            'image_detail_1' => "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500",
            'image_detail_2' => "https://images.unsplash.com/photo-1534215754734-18e55d13ce3a?w=500",
            'seller_url' => "https://www.instagram.com/snuff.mexa.conc",
            'designer' => "OUTSIDER LAB",
            'shipping_type' => 0, // Local
            'addition_date' => '2023-10-12',
            'available' => true
        ]);

        // 4. Cargo FARGO Snuff Pants
        Products::create([
            'name' => "Cargo FARGO Snuff Pants",
            'description' => "Fargo Collection",
            'category_id' => 3,
            'price' => 80.00,
            'available_stock' => 75,
            'image_primary' => "https://i.postimg.cc/yxXbmGxp/snu6.jpg",
            'image_detail_1' => "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
            'image_detail_2' => "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=500",
            'seller_url' => "https://www.instagram.com/snuff.mexa.conc",
            'designer' => "SNUFF MEXA",
            'shipping_type' => 2, // Internacional
            'addition_date' => '2023-10-13',
            'available' => true
        ]);

        // 5. BLS T-Shirt
        Products::create([
            'name' => "BLS T-Shirt",
            'description' => "Balas Collection",
            'category_id' => 1,
            'price' => 120.00,
            'available_stock' => 30,
            'image_primary' => "https://i.postimg.cc/SNk5Sm1B/snu5.jpg",
            'image_detail_1' => "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500",
            'image_detail_2' => "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
            'seller_url' => "https://www.instagram.com/snuff.mexa.conc",
            'designer' => "OUTSIDER LAB",
            'shipping_type' => 1, // Nacional
            'addition_date' => '2023-10-14',
            'available' => true
        ]);

        // 6. Polo Snuff Shirt
        Products::create([
            'name' => "Polo Snuff Shirt",
            'description' => "Casual Snuff Polo Intervention",
            'category_id' => 1,
            'price' => 45.00,
            'available_stock' => 50,
            'image_primary' => "https://i.postimg.cc/DwYYPLfh/snu3.jpg",
            'image_detail_1' => "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500",
            'image_detail_2' => "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
            'seller_url' => "https://www.instagram.com/snuff.mexa.conc",
            'designer' => "SNUFF MEXA",
            'shipping_type' => 0, // Local
            'addition_date' => '2023-10-15',
            'available' => true
        ]);

    }
}