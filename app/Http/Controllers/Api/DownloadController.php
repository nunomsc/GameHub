<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\PrepareDownload;
use App\Models\DownloadProgress;
use App\Models\GameVersion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DownloadController extends Controller
{
    // POST /api/download/{versionId}/start
    // Inicia a preparação e devolve uma key de progresso
    public function start(int $versionId)
    {
        $version = GameVersion::findOrFail($versionId);

        if (!$version->file_path || !Storage::disk('public')->exists($version->file_path)) {
            return response()->json(['message' => 'Ficheiro não encontrado.'], 404);
        }

        $key = Str::uuid()->toString();

        DownloadProgress::create([
            'key'        => $key,
            'version_id' => $versionId,
            'percent'    => 0,
            'status'     => 'pending',
        ]);

        PrepareDownload::dispatch($key, $versionId);

        return response()->json(['key' => $key]);
    }

    // GET /api/download/{key}/progress
    // SSE — envia progresso ao cliente
    public function progress(string $key)
    {
        return response()->stream(function () use ($key) {
            if (ob_get_level()) ob_end_clean();

            $maxWait = 300; // 5 minutos máximo
            $elapsed = 0;

            while ($elapsed < $maxWait) {
                $progress = DownloadProgress::find($key);

                if (!$progress) {
                    echo "event: error\n";
                    echo "data: " . json_encode(['message' => 'Progresso não encontrado.']) . "\n\n";
                    flush();
                    break;
                }

                echo "event: progress\n";
                echo "data: " . json_encode(['percent' => $progress->percent]) . "\n\n";
                flush();

                if ($progress->status === 'ready') {
                    echo "event: done\n";
                    echo "data: " . json_encode([
                        'url' => "/api/download/{$key}/file"
                    ]) . "\n\n";
                    flush();
                    break;
                }

                if ($progress->status === 'error') {
                    echo "event: error\n";
                    echo "data: " . json_encode(['message' => $progress->error]) . "\n\n";
                    flush();
                    break;
                }

                sleep(1);
                $elapsed++;
            }

        }, 200, [
            'Content-Type'      => 'text/event-stream',
            'Cache-Control'     => 'no-cache',
            'X-Accel-Buffering' => 'no',
        ]);
    }

    // GET /api/download/{key}/file
    // Streaming real do ficheiro — sem carregar RAM
    public function file(string $key)
    {
        $progress = DownloadProgress::find($key);

        if (!$progress || $progress->status !== 'ready') {
            return response()->json(['message' => 'Ficheiro não está pronto.'], 404);
        }

        // Encontra a versão pelo key — precisamos de guardar o versionId no progress
        // Vamos buscar pelo progresso que tem o versionId
        $versionId = \DB::table('download_progress')
            ->where('key', $key)
            ->value('version_id');

        $version = GameVersion::findOrFail($versionId);
        $path     = Storage::disk('public')->path($version->file_path);
        $fileName = basename($version->file_path);
        $fileSize = filesize($path);
        $mimeType = mime_content_type($path) ?: 'application/octet-stream';

        return response()->stream(function () use ($path) {
            if (ob_get_level()) ob_end_clean();

            $handle = fopen($path, 'rb');
            $chunk  = 1024 * 1024; // 1 MB

            while (!feof($handle)) {
                echo fread($handle, $chunk);
                flush();
            }

            fclose($handle);

        }, 200, [
            'Content-Type'        => $mimeType,
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
            'Content-Length'      => $fileSize,
            'Cache-Control'       => 'no-cache, no-store',
            'X-Accel-Buffering'   => 'no',
        ]);

        DownloadProgress::where('key', $key)->delete();
    }
}