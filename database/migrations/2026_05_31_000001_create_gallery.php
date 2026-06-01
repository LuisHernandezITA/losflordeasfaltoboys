<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gallery', function (Blueprint $table) {
            $table->id();
            // Campos compartidos y de obras de arte
            $table->string('title')->nullable();
            $table->string('autor')->nullable();
            $table->string('technique')->nullable();
            $table->integer('year')->nullable();
            $table->text('image_url')->nullable(); 

            // Campos específicos para el banner publicitario
            $table->boolean('is_parody_ad')->default(false); // Flag para separar la lógica
            $table->text('ad_image_desktop')->nullable();
            $table->text('ad_image_mobile')->nullable();
            $table->string('ad_link_url')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery');
    }
};