// resources/js/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import adminService from '../../services/adminService'
import lookupService from '../../services/lookupService'

export default function AdminDashboard() {
    const [stats, setStats] = useState(null)

    useEffect(() => {
        Promise.all([
            adminService.getGames(),
            lookupService.getAll(),
        ]).then(([games, lookups]) => {
            setStats({
                total:     games.length,
                network:   games.filter(g => g.source === 'network').length,
                web:       games.filter(g => g.source === 'web').length,
                genres:    lookups.genres.length,
                platforms: lookups.platforms.length,
                tags:      lookups.tags.length,
            })
        }).catch(err => {
            console.error('Erro ao carregar dashboard:', err)
        })
    }, [])

    const cards = stats ? [
        { label: 'Total de jogos', value: stats.total,     to: '/admin/games' },
        { label: 'Rede Local',     value: stats.network,   to: '/admin/games' },
        { label: 'Web',            value: stats.web,       to: '/admin/games' },
        { label: 'Géneros',        value: stats.genres,    to: '/admin/lookups' },
        { label: 'Plataformas',    value: stats.platforms, to: '/admin/lookups' },
        { label: 'Tags',           value: stats.tags,      to: '/admin/lookups' },
    ] : []

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-xl font-bold text-white">Dashboard</h1>
                <Link
                    to="/admin/games/new"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
                >
                    + Novo Jogo
                </Link>
            </div>

            {!stats ? (
                <p className="text-gray-500 text-sm">A carregar...</p>
            ) : (
                <div className="grid grid-cols-3 gap-4">
                    {cards.map(({ label, value, to }) => (
                        <Link
                            key={label}
                            to={to}
                            className="bg-gray-900 border border-gray-800 hover:border-blue-600/50 rounded-xl p-5 transition-colors"
                        >
                            <p className="text-3xl font-bold text-white">{value}</p>
                            <p className="text-sm text-gray-400 mt-1">{label}</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}