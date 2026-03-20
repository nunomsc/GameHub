<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'source',
        'publisher',
        'thumbnail',
        'rating',
        'is_active',
    ];

    protected $casts = [
        'rating'    => 'float',
        'is_active' => 'boolean',
    ];

    // Um jogo tem muitas versões
    public function versions()
    {
        return $this->hasMany(GameVersion::class);
    }

    // Versão mais recente
    public function latestVersion()
    {
        return $this->hasOne(GameVersion::class)
                    ->where('is_latest', true);
    }

    // Um jogo tem muitas instalações
    public function installs()
    {
        return $this->hasMany(Install::class);
    }

    // Um jogo pertence a muitos géneros
    public function genres()
    {
        return $this->belongsToMany(Genre::class);
    }

    // Um jogo corre em muitas plataformas
    public function platforms()
    {
        return $this->belongsToMany(Platform::class);
    }

    // Um jogo tem muitas tags
    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }

    // Um jogo tem muitas screenshots
    public function screenshots()
    {
        return $this->hasMany(GameScreenshot::class)
                    ->orderBy('sort_order');
    }

    // Um jogo tem requisitos de sistema
    public function systemRequirements()
    {
        return $this->hasMany(SystemRequirement::class);
    }
}