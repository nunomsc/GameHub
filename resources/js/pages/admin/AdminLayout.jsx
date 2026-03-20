import { NavLink, Outlet, Link } from 'react-router-dom'

const navItems = [
    { to: '/admin',         label: 'Dashboard',  icon: '◻', end: true },
    { to: '/admin/games',   label: 'Jogos',       icon: '🎮' },
    { to: '/admin/lookups', label: 'Géneros / Plataformas / Tags', icon: '☰' },
]

export default function AdminLayout() {
    return (
        <div className="flex h-screen bg-gray-950 text-gray-100">

            {/* Sidebar */}
            <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
                <div className="px-5 py-4 border-b border-gray-800">
                    <Link to="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                        ← Hub público
                    </Link>
                    <p className="text-sm font-bold text-white mt-1 tracking-widest">
                        GAME<span className="text-blue-400">HUB</span>
                        <span className="text-gray-500 font-normal"> /admin</span>
                    </p>
                </div>
                <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                    {navItems.map(({ to, label, icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors
                                ${isActive
                                    ? 'bg-blue-600/20 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                }`
                            }
                        >
                            <span className="text-base">{icon}</span>
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Conteúdo */}
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    )
}