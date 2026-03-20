import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import adminService from '../../services/adminService'
import api from '../../services/api'

export default function AdminScreenshots() {
    const { id }                = useParams()
    const [game,    setGame]    = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving,  setSaving]  = useState(false)
    const [error,   setError]   = useState(null)
    const [success, setSuccess] = useState(null)

    const [form, setForm] = useState({
        caption:    '',
        sort_order: '0',
        file:       null,
    })

    useEffect(() => {
        loadGame()
    }, [id])

    function loadGame() {
        adminService.getGame(id)
            .then(setGame)
            .finally(() => setLoading(false))
    }

    function handleChange(e) {
        const { name, value, files } = e.target
        setForm(f => ({ ...f, [name]: files ? files[0] : value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!form.file) {
            setError('Selecciona um ficheiro de imagem.')
            return
        }
        setSaving(true)
        setError(null)
        setSuccess(null)

        try {
            const data = new FormData()
            data.append('game_id',    id)
            data.append('caption',    form.caption)
            data.append('sort_order', form.sort_order)
            data.append('file',       form.file)

            await api.post('/admin/screenshots', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            setSuccess('Screenshot adicionada com sucesso.')
            setForm({ caption: '', sort_order: '0', file: null })

            // Reset input file
            document.getElementById('screenshot-file').value = ''

            loadGame()
        } catch (err) {
            const errors = err.response?.data?.errors
            setError(errors
                ? Object.values(errors).flat().join(' ')
                : err.response?.data?.message ?? 'Erro ao guardar screenshot.'
            )
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete(screenshotId) {
        if (!confirm('Apagar esta screenshot?')) return
        try {
            await api.delete(`/admin/screenshots/${screenshotId}`)
            loadGame()
        } catch {
            alert('Erro ao apagar screenshot.')
        }
    }

    async function handleSortUpdate(screenshotId, newOrder) {
        try {
            await api.patch(`/admin/screenshots/${screenshotId}`, {
                sort_order: parseInt(newOrder)
            })
            loadGame()
        } catch {
            alert('Erro ao actualizar ordem.')
        }
    }

    if (loading) return <div className="p-8 text-gray-500 text-sm">A carregar...</div>
    if (!game)   return <div className="p-8 text-gray-500 text-sm">Jogo não encontrado.</div>

    return (
        <div className="p-8 max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
                <Link to="/admin/games" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                    ← Jogos
                </Link>
                <h1 className="text-xl font-bold text-white">
                    Screenshots — <span className="text-blue-400">{game.title}</span>
                </h1>
            </div>

            {/* Grid de screenshots existentes */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-8">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-4">
                    Screenshots existentes ({game.screenshots?.length ?? 0})
                </p>

                {game.screenshots?.length === 0 ? (
                    <p className="text-sm text-gray-600">Nenhuma screenshot adicionada.</p>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {game.screenshots.map(s => (
                            <div
                                key={s.id}
                                className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden"
                            >
                                {/* Imagem */}
                                <div className="aspect-video bg-gray-700 flex items-center justify-center">
                                    {s.file_path ? (
                                        <img
                                            src={`/storage/${s.file_path}`}
                                            alt={s.caption ?? game.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-600 text-xs">Sem imagem</span>
                                    )}
                                </div>

                                {/* Info + acções */}
                                <div className="p-3 flex items-center gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-400 truncate">
                                            {s.caption || <span className="text-gray-600 italic">Sem legenda</span>}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <label className="text-xs text-gray-600">Ordem</label>
                                        <input
                                            type="number"
                                            defaultValue={s.sort_order}
                                            onBlur={e => handleSortUpdate(s.id, e.target.value)}
                                            className="w-14 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                                        />
                                        <button
                                            onClick={() => handleDelete(s.id)}
                                            className="text-xs px-2 py-1 rounded border border-red-900 text-red-500 hover:bg-red-900/20 transition-colors"
                                        >
                                            Apagar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Formulário nova screenshot */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-4">
                    Adicionar screenshot
                </p>

                {error && (
                    <div className="mb-4 bg-red-900/20 border border-red-800 rounded-lg px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 bg-green-900/20 border border-green-800 rounded-lg px-4 py-3 text-sm text-green-400">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1.5">
                            Imagem <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="screenshot-file"
                            type="file"
                            name="file"
                            accept="image/*"
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-400 focus:outline-none focus:border-blue-500 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-gray-700 file:text-gray-300"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1.5">
                                Legenda
                            </label>
                            <input
                                type="text"
                                name="caption"
                                value={form.caption}
                                onChange={handleChange}
                                placeholder="Descrição opcional da imagem"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1.5">
                                Ordem
                            </label>
                            <input
                                type="number"
                                name="sort_order"
                                value={form.sort_order}
                                onChange={handleChange}
                                min="0"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm rounded-lg transition-colors"
                        >
                            {saving ? 'A enviar...' : 'Adicionar screenshot'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}