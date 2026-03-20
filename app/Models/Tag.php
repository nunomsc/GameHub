<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
    ];

    // Uma tag pertence a muitos jogos
    public function games()
    {
        return $this->belongsToMany(Game::class);
    }
}