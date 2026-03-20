import { useState, useEffect, useCallback } from 'react'
import Topbar from '../components/layout/Topbar'
import Sidebar from '../components/layout/Sidebar'
import GameGrid from '../components/games/GameGrid'
import gameService from '../services/gameService'
import lookupService from '../services/lookupService'
import installService from '../services/installService'

export default function Library() {
    const [games,          setGames]          = useState([])
    const [genres,         setGenres]         = useState([])
    const [platforms,      setPlatforms]      = useState([])
    const [installs,       setInstalls]       = useState({})
    const [selectedGame,   setSelectedGame]   = useState(null)
    const [loading,        setLoading]        = useState(true)

    // Filtros
    const [search,         setSearch]         = useState('')
    const [activeSource,   setActiveSource]   = useState('all')
    const [activeGenre,    setActiveGenre]    = useState(null)
    const [activePlatform, setActivePlatform] = useState(null)

    // Carrega lookups e instalações uma vez
    useEffect(() => {
        Promise.all([
            lookupService.getAll(),
            installService.getAll(),
        ]).then(([lookups, installList]) => {
            setGenres(lookups.genres)
            setPlatforms(lookups.platforms)

            // Indexa instalações por game_id para acesso rápido
            const indexed = {}
            installList.forEach(i => { indexed[i.game_id] = i })
            setInstalls(indexed)
        })
    }, [])

    // Carrega jogos sempre que os filtros mudam
    const loadGames = useCallback(() => {
        setLoading(true)
        const params = {}
        if (search)         params.search   = search
        if (activeSource !== 'all') params.source = activeSource
        if (activeGenre)    params.genre    = activeGenre
        if (activePlatform) params.platform = activePlatform

        gameService.getAll(params)
            .then(setGames)
            .finally(() => setLoading(false))
    }, [search, activeSource, activeGenre, activePlatform])

    useEffect(() => {
        const timer = setTimeout(loadGames, 300) // debounce na pesquisa
        return () => clearTimeout(timer)
    }, [loadGames])

    // Contagem de jogos por source para a sidebar
    const gameCounts = {
        all:     games.length,
        network: games.filter(g => g.source === 'network').length,
        web:     games.filter(g => g.source === 'web').length,
    }

    return (
        <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
            <Topbar onSearch={setSearch} networkOnline={true} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    genres={genres}
                    platforms={platforms}
                    activeSource={activeSource}
                    activeGenre={activeGenre}
                    activePlatform={activePlatform}
                    onSourceChange={setActiveSource}
                    onGenreChange={setActiveGenre}
                    onPlatformChange={setActivePlatform}
                    gameCounts={gameCounts}
                />
                <main className="flex-1 overflow-y-auto p-5">
                    {loading
                        ? <div className="flex items-center justify-center h-48 text-gray-500 text-sm">A carregar...</div>
                        : <GameGrid
                            games={games}
                            installs={installs}
                            onSelect={setSelectedGame}
                            selectedSlug={selectedGame?.slug}
                          />
                    }
                </main>
            </div>
        </div>
    )
}