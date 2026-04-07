import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Badge from '../components/ui/Badge'
import gameService from '../services/gameService'
import installService from '../services/installService'
import { useDownload } from '../context/DownloadContext'

function formatSize(bytes) {
    if (!bytes) return '—'
    const gb = bytes / 1024 / 1024 / 1024
    return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(bytes / 1024 / 1024).toFixed(0)} MB`
}

export default function GameDetailPage() {
    const { slug }     = useParams()
    const navigate     = useNavigate()
    const [game,       setGame]    = useState(null)
    const [install,    setInstall] = useState(null)
    const [loading,    setLoading] = useState(true)
    const { startDownload } = useDownload()

    useEffect(() => {
        Promise.all([
            gameService.getBySlug(slug),
            installService.getAll(),
        ]).then(([gameData, installs]) => {
            setGame(gameData)
            const found = installs.find(i => i.game_id === gameData.id)
            setInstall(found ?? null)
        }).finally(() => setLoading(false))
    }, [slug])



    async function handleInstall() {
        if (!game?.latest_version) return

        // Regista na base de dados
        const result = await installService.save(
            game.id,
            game.latest_version.id,
            'downloading'
        )
        setInstall(result)

        // Inicia o download via SSE
        startDownload(game, game.latest_version)
    }    

    async function handleUninstall() {
        if (!install) return
        const result = await installService.updateStatus(install.id, 'uninstalled')
        setInstall(result)
    }

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-gray-950 text-gray-400 text-sm">
            A carregar...
        </div>
    )

    if (!game) return (
        <div className="flex items-center justify-center h-screen bg-gray-950 text-gray-400 text-sm">
            Jogo não encontrado.
        </div>
    )

    const version      = game.latest_version
    const isInstalled  = install?.status === 'installed'
    const isPending    = install?.status === 'pending'

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100">

            {/* Header */}
            <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                    ← Voltar
                </button>
                <div className="font-bold text-lg tracking-widest text-white">
                    GAME<span className="text-blue-400">HUB</span>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6 py-8">

                {/* Hero */}
                <div className="flex gap-6 mb-8">
                    <div className="w-32 h-32 bg-gray-800 rounded-xl flex items-center justify-center text-5xl shrink-0">
                        {game.thumbnail
                            ? <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover rounded-xl" />
                            : '🎮'
                        }
                    </div>
                    <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-white">{game.title}</h1>
                                <p className="text-sm text-gray-400 mt-1">{game.publisher ?? 'Editora desconhecida'}</p>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shrink-0
                                ${game.source === 'network'
                                    ? 'bg-blue-900/80 text-blue-300 border border-blue-700'
                                    : 'bg-purple-900/80 text-purple-300 border border-purple-700'
                                }`}>
                                {game.source === 'network' ? 'LAN' : 'WEB'}
                            </span>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {game.genres.map(g   => <Badge key={g.id} label={g.name} type={g.slug} />)}
                            {game.platforms.map(p => <Badge key={p.id} label={p.name} />)}
                            {game.tags.map(t      => <Badge key={t.id} label={t.name} />)}
                        </div>

                        {/* Stats */}
                        <div className="flex gap-4 mt-4">
                            {game.rating && (
                                <div className="bg-gray-800 rounded-lg px-4 py-2 text-center">
                                    <div className="text-lg font-semibold text-white">{game.rating}★</div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-wide">Rating</div>
                                </div>
                            )}
                            {version && (
                                <div className="bg-gray-800 rounded-lg px-4 py-2 text-center">
                                    <div className="text-lg font-semibold text-white">{formatSize(version.file_size)}</div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-wide">Tamanho</div>
                                </div>
                            )}
                            {version && (
                                <div className="bg-gray-800 rounded-lg px-4 py-2 text-center">
                                    <div className="text-lg font-semibold text-white">v{version.version}</div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-wide">Versão</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">

                    {/* Coluna principal */}
                    <div className="col-span-2 flex flex-col gap-6">

                        {/* Descrição */}
                        {game.description && (
                            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Descrição</h2>
                                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{game.description}</p>
                            </div>
                        )}

                        {/* Requisitos de sistema */}
                        {game.system_requirements?.length > 0 && (
                            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Requisitos de Sistema</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {game.system_requirements.map(req => (
                                        <div key={req.id}>
                                            <p className="text-xs font-semibold text-blue-400 mb-2 uppercase">
                                                {req.type === 'minimum' ? 'Mínimos' : 'Recomendados'} — {req.platform?.name}
                                            </p>
                                            {[
                                                ['SO',        req.os_version],
                                                ['CPU',       req.cpu],
                                                ['RAM',       req.ram_gb ? `${req.ram_gb} GB` : null],
                                                ['GPU',       req.gpu],
                                                ['Disco',     req.storage_gb ? `${req.storage_gb} GB` : null],
                                                ['DirectX',   req.directx],
                                            ].filter(([, v]) => v).map(([label, value]) => (
                                                <div key={label} className="flex justify-between text-xs py-1 border-b border-gray-800">
                                                    <span className="text-gray-500">{label}</span>
                                                    <span className="text-gray-300">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Screenshots */}
                        {game.screenshots?.length > 0 && (
                            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Screenshots</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {game.screenshots.map(s => (
                                        <img
                                            key={s.id}
                                            src={`/storage/${s.file_path}`}
                                            alt={s.caption ?? game.title}
                                            className="rounded-lg w-full object-cover aspect-video bg-gray-800"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Coluna lateral — acções */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-3">
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Instalação</h2>

                            {isInstalled ? (
                                <>
                                    <div className="text-xs text-green-400 bg-green-900/20 border border-green-900 rounded-lg px-3 py-2">
                                        ✓ Instalado
                                        {install?.install_path && (
                                            <p className="text-gray-500 mt-1 font-mono text-[10px] break-all">{install.install_path}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleUninstall}
                                        className="w-full py-2 rounded-lg text-sm text-red-400 border border-red-900 hover:bg-red-900/20 transition-colors"
                                    >
                                        Desinstalar
                                    </button>
                                </>
                            ) : isPending ? (
                                <div className="text-xs text-yellow-400 bg-yellow-900/20 border border-yellow-900 rounded-lg px-3 py-2">
                                    ⏳ Instalação pendente
                                </div>
                            ) : (
                                <button
                                    onClick={handleInstall}
                                    disabled={!version}
                                    className="w-full py-2.5 rounded-lg text-sm bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    ⬇ Instalar — {formatSize(version?.file_size)}
                                </button>
                            )}

                            {version && (
                                <div className="text-[11px] text-gray-500 space-y-1">
                                    <div className="flex justify-between">
                                        <span>Versão</span>
                                        <span className="text-gray-400">v{version.version}</span>
                                    </div>
                                    {version.released_at && (
                                        <div className="flex justify-between">
                                            <span>Lançamento</span>
                                            <span className="text-gray-400">
                                                {new Date(version.released_at).toLocaleDateString('pt-PT')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}