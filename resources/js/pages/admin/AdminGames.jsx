import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import adminService from '../../services/adminService'

function formatSize(bytes) {
    if (!bytes) return '—'
    const gb = bytes / 1024 / 1024 / 1024
    return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(bytes / 1024 / 1024).toFixed(0)} MB`
}

export default function AdminGames() {
    const [games,   setGames]   = useState([])
    const [loading, setLoading] = useState(true)
    const navigate              = useNavigate()

    useEffect(() => { loadGames() }, [])

    function loadGames() {
        setLoading(true)
        adminService.getGames()
            .then(setGames)
            .finally(() => setLoading(false))
    }

    async function handleDelete(game) {
        if (!confirm(`Apagar "${game.title}"? Esta acção não pode ser desfeita.`)) return
        await adminService.deleteGame(game.id)
        loadGames()
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold text-white">Jogos</h1>
                <Link
                    to="/admin/games/new"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
                >
                    + Novo Jogo
                </Link>
            </div>

            {loading ? (
                <p className="text-gray-500 text-sm">A carregar...</p>
            ) : (
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-800 text-left">
                                <th className="px-4 py-3 text-xs text-gray-500 uppercase tracking-wide font-medium">Título</th>
                                <th className="px-4 py-3 text-xs text-gray-500 uppercase tracking-wide font-medium">Fonte</th>
                                <th className="px-4 py-3 text-xs text-gray-500 uppercase tracking-wide font-medium">Géneros</th>
                                <th className="px-4 py-3 text-xs text-gray-500 uppercase tracking-wide font-medium">Versão</th>
                                <th className="px-4 py-3 text-xs text-gray-500 uppercase tracking-wide font-medium">Tamanho</th>
                                <th className="px-4 py-3 text-xs text-gray-500 uppercase tracking-wide font-medium">Estado</th>
                                <th className="px-4 py-3 text-xs text-gray-500 uppercase tracking-wide font-medium">Acções</th>
                            </tr>
                        </thead>
                        <tbody>
                            {games.map((game, i) => (
                                <tr
                                    key={game.id}
                                    className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${i === games.length - 1 ? 'border-0' : ''}`}
                                >
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-white">{game.title}</p>
                                        {game.publisher && <p className="text-xs text-gray-500 mt-0.5">{game.publisher}</p>}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider
                                            ${game.source === 'network'
                                                ? 'bg-blue-900/60 text-blue-300 border border-blue-800'
                                                : 'bg-purple-900/60 text-purple-300 border border-purple-800'
                                            }`}>
                                            {game.source === 'network' ? 'LAN' : 'WEB'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {game.genres.map(g => (
                                                <span key={g.id} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
                                                    {g.name}
                                                </span>
                                            ))}
                                            {game.genres.length === 0 && <span className="text-gray-600 text-xs">—</span>}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-400">
                                        {game.latest_version ? `v${game.latest_version.version}` : <span className="text-gray-600">—</span>}
                                    </td>
                                    <td className="px-4 py-3 text-gray-400">
                                        {game.latest_version ? formatSize(game.latest_version.file_size) : <span className="text-gray-600">—</span>}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full
                                            ${game.is_active
                                                ? 'bg-green-900/40 text-green-400'
                                                : 'bg-gray-800 text-gray-500'
                                            }`}>
                                            {game.is_active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/games/${game.id}/edit`)}
                                                className="text-xs px-2.5 py-1 rounded border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/games/${game.id}/screenshots`)}
                                                className="text-xs px-2.5 py-1 rounded border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                                            >
                                                Screenshots
                                            </button>                                            
                                            <button
                                                onClick={() => navigate(`/admin/games/${game.id}/versions`)}
                                                className="text-xs px-2.5 py-1 rounded border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                                            >
                                                Versões
                                            </button>
                                            <button
                                                onClick={() => handleDelete(game)}
                                                className="text-xs px-2.5 py-1 rounded border border-red-900 text-red-500 hover:bg-red-900/20 transition-colors"
                                            >
                                                Apagar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {games.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500 text-sm">
                                        Nenhum jogo encontrado. <Link to="/admin/games/new" className="text-blue-400 hover:underline">Adiciona o primeiro.</Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}