<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = new User();
        $user->name = "admin";
        $user->email = "admin@asfalto.com";
        $user->email_verified_at = now();
        $user->password = "Zz9NA7NC";
        $user->admin = true;
        $user->remember_token = "AdminProXxXx";
        $user->save();

        $user = new User();
    }
}
