<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'event_type',
        'category',
        'date',
        'start_time',
        'end_time',
        'location',
        'price',
        'capacity',
        'organizer',
        'tags',
        'agenda',
        'featured',
        'images',
        'user_id'
    ];

    protected $casts = [
        'date' => 'date',
        'price' => 'decimal:2',
        'featured' => 'boolean',
        'tags' => 'array',
        'images' => 'array',
    ];

    protected $appends = ['image_urls'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Accessor for full event datetime
    public function getEventDateTimeAttribute()
    {
        return $this->date->format('Y-m-d') . ' ' . $this->start_time;
    }

    public function getImageUrlsAttribute()
    {
        if (!$this->images || !is_array($this->images)) {
            return [];
        }

        return array_map(function ($img) {
            return asset('storage/' . $img);
        }, $this->images);
    }



    // Scope for featured events
    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    // Scope for upcoming events
    public function scopeUpcoming($query)
    {
        return $query->where('date', '>=', now()->toDateString());
    }
}
