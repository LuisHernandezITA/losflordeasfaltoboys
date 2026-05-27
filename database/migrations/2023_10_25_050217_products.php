<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->text('description');
            $table->unsignedBigInteger('category_id');
            $table->decimal('price', 10, 2);
            $table->integer('available_stock');
            
            // Las 3 imágenes obligatorias del producto
            $table->string('image_primary');
            $table->string('image_detail_1');
            $table->string('image_detail_2');

            // Nuevos campos de Autor/Marketplace
            $table->string('seller_url'); // Enlace de Instagram/Web del diseñador
            $table->string('designer');   // Marca o creador para filtros
            
            // Tipo de envío (0=Local, 1=Nacional, 2=Internacional)
            $table->tinyInteger('shipping_type')->default(0);

            $table->timestamp('addition_date');
            $table->boolean('available');
            
            $table->foreign('category_id')->references('id')->on('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};