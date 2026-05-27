<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'date',
        'description',
        'location',
        'banner_path'
    ];

    /**
     * Obtener todas las imágenes dinámicas del evento.
     */
    public function images(): HasMany
    {
        return $this->hasMany(EventImage::class);
    }
}