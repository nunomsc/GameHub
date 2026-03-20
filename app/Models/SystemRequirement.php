<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SystemRequirement extends Model
{
    use HasFactory;

    protected $fillable = [
        'game_id',
        'platform_id',
        'type',
        'os_version',
        'cpu',
        'ram_gb',
        'gpu',
        'storage_gb',
        'directx',
        'notes',
    ];

    protected $casts = [
        'ram_gb'     => 'integer',
        'storage_gb' => 'integer',
    ];

    // Pertence a um jogo
    public function game()
    {
        return $this->belongsTo(Game::class);
    }

    // Pertence a uma plataforma
    public function platform()
    {
        return $this->belongsTo(Platform::class);
    }

    // Verifica se são requisitos mínimos
    public function isMinimum(): bool
    {
        return $this->type === 'minimum';
    }

    // Verifica se são requisitos recomendados
    public function isRecommended(): bool
    {
        return $this->type === 'recommended';
    }
}