<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Genre;
use App\Models\Platform;
use App\Models\Tag;

class LookupController extends Controller
{
    public function genres()
    {
        return response()->json(Genre::orderBy('name')->get());
    }

    public function platforms()
    {
        return response()->json(Platform::orderBy('name')->get());
    }

    public function tags()
    {
        return response()->json(Tag::orderBy('name')->get());
    }
}