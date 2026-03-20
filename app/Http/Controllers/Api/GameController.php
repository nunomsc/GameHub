<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller
{
    // GET /api/games
    public function index(Request $request)
    {
        $query = Game::with([
            'genres',
            'platforms',
            'tags',
            'latestVersion',
            'screenshots' => fn($q) => $q->orderBy('sort_order')->limit(1),
        ])->where('is_active', true);

        // Filtro por source (network / web)
        if ($request->filled('source')) {
            $query->where('source', $request->source);
        }

        // Filtro por género
        if ($request->filled('genre')) {
            $query->whereHas('genres', fn($q) =>
                $q->where('slug', $request->genre)
            );
        }

        // Filtro por plataforma
        if ($request->filled('platform')) {
            $query->whereHas('platforms', fn($q) =>
                $q->where('slug', $request->platform)
            );
        }

        // Filtro por tag
        if ($request->filled('tag')) {
            $query->whereHas('tags', fn($q) =>
                $q->where('slug', $request->tag)
            );
        }

        // Pesquisa por título
        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Ordenação
        $sort = $request->get('sort', 'title');
        $direction = $request->get('direction', 'asc');
        $allowedSorts = ['title', 'rating', 'created_at'];

        if (in_array($sort, $allowedSorts)) {
            $query->orderBy($sort, $direction);
        }

        return response()->json($query->get());
    }

    // GET /api/games/{slug}
    public function show(string $slug)
    {
        $game = Game::with([
            'genres',
            'platforms',
            'tags',
            'versions',
            'latestVersion',
            'screenshots',
            'systemRequirements.platform',
        ])->where('slug', $slug)
          ->where('is_active', true)
          ->firstOrFail();

        return response()->json($game);
    }
}