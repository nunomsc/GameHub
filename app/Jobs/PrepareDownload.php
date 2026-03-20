<?php

namespace App\Jobs;

use App\Models\DownloadProgress;
use App\Models\GameVersion;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;

class PrepareDownload implements ShouldQueue
{
    use Queueable;

    public int    $timeout = 0;
    public string $progressKey;
    public int    $versionId;

    public function __construct(string $progressKey, int $versionId)
    {
        $this->progressKey = $progressKey;
        $this->versionId   = $versionId;
    }

    public function handle(): void
    {
        $version = GameVersion::findOrFail($this->versionId);

        DownloadProgress::updateOrCreate(
            ['key' => $this->progressKey],
            ['status' => 'copying', 'percent' => 0]
        );

        try {
            $sourcePath = Storage::disk('public')->path($version->file_path);
            $fileSize   = filesize($sourcePath);

            if (!$fileSize) {
                throw new \Exception('Ficheiro vazio ou inacessível.');
            }

            $source = fopen($sourcePath, 'rb');
            $read   = 0;
            $chunk  = 1024 * 1024; // 1 MB

            // Simula "preparação" lendo o ficheiro e reportando progresso
            // Na prática serve para verificar integridade e pré-aquecer cache do SO
            while (!feof($source)) {
                fread($source, $chunk);
                $read   += $chunk;
                $percent = min(99, (int) (($read / $fileSize) * 100));

                DownloadProgress::where('key', $this->progressKey)
                    ->update(['percent' => $percent]);
            }

            fclose($source);

            DownloadProgress::where('key', $this->progressKey)
                ->update(['status' => 'ready', 'percent' => 100]);

        } catch (\Exception $e) {
            DownloadProgress::where('key', $this->progressKey)
                ->update(['status' => 'error', 'error' => $e->getMessage()]);
        }
    }
}