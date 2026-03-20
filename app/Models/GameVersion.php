<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class GameVersion extends Model
{
    use HasFactory;

    protected $fillable = [
        'game_id',
        'version',
        'file_path',
        'file_size',
        'checksum',
        'download_url',
        'release_notes',
        'is_latest',
        'released_at',
    ];

    protected $casts = [
        'is_latest'   => 'boolean',
        'file_size'   => 'integer',
        'released_at' => 'datetime',
    ];

    // Uma versão pertence a um jogo
    public function game()
    {
        return $this->belongsTo(Game::class);
    }

    // Uma versão tem muitas instalações
    public function installs()
    {
        return $this->hasMany(Install::class, 'version_id');
    }

    // Formata o tamanho do ficheiro para leitura humana
    public function getFileSizeFormattedAttribute(): string
    {
        if (!$this->file_size) return 'Desconhecido';

        $units = ['B', 'KB', 'MB', 'GB'];
        $size  = $this->file_size;
        $unit  = 0;

        while ($size >= 1024 && $unit < count($units) - 1) {
            $size /= 1024;
            $unit++;
        }

        return round($size, 1) . ' ' . $units[$unit];
    }
}