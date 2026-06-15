<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'image_path',
        'target_url' // <--- Nuevo campo
    ];

    /**
     * Obtener el evento al que pertenece la imagen.
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}