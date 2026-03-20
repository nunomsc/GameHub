import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import adminService from '../../services/adminService'
import api from '../../services/api'

function formatSize(bytes) {
    if (!bytes) return '—'
    const gb = bytes / 1024 / 1024 / 1024
    return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(bytes / 1024 / 1024).toFixed(0)} MB`
}

export default function AdminVersions() {
    const { id }            = useParams()
    const [game,    setGame]    = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving,  setSaving]  = useState(false)
    const [error,   setError]   = useState(null)
    const [success, setSuccess] = useState(null)

    const [form, setForm] = useState({
        version:       '',
        release_notes: '',
        file:          null,
    })

    useEffect(() => {
        adminService.getGame(id)
            .then(setGame)
            .finally(() => setLoading(false))
    }, [id])

    function handleChange(e) {
        const { name, value, files } = e.target
        setForm(f => ({ ...f, [name]: files ? files[0] : value }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!form.version.trim()) return
        setSaving(true)
        setError(null)
        setSuccess(null)

        try {
            const data = new FormData()
            data.append('game_id',       id)
            data.append('version',       form.version.trim())
            data.append('release_notes', form.release_notes)
            data.append('is_latest',     '1')
            if (form.file) {
                data.append('file', form.file)
            }

            await api.post('/admin/versions', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            setSuccess(`Versão ${form.version} adicionada com sucesso.`)
            setForm({ version: '', release_notes: '', file: null })

            // Recarrega o jogo para actualizar a lista de versões
            const updated = await adminService.getGame(id)
            setGame(updated)

        } catch (err) {
            const errors = err.response?.data?.errors
            setError(errors
                ? Object.values(errors).flat().join(' ')
                : err.response?.data?.message ?? 'Erro ao guardar versão.'
            )
        } finally {
            setSaving(false)
        }
    }

    async function handleSetLatest(versionId) {
        await api.patch(`/admin/versions/${versionId}/latest`)
        const updated = await adminService.getGame(id)
        setGame(updated)
    }

    async function handleDeleteVersion(versionId) {
        if (!confirm('Apagar esta versão?')) return
        await api.delete(`/admin/versions/${versionId}`)
        const updated = await adminService.getGame(id)
        setGame(updated)
    }

    if (loading) return <div className="p-8 text-gray-500 text-sm">A carregar...</div>
    if (!game)   return <div className="p-8 text-gray-500 text-sm">Jogo não encontrado.</div>

    return (
        <div className="p-8 max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
                <Link to="/admin/games" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                    ← Jogos
                </Link>
                <h1 className="text-xl font-bold text-white">
                    Versões — <span className="text-blue-400">{game.title}</span>
                </h1>
            </div>

            {/* Lista de versões existentes */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-8">
                <div className="px-5 py-3 border-b border-gray-800">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Versões existentes</p>
                </div>
                {game.versions?.length === 0 ? (
                    <p className="px-5 py-4 text-sm text-gray-600">Nenhuma versão registada.</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-800 text-left">
                                <th className="px-4 py-2.5 text-xs text-gray-500 font-medium">Versão</th>
                                <th className="px-4 py-2.5 text-xs text-gray-500 font-medium">Ficheiro</th>
                                <th className="px-4 py-2.5 text-xs text-gray-500 font-medium">Tamanho</th>
                                <th className="px-4 py-2.5 text-xs text-gray-500 font-medium">Estado</th>
                                <th className="px-4 py-2.5 text-xs text-gray-500 font-medium">Acções</th>
                            </tr>
                        </thead>
                        <tbody>
                            {game.versions.map(v => (
                                <tr key={v.id} className="border-b border-gray-800/50 last:border-0">
                                    <td className="px-4 py-3 font-medium text-white">v{v.version}</td>
                                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                                        {v.file_path ?? '—'}
                                    </td>
                                    <td className="px-4 py-3 text-gray-400">
                                        {formatSize(v.file_size)}
                                    </td>
                                    <td className="px-4 py-3">
                                        {v.is_latest ? (
                                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-900/40 text-green-400">
                                                Actual
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-gray-600">Antiga</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            {!v.is_latest && (
                                                <button
                                                    onClick={() => handleSetLatest(v.id)}
                                                    className="text-xs px-2 py-1 rounded border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                                                >
                                                    Marcar actual
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteVersion(v.id)}
                                                className="text-xs px-2 py-1 rounded border border-red-900 text-red-500 hover:bg-red-900/20 transition-colors"
                                            >
                                                Apagar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Formulário nova versão */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-4">
                    Adicionar nova versão
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
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1.5">
                                Número de versão <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="version"
                                value={form.version}
                                onChange={handleChange}
                                placeholder="ex: 1.2.0"
                                required
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1.5">
                                Ficheiro instalador
                            </label>
                            <input
                                type="file"
                                name="file"
                                accept=".zip"
                                onChange={handleChange}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-400 focus:outline-none focus:border-blue-500 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-gray-700 file:text-gray-300"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wide mb-1.5">
                            Notas da versão
                        </label>
                        <textarea
                            name="release_notes"
                            value={form.release_notes}
                            onChange={handleChange}
                            rows={3}
                            placeholder="O que mudou nesta versão..."
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm rounded-lg transition-colors"
                        >
                            {saving ? 'A guardar...' : 'Adicionar versão'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}