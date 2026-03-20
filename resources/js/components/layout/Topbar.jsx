// resources/js/components/layout/Topbar.jsx
import { useState } from 'react'

export default function Topbar({ onSearch, networkOnline = true }) {
    const [query, setQuery] = useState('')

    function handleChange(e) {
        setQuery(e.target.value)
        onSearch(e.target.value)
    }

    return (
        <header className="h-13 bg-gray-900 border-b border-gray-800 flex items-center gap-4 px-5 shrink-0">
            <div className="font-bold text-lg tracking-widest text-white">
                GAME<span className="text-blue-400">HUB</span>
            </div>

            <div className="relative flex-1 max-w-xs">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">⌕</span>
                <input
                    type="text"
                    value={query}
                    onChange={handleChange}
                    placeholder="Pesquisar jogos..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-md pl-8 pr-3 py-1.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
            </div>

            <div className="ml-auto flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${networkOnline ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-xs text-gray-400">
                    {networkOnline ? 'Rede Online' : 'Sem Rede'}
                </span>
            </div>
        </header>
    )
}