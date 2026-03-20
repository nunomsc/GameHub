<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class GameScreenshot extends Model
{
    use HasFactory;

    protected $fillable = [
        'game_id',
        'file_path',
        'caption',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    // Uma screenshot pertence a um jogo
    public function game()
    {
        return $this->belongsTo(Game::class);
    }
}