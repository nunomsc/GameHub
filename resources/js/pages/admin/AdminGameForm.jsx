import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import adminService from '../../services/adminService'
import lookupService from '../../services/lookupService'

export default function AdminGameForm() {
    const { id }        = useParams()
    const navigate      = useNavigate()
    const isEdit        = !!id

    const [loading,     setLoading]   = useState(isEdit)
    const [saving,      setSaving]    = useState(false)
    const [error,       setError]     = useState(null)
    const [genres,      setGenres]    = useState([])
    const [platforms,   setPlatforms] = useState([])
    const [tags,        setTags]      = useState([])

    const [form, setForm] = useState({
        title:       '',
        description: '',
        source:      'web',
        publisher:   '',
        rating:      '',
        is_active:   true,
        genres:      [],
        platforms:   [],
        tags:        [],
    })

    // Carrega lookups e jogo (se editar)
    useEffect(() => {
        lookupService.getAll().then(({ genres, platforms, tags }) => {
            setGenres(genres)
            setPlatforms(platforms)
            setTags(tags)
        })

        if (isEdit) {
            adminService.getGame(id).then(game => {
                setForm({
                    title:       game.title       ?? '',
                    description: game.description ?? '',
                    source:      game.source      ?? 'web',
                    publisher:   game.publisher   ?? '',
                    rating:      game.rating      ?? '',
                    is_active:   game.is_active,
                    genres:      game.genres.map(g => g.id),
                    platforms:   game.platforms.map(p => p.id),
                    tags:        game.tags.map(t => t.id),
                })
            }).finally(() => setLoading(false))
        }
    }, [id])

    function handleChange(e) {
        const { name, value, type, checked } = e.target
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    }

    function toggleMulti(field, itemId) {
        setForm(f => ({
            ...f,
            [field]: f[field].includes(itemId)
                ? f[field].filter(x => x !== itemId)
                : [...f[field], itemId],
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setSaving(true)
        setError(null)

        try {
            if (isEdit) {
                await adminService.updateGame(id, form)
            } else {
                await adminService.createGame(form)
            }
            navigate('/admin/games')
        } catch (err) {
            const msg = err.response?.data?.message
                ?? JSON.stringify(err.response?.data?.errors ?? 'Erro desconhecido')
            setError(msg)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return (
        <div className="p-8 text-gray-500 text-sm">A carregar...</div>
    )

    return (
        <div className="p-8 max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
                <Link to="/admin/games" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                    ← Jogos
                </Link>
                <h1 className="text-xl font-bold text-white">
                    {isEdit ? 'Editar Jogo' : 'Novo Jogo'}
                </h1>
            </div>

            {error && (
                <div className="mb-6 bg-red-900/20 border border-red-800 rounded-lg px-4 py-3 text-sm text-red-400">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                {/* Título */}
                <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1.5">
                        Título <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* Descrição */}
                <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1.5">
                        Descrição
                    </label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
                    />
                </div>

                {/* Fonte + Publisher + Rating */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1.5">
                            Fonte <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="source"
                            value={form.source}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="web">Web</option>
                            <option value="network">Rede Local</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1.5">
                            Editora
                        </label>
                        <input
                            type="text"
                            name="publisher"
                            value={form.publisher}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1.5">
                            Rating (0–10)
                        </label>
                        <input
                            type="number"
                            name="rating"
                            value={form.rating}
                            onChange={handleChange}
                            min="0" max="10" step="0.1"
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Géneros */}
                <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">
                        Géneros
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {genres.map(g => (
                            <button
                                key={g.id}
                                type="button"
                                onClick={() => toggleMulti('genres', g.id)}
                                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors
                                    ${form.genres.includes(g.id)
                                        ? 'bg-blue-600 border-blue-500 text-white'
                                        : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                                    }`}
                            >
                                {g.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Plataformas */}
                <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">
                        Plataformas
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {platforms.map(p => (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => toggleMulti('platforms', p.id)}
                                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors
                                    ${form.platforms.includes(p.id)
                                        ? 'bg-blue-600 border-blue-500 text-white'
                                        : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                                    }`}
                            >
                                {p.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-xs text-gray-500 uppercase tracking-wide mb-2">
                        Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {tags.map(t => (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => toggleMulti('tags', t.id)}
                                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors
                                    ${form.tags.includes(t.id)
                                        ? 'bg-blue-600 border-blue-500 text-white'
                                        : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                                    }`}
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Estado activo */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={form.is_active}
                        onChange={handleChange}
                        className="w-4 h-4 accent-blue-500"
                    />
                    <label htmlFor="is_active" className="text-sm text-gray-300 cursor-pointer">
                        Jogo activo (visível no hub)
                    </label>
                </div>

                {/* Botões */}
                <div className="flex items-center gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
                    >
                        {saving ? 'A guardar...' : isEdit ? 'Guardar alterações' : 'Criar jogo'}
                    </button>
                    <Link
                        to="/admin/games"
                        className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
                    >
                        Cancelar
                    </Link>
                </div>
            </form>
        </div>
    )
}