<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->string('banner');
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('author');
            $table->date('published_at');
            $table->string('category')->nullable();
            $table->longText('content'); // Actuará como Párrafo 1
            $table->longText('content_secondary')->nullable(); // Párrafo 2 Opcional
            $table->string('extra_image')->nullable(); // Imagen Extra Opcional
            $table->enum('image_position', ['left', 'right'])->default('left'); // Orientación
            $table->string('youtube_url')->nullable(); // Enlace de video Opcional
            $table->string('external_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};