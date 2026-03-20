import { useNavigate } from 'react-router-dom'
import Badge from '../ui/Badge'
import ProgressBar from '../ui/ProgressBar'

function formatSize(bytes) {
    if (!bytes) return '—'
    const gb = bytes / 1024 / 1024 / 1024
    return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(bytes / 1024 / 1024).toFixed(0)} MB`
}

export default function GameCard({ game, install }) {
    const navigate = useNavigate()
    const version  = game.latest_version
    const status   = install?.status ?? 'available'

    const statusButton = () => {
        if (status === 'installed')   return <span className="w-full text-center text-xs py-1.5 rounded bg-gray-800 text-green-400 border border-green-900">✓ Instalado</span>
        if (status === 'downloading') return <ProgressBar value={install?.progress ?? 0} animated />
        if (status === 'failed')      return <span className="w-full text-center text-xs py-1.5 rounded bg-red-900/30 text-red-400 border border-red-900">Falhou</span>
        return (
            <button
                onClick={e => { e.stopPropagation(); navigate(`/games/${game.slug}`) }}
                className="w-full text-xs py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
                ⬇ Instalar
            </button>
        )
    }

    return (
        <div
            onClick={() => navigate(`/games/${game.slug}`)}
            className="bg-gray-900 border border-gray-800 hover:border-blue-600/50 rounded-xl overflow-hidden cursor-pointer transition-all hover:-translate-y-0.5"
        >
            <div className="h-24 bg-gray-800 flex items-center justify-center text-4xl relative">
                {game.thumbnail
                    ? <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
                    : <span>🎮</span>
                }
                <span className={`absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider
                    ${game.source === 'network'
                        ? 'bg-blue-900/80 text-blue-300 border border-blue-700'
                        : 'bg-purple-900/80 text-purple-300 border border-purple-700'
                    }`}>
                    {game.source === 'network' ? 'LAN' : 'WEB'}
                </span>
            </div>

            <div className="p-3">
                <p className="text-sm font-semibold text-white truncate">{game.title}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                    {game.genres.slice(0, 2).map(g => (
                        <Badge key={g.id} label={g.name} type={g.slug} />
                    ))}
                </div>
                <div className="flex items-center justify-between mt-2 text-[11px] text-gray-500">
                    <span>{version ? formatSize(version.file_size) : '—'}</span>
                    <span>{game.rating ? `${game.rating}★` : ''}</span>
                </div>
                <div className="mt-2">
                    {statusButton()}
                </div>
            </div>
        </div>
    )
}