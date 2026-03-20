<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Game;
use App\Models\GameVersion;
use App\Models\Genre;
use App\Models\Platform;
use App\Models\Tag;

class GameSeeder extends Seeder
{
    public function run(): void
    {
        // Géneros
        $action   = Genre::create(['name' => 'Action',   'slug' => 'action']);
        $rpg      = Genre::create(['name' => 'RPG',      'slug' => 'rpg']);
        $strategy = Genre::create(['name' => 'Strategy', 'slug' => 'strategy']);
        $puzzle   = Genre::create(['name' => 'Puzzle',   'slug' => 'puzzle']);
        $racing   = Genre::create(['name' => 'Racing',   'slug' => 'racing']);

        // Plataformas
        $windows = Platform::create(['name' => 'Windows', 'slug' => 'windows']);
        $linux   = Platform::create(['name' => 'Linux',   'slug' => 'linux']);
        $macos   = Platform::create(['name' => 'macOS',   'slug' => 'macos']);

        // Tags
        $multiplayer = Tag::create(['name' => 'Multiplayer', 'slug' => 'multiplayer']);
        $coop        = Tag::create(['name' => 'Co-op',       'slug' => 'co-op']);
        $openworld   = Tag::create(['name' => 'Open World',  'slug' => 'open-world']);
        $singleplayer = Tag::create(['name' => 'Single Player', 'slug' => 'single-player']);

        // -------------------------------------------------------
        // Jogo 1 — Starfall Arena
        // -------------------------------------------------------
        $starfall = Game::create([
            'title'       => 'Starfall Arena',
            'slug'        => 'starfall-arena',
            'description' => 'Fast-paced space battle arena with 64-player support.',
            'source'      => 'network',
            'publisher'   => 'Nova Games',
            'rating'      => 4.8,
            'is_active'   => true,
        ]);

        GameVersion::create([
            'game_id'      => $starfall->id,
            'version'      => '2.1.0',
            'file_path'    => 'games/starfall-arena-2.1.0.zip',
            'file_size'    => 4509715456, // ~4.2 GB
            'is_latest'    => true,
            'released_at'  => now(),
        ]);

        $starfall->genres()->attach([$action->id]);
        $starfall->platforms()->attach([$windows->id, $linux->id]);
        $starfall->tags()->attach([$multiplayer->id]);

        // -------------------------------------------------------
        // Jogo 2 — Kingdom's Fall
        // -------------------------------------------------------
        $kingdoms = Game::create([
            'title'       => "Kingdom's Fall",
            'slug'        => 'kingdoms-fall',
            'description' => 'Epic medieval strategy with real-time siege mechanics.',
            'source'      => 'network',
            'publisher'   => 'Iron Tower',
            'rating'      => 4.6,
            'is_active'   => true,
        ]);

        GameVersion::create([
            'game_id'     => $kingdoms->id,
            'version'     => '1.5.3',
            'file_path'   => 'games/kingdoms-fall-1.5.3.zip',
            'file_size'   => 8378220544, // ~7.8 GB
            'is_latest'   => true,
            'released_at' => now(),
        ]);

        $kingdoms->genres()->attach([$strategy->id]);
        $kingdoms->platforms()->attach([$windows->id]);
        $kingdoms->tags()->attach([$singleplayer->id, $coop->id]);

        // -------------------------------------------------------
        // Jogo 3 — Dragon Ascent
        // -------------------------------------------------------
        $dragon = Game::create([
            'title'       => 'Dragon Ascent',
            'slug'        => 'dragon-ascent',
            'description' => 'Massive open-world RPG with full mod support.',
            'source'      => 'web',
            'publisher'   => 'Ember Studios',
            'rating'      => 4.9,
            'is_active'   => true,
        ]);

        GameVersion::create([
            'game_id'     => $dragon->id,
            'version'     => '4.2.0',
            'file_path'   => 'games/dragon-ascent-4.2.0.zip',
            'file_size'   => 19865124864, // ~18.5 GB
            'is_latest'   => true,
            'released_at' => now(),
        ]);

        $dragon->genres()->attach([$rpg->id, $action->id]);
        $dragon->platforms()->attach([$windows->id, $macos->id, $linux->id]);
        $dragon->tags()->attach([$openworld->id, $singleplayer->id, $coop->id]);

        // -------------------------------------------------------
        // Jogo 4 — Cipher Quest
        // -------------------------------------------------------
        $cipher = Game::create([
            'title'       => 'Cipher Quest',
            'slug'        => 'cipher-quest',
            'description' => 'Cryptographic puzzle adventure with mind-bending levels.',
            'source'      => 'web',
            'publisher'   => null,
            'rating'      => 4.7,
            'is_active'   => true,
        ]);

        GameVersion::create([
            'game_id'     => $cipher->id,
            'version'     => '1.0.0',
            'file_path'   => 'games/cipher-quest-1.0.0.zip',
            'file_size'   => 1395864371, // ~1.3 GB
            'is_latest'   => true,
            'released_at' => now(),
        ]);

        $cipher->genres()->attach([$puzzle->id]);
        $cipher->platforms()->attach([$windows->id, $macos->id]);
        $cipher->tags()->attach([$singleplayer->id]);

        // -------------------------------------------------------
        // Jogo 5 — Neon Drift
        // -------------------------------------------------------
        $neon = Game::create([
            'title'       => 'Neon Drift',
            'slug'        => 'neon-drift',
            'description' => 'Cyberpunk racing with destructible environments.',
            'source'      => 'network',
            'publisher'   => 'Pulse Interactive',
            'rating'      => 4.4,
            'is_active'   => true,
        ]);

        GameVersion::create([
            'game_id'     => $neon->id,
            'version'     => '3.0.1',
            'file_path'   => 'games/neon-drift-3.0.1.zip',
            'file_size'   => 2254857830, // ~2.1 GB
            'is_latest'   => true,
            'released_at' => now(),
        ]);

        $neon->genres()->attach([$racing->id, $action->id]);
        $neon->platforms()->attach([$windows->id]);
        $neon->tags()->attach([$multiplayer->id]);
    }
}