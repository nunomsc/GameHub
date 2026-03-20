<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Genre;
use App\Models\Platform;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LookupAdminController extends Controller
{
    public function storeGenre(Request $request)
    {
        $data = $request->validate(['name' => 'required|string|unique:genres,name']);
        $genre = Genre::create(['name' => $data['name'], 'slug' => Str::slug($data['name'])]);
        return response()->json($genre, 201);
    }

    public function destroyGenre(int $id)
    {
        Genre::findOrFail($id)->delete();
        return response()->json(null, 204);
    }

    public function storePlatform(Request $request)
    {
        $data = $request->validate(['name' => 'required|string|unique:platforms,name']);
        $platform = Platform::create(['name' => $data['name'], 'slug' => Str::slug($data['name'])]);
        return response()->json($platform, 201);
    }

    public function destroyPlatform(int $id)
    {
        Platform::findOrFail($id)->delete();
        return response()->json(null, 204);
    }

    public function storeTag(Request $request)
    {
        $data = $request->validate(['name' => 'required|string|unique:tags,name']);
        $tag = Tag::create(['name' => $data['name'], 'slug' => Str::slug($data['name'])]);
        return response()->json($tag, 201);
    }

    public function destroyTag(int $id)
    {
        Tag::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}