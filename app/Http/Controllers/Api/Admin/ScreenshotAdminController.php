<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\GameScreenshot;
use Illuminate\Http\Request;

class ScreenshotAdminController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'game_id'    => 'required|exists:games,id',
            'file'       => 'required|image',
            'caption'    => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $gameId   = $request->input('game_id');
        $file     = $request->file('file');
        $ext      = $file->getClientOriginalExtension() ?: 'jpg';
        $fileName = time() . '.' . $ext;
        $folder   = 'screenshots/' . $gameId;

        \Storage::disk('public')->makeDirectory($folder);

        $contents = file_get_contents($file->getPathname());
        \Storage::disk('public')->put($folder . '/' . $fileName, $contents);

        $screenshot = GameScreenshot::create([
            'game_id'    => $gameId,
            'file_path'  => $folder . '/' . $fileName,
            'caption'    => $data['caption']    ?? null,
            'sort_order' => $data['sort_order'] ?? 0,
        ]);

        return response()->json($screenshot, 201);
    }
    public function update(Request $request, int $id)
    {
        $screenshot = GameScreenshot::findOrFail($id);

        $data = $request->validate([
            'caption'    => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        $screenshot->update($data);
        return response()->json($screenshot);
    }

    public function destroy(int $id)
    {
        $screenshot = GameScreenshot::findOrFail($id);
        $screenshot->delete();
        return response()->json(null, 204);
    }
}