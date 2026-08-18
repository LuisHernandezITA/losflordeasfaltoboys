<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('brands', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Nombre real de la marca (ej. "Saintimental")
            $table->string('slug')->unique(); // Slug para la URL (ej. "saintimental")
            $table->string('banner_url');     // URL o ruta del banner específico
            $table->string('alt_text')->nullable(); // Texto alternativo para la imagen
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('brands');
    }
};