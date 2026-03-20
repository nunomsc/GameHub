import { useDownload } from '../../context/DownloadContext'
import ProgressBar from '../ui/ProgressBar'

function formatSize(bytes) {
    if (!bytes) return '—'
    const gb = bytes / 1024 / 1024 / 1024
    return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(bytes / 1024 / 1024).toFixed(0)} MB`
}

export default function DownloadBar() {
    const { queue, removeFromQueue } = useDownload()

    if (queue.length === 0) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
            <div className="max-w-5xl mx-auto px-6 py-3 flex flex-col gap-2">
                {queue.map(item => (
                    <div key={item.gameId} className="flex items-center gap-4">

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-white truncate">
                                    {item.gameTitle}
                                    <span className="text-gray-500 text-xs ml-2">v{item.version}</span>
                                </span>
                                <span className="text-xs text-gray-400 ml-4 shrink-0">
                                    {item.status === 'done'
                                        ? '✓ Concluído'
                                        : item.status === 'error'
                                            ? '✕ Erro'
                                            : `${Math.round(item.progress)}% de ${formatSize(item.fileSize)}`
                                    }
                                </span>
                            </div>
                            <ProgressBar
                                value={item.progress}
                                animated={item.status === 'downloading'}
                            />
                            {item.error && (
                                <p className="text-xs text-red-400 mt-1">{item.error}</p>
                            )}
                        </div>

                        {/* Remover */}
                        {(item.status === 'done' || item.status === 'error') && (
                            <button
                                onClick={() => removeFromQueue(item.gameId)}
                                className="text-gray-600 hover:text-gray-400 text-sm transition-colors shrink-0"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}