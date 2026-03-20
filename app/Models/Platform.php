<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Platform extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'icon',
    ];

    // Uma plataforma pertence a muitos jogos
    public function games()
    {
        return $this->belongsToMany(Game::class);
    }

    // Uma plataforma tem muitos requisitos de sistema
    public function systemRequirements()
    {
        return $this->hasMany(SystemRequirement::class);
    }
}