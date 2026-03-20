import { createContext, useContext, useState, useCallback, useRef } from 'react'
import installService from '../services/installService'
import api from '../services/api'

const DownloadContext = createContext(null)

export function DownloadProvider({ children }) {
    const [queue, setQueue] = useState([])
    const sources           = useRef({})

    const updateItem = useCallback((gameId, patch) => {
        setQueue(q => q.map(item =>
            item.gameId === gameId ? { ...item, ...patch } : item
        ))
    }, [])

    const startDownload = useCallback(async (game, version) => {
        setQueue(q => {
            if (q.find(item => item.gameId === game.id)) return q
            return [...q, {
                gameId:    game.id,
                gameTitle: game.title,
                versionId: version.id,
                version:   version.version,
                fileSize:  version.file_size,
                progress:  0,
                status:    'preparing',
                error:     null,
            }]
        })

        try {
            // 1. Inicia a preparação no servidor
            const { data } = await api.post(`/download/${version.id}/start`)
            const { key }  = data

            updateItem(game.id, { status: 'downloading' })

            // 2. Abre SSE para receber progresso
            const es = new EventSource(`/api/download/${key}/progress`)
            sources.current[game.id] = es

            es.addEventListener('progress', e => {
                const { percent } = JSON.parse(e.data)
                updateItem(game.id, { progress: percent })
            })

            es.addEventListener('done', e => {
                const { url } = JSON.parse(e.data)
                es.close()
                delete sources.current[game.id]

                updateItem(game.id, { status: 'done', progress: 100 })

                // 3. Abre o download real do ficheiro
                const a = document.createElement('a')
                a.href     = url
                a.download = ''
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)

                // Actualiza estado na BD
                installService.getAll().then(installs => {
                    const install = installs.find(i => i.game_id === game.id)
                    if (install) installService.updateStatus(install.id, 'installed')
                })
            })

            es.addEventListener('error', () => {
                es.close()
                delete sources.current[game.id]
                updateItem(game.id, { status: 'error', error: 'Erro no download.' })
            })

        } catch (err) {
            updateItem(game.id, { status: 'error', error: 'Não foi possível iniciar o download.' })
        }
    }, [updateItem])

    const removeFromQueue = useCallback((gameId) => {
        if (sources.current[gameId]) {
            sources.current[gameId].close()
            delete sources.current[gameId]
        }
        setQueue(q => q.filter(item => item.gameId !== gameId))
    }, [])

    return (
        <DownloadContext.Provider value={{ queue, startDownload, removeFromQueue }}>
            {children}
        </DownloadContext.Provider>
    )
}

export function useDownload() {
    return useContext(DownloadContext)
}