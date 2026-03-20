export default function Sidebar({
    genres = [],
    platforms = [],
    activeSource,
    activeGenre,
    activePlatform,
    onSourceChange,
    onGenreChange,
    onPlatformChange,
    gameCounts = {},
}) {
    return (
        <aside className="w-52 bg-gray-900 border-r border-gray-800 flex flex-col gap-6 py-4 px-3 shrink-0 overflow-y-auto">

            {/* Sources */}
            <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 px-1">Fontes</p>
                {[
                    { key: 'all',     label: 'Todos' },
                    { key: 'network', label: 'Rede Local' },
                    { key: 'web',     label: 'Web' },
                ].map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => onSourceChange(key)}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-sm transition-colors
                            ${activeSource === key
                                ? 'bg-blue-600/20 text-white'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                            }`}
                    >
                        <span>{label}</span>
                        {gameCounts[key] !== undefined && (
                            <span className="text-[11px] bg-gray-800 text-gray-400 rounded-full px-2">
                                {gameCounts[key]}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Géneros */}
            {genres.length > 0 && (
                <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 px-1">Géneros</p>
                    <button
                        onClick={() => onGenreChange(null)}
                        className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors
                            ${!activeGenre ? 'bg-blue-600/20 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
                    >
                        Todos
                    </button>
                    {genres.map(genre => (
                        <button
                            key={genre.id}
                            onClick={() => onGenreChange(genre.slug)}
                            className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors
                                ${activeGenre === genre.slug
                                    ? 'bg-blue-600/20 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                }`}
                        >
                            {genre.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Plataformas */}
            {platforms.length > 0 && (
                <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 px-1">Plataformas</p>
                    <button
                        onClick={() => onPlatformChange(null)}
                        className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors
                            ${!activePlatform ? 'bg-blue-600/20 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
                    >
                        Todas
                    </button>
                    {platforms.map(platform => (
                        <button
                            key={platform.id}
                            onClick={() => onPlatformChange(platform.slug)}
                            className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors
                                ${activePlatform === platform.slug
                                    ? 'bg-blue-600/20 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                }`}
                        >
                            {platform.name}
                        </button>
                    ))}
                </div>
            )}
        </aside>
    )
}