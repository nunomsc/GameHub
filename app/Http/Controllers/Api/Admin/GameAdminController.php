<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GameAdminController extends Controller
{
    // GET /api/admin/games
    public function index()
    {
        return response()->json(
            Game::with(['genres', 'platforms', 'tags', 'latestVersion'])
                ->orderBy('title')
                ->get()
        );
    }

    // GET /api/admin/games/{id}
    public function show(int $id)
    {
        return response()->json(
            Game::with(['genres', 'platforms', 'tags', 'versions', 'screenshots', 'systemRequirements'])
                ->findOrFail($id)
        );
    }

    // POST /api/admin/games
    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'source'      => 'required|in:network,web',
            'publisher'   => 'nullable|string|max:255',
            'rating'      => 'nullable|numeric|min:0|max:10',
            'is_active'   => 'boolean',
            'genres'      => 'nullable|array',
            'genres.*'    => 'exists:genres,id',
            'platforms'   => 'nullable|array',
            'platforms.*' => 'exists:platforms,id',
            'tags'        => 'nullable|array',
            'tags.*'      => 'exists:tags,id',
        ]);

        $data['slug'] = Str::slug($data['title']);

        $game = Game::create($data);

        if (!empty($data['genres']))   $game->genres()->sync($data['genres']);
        if (!empty($data['platforms'])) $game->platforms()->sync($data['platforms']);
        if (!empty($data['tags']))     $game->tags()->sync($data['tags']);

        return response()->json($game->load(['genres', 'platforms', 'tags']), 201);
    }

    // PUT /api/admin/games/{id}
    public function update(Request $request, int $id)
    {
        $game = Game::findOrFail($id);

        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'source'      => 'required|in:network,web',
            'publisher'   => 'nullable|string|max:255',
            'rating'      => 'nullable|numeric|min:0|max:10',
            'is_active'   => 'boolean',
            'genres'      => 'nullable|array',
            'genres.*'    => 'exists:genres,id',
            'platforms'   => 'nullable|array',
            'platforms.*' => 'exists:platforms,id',
            'tags'        => 'nullable|array',
            'tags.*'      => 'exists:tags,id',
        ]);

        $data['slug'] = Str::slug($data['title']);
        $game->update($data);

        $game->genres()->sync($data['genres'] ?? []);
        $game->platforms()->sync($data['platforms'] ?? []);
        $game->tags()->sync($data['tags'] ?? []);

        return response()->json($game->load(['genres', 'platforms', 'tags']));
    }

    // DELETE /api/admin/games/{id}
    public function destroy(int $id)
    {
        Game::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}