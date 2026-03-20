<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Install;
use App\Models\GameVersion;
use Illuminate\Http\Request;

class InstallController extends Controller
{
    // GET /api/installs?machine_id=xxx
    // Devolve todas as instalações de uma máquina
    public function index(Request $request)
    {
        $request->validate([
            'machine_id' => 'required|string',
        ]);

        $installs = Install::with(['game', 'version'])
            ->where('machine_id', $request->machine_id)
            ->get();

        return response()->json($installs);
    }

    // POST /api/installs
    // Regista ou actualiza uma instalação
    public function store(Request $request)
    {
        $request->validate([
            'game_id'      => 'required|exists:games,id',
            'version_id'   => 'required|exists:game_versions,id',
            'machine_id'   => 'required|string',
            'machine_name' => 'nullable|string',
            'status'       => 'required|in:pending,downloading,installed,failed,uninstalled',
            'install_path' => 'nullable|string',
        ]);

        $install = Install::updateOrCreate(
            [
                'game_id'    => $request->game_id,
                'machine_id' => $request->machine_id,
            ],
            [
                'version_id'   => $request->version_id,
                'machine_name' => $request->machine_name,
                'status'       => $request->status,
                'install_path' => $request->install_path,
                'installed_at' => $request->status === 'installed' ? now() : null,
            ]
        );

        return response()->json($install, 201);
    }

    // PATCH /api/installs/{id}/status
    // Actualiza só o status (ex: downloading → installed)
    public function updateStatus(Request $request, int $id)
    {
        $request->validate([
            'status' => 'required|in:pending,downloading,installed,failed,uninstalled',
        ]);

        $install = Install::findOrFail($id);
        $install->status = $request->status;

        if ($request->status === 'installed') {
            $install->installed_at = now();
        }

        $install->save();

        return response()->json($install);
    }
}