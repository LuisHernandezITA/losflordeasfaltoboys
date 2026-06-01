<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Gallery extends Model
{
    use HasFactory;

    protected $table = 'gallery';

    protected $fillable = [
        'title',
        'autor',
        'technique',
        'year',
        'image_url',
        'is_parody_ad',
        'ad_image_desktop',
        'ad_image_mobile',
        'ad_link_url'
    ];

    protected $casts = [
        'is_parody_ad' => 'boolean',
        'year' => 'integer'
    ];

    /**
     * Scope para obtener solo las obras de arte auténticas.
     */
    public function scopeOnlyArtworks(Builder $query): Builder
    {
        return $query->where('is_parody_ad', false);
    }

    /**
     * Scope para obtener el banner publicitario activo.
     */
    public function scopeOnlyAds(Builder $query): Builder
    {
        return $query->where('is_parody_ad', true);
    }
}