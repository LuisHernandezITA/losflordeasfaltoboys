<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Blog extends Model
{
    use HasFactory;

    protected $fillable = [
        'banner',
        'title',
        'slug',
        'author',
        'published_at',
        'category',
        'content',
        'external_url',
    ];

    protected $casts = [
        'published_at' => 'date',
    ];

    // Boot method para generar el slug automáticamente al crear un blog si no se envía de forma explícita
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($blog) {
            if (empty($blog->slug)) {
                $blog->slug = Str::slug($blog->title);
            }
        });
    }
}