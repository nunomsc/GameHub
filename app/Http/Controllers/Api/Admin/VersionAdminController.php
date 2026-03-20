<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\GameVersion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VersionAdminController extends Controller
{
    public function store(Request $request)
    {
        $gameId = $request->input('game_id');

        if (empty($gameId)) {
            return response()->json(['message' => 'game_id esta vazio: ' . json_encode($request->all())], 422);
        }

        $request->validate([
            'game_id'       => 'required|exists:games,id',
            'version'       => 'required|string',
            'release_notes' => 'nullable|string',
            'is_latest'     => 'nullable',
            'file'          => 'nullable|file',
        ]);

        if ($request->boolean('is_latest')) {
            GameVersion::where('game_id', $gameId)
                ->update(['is_latest' => false]);
        }

        $filePath = null;
        $fileSize = null;

        if ($request->hasFile('file') && $request->file('file')->isValid()) {
            $file     = $request->file('file');
            $ext      = $file->getClientOriginalExtension() ?: 'bin';
            $fileName = time() . '.' . $ext;
            $folder   = 'games/' . $gameId;

            \Storage::disk('public')->makeDirectory($folder);

            $pathname = $file->getPathname();

            $contents = file_get_contents($pathname);
            $stored   = \Storage::disk('public')->put($folder . '/' . $fileName, $contents);

            if ($stored) {
                $filePath = $folder . '/' . $fileName;
                $fileSize = $file->getSize();
            }
        }

        $version = GameVersion::create([
            'game_id'       => $gameId,
            'version'       => $request->input('version'),
            'release_notes' => $request->input('release_notes'),
            'is_latest'     => $request->boolean('is_latest'),
            'file_path'     => $filePath,
            'file_size'     => $fileSize,
            'released_at'   => now(),
        ]);

        return response()->json($version, 201);
    }
    public function setLatest(int $id)
    {
        $version = GameVersion::findOrFail($id);

        GameVersion::where('game_id', $version->game_id)
            ->update(['is_latest' => false]);

        $version->update(['is_latest' => true]);

        return response()->json($version);
    }

    public function destroy(int $id)
    {
        $version = GameVersion::findOrFail($id);

        if ($version->is_latest) {
            $count = GameVersion::where('game_id', $version->game_id)->count();
            if ($count === 1) {
                return response()->json([
                    'message' => 'Nao podes apagar a unica versao do jogo.'
                ], 422);
            }
        }

        $version->delete();
        return response()->json(null, 204);
    }
}