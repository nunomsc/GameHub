<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Install extends Model
{
    use HasFactory;

    protected $fillable = [
        'game_id',
        'version_id',
        'machine_id',
        'machine_name',
        'status',
        'install_path',
        'installed_at',
    ];

    protected $casts = [
        'installed_at' => 'datetime',
    ];

    // Uma instalação pertence a um jogo
    public function game()
    {
        return $this->belongsTo(Game::class);
    }

    // Uma instalação pertence a uma versão
    public function version()
    {
        return $this->belongsTo(GameVersion::class, 'version_id');
    }

    // Verifica se está instalado
    public function isInstalled(): bool
    {
        return $this->status === 'installed';
    }

    // Verifica se está a descarregar
    public function isDownloading(): bool
    {
        return $this->status === 'downloading';
    }

    // Verifica se falhou
    public function hasFailed(): bool
    {
        return $this->status === 'failed';
    }
}