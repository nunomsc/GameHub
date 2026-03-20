// resources/js/pages/admin/AdminLookups.jsx
import { useState, useEffect } from 'react'
import adminService from '../../services/adminService'
import lookupService from '../../services/lookupService'

function LookupSection({ title, items, onAdd, onDelete, loading }) {
    const [newName, setNewName] = useState('')
    const [saving,  setSaving]  = useState(false)
    const [error,   setError]   = useState(null)

    async function handleAdd(e) {
        e.preventDefault()
        if (!newName.trim()) return
        setSaving(true)
        setError(null)
        try {
            await onAdd(newName.trim())
            setNewName('')
        } catch (err) {
            const errors = err.response?.data?.errors
            setError(errors?.name?.[0] ?? 'Erro ao adicionar.')
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete(item) {
        if (!confirm(`Apagar "${item.name}"?`)) return
        try {
            await onDelete(item.id)
        } catch {
            alert('Não foi possível apagar — pode estar associado a jogos.')
        }
    }

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
                {title}
            </h2>

            {/* Lista */}
            <div className="flex flex-wrap gap-2 mb-4 min-h-8">
                {loading ? (
                    <span className="text-gray-600 text-xs">A carregar...</span>
                ) : items.length === 0 ? (
                    <span className="text-gray-600 text-xs">Nenhum item ainda.</span>
                ) : items.map(item => (
                    <div
                        key={item.id}
                        className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 rounded-lg pl-3 pr-1.5 py-1"
                    >
                        <span className="text-sm text-gray-300">{item.name}</span>
                        <button
                            onClick={() => handleDelete(item)}
                            className="text-gray-600 hover:text-red-400 transition-colors text-xs leading-none pb-0.5"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            {/* Erro */}
            {error && (
                <p className="text-xs text-red-400 mb-3">{error}</p>
            )}

            {/* Formulário de adição */}
            <form onSubmit={handleAdd} className="flex gap-2">
                <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder={`Novo ${title.toLowerCase()}...`}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                />
                <button
                    type="submit"
                    disabled={saving || !newName.trim()}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm rounded-lg transition-colors"
                >
                    {saving ? '...' : 'Adicionar'}
                </button>
            </form>
        </div>
    )
}

export default function AdminLookups() {
    const [genres,    setGenres]    = useState([])
    const [platforms, setPlatforms] = useState([])
    const [tags,      setTags]      = useState([])
    const [loading,   setLoading]   = useState(true)

    useEffect(() => {
        lookupService.getAll().then(({ genres, platforms, tags }) => {
            setGenres(genres)
            setPlatforms(platforms)
            setTags(tags)
        }).finally(() => setLoading(false))
    }, [])

    // Géneros
    async function addGenre(name) {
        const created = await adminService.createGenre(name)
        setGenres(g => [...g, created].sort((a, b) => a.name.localeCompare(b.name)))
    }
    async function deleteGenre(id) {
        await adminService.deleteGenre(id)
        setGenres(g => g.filter(x => x.id !== id))
    }

    // Plataformas
    async function addPlatform(name) {
        const created = await adminService.createPlatform(name)
        setPlatforms(p => [...p, created].sort((a, b) => a.name.localeCompare(b.name)))
    }
    async function deletePlatform(id) {
        await adminService.deletePlatform(id)
        setPlatforms(p => p.filter(x => x.id !== id))
    }

    // Tags
    async function addTag(name) {
        const created = await adminService.createTag(name)
        setTags(t => [...t, created].sort((a, b) => a.name.localeCompare(b.name)))
    }
    async function deleteTag(id) {
        await adminService.deleteTag(id)
        setTags(t => t.filter(x => x.id !== id))
    }

    return (
        <div className="p-8 max-w-3xl">
            <h1 className="text-xl font-bold text-white mb-8">Géneros, Plataformas e Tags</h1>

            <div className="flex flex-col gap-6">
                <LookupSection
                    title="Géneros"
                    items={genres}
                    onAdd={addGenre}
                    onDelete={deleteGenre}
                    loading={loading}
                />
                <LookupSection
                    title="Plataformas"
                    items={platforms}
                    onAdd={addPlatform}
                    onDelete={deletePlatform}
                    loading={loading}
                />
                <LookupSection
                    title="Tags"
                    items={tags}
                    onAdd={addTag}
                    onDelete={deleteTag}
                    loading={loading}
                />
            </div>
        </div>
    )
}