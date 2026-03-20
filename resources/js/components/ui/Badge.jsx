const variants = {
    action:   'bg-red-900/40 text-red-300 border border-red-800/50',
    rpg:      'bg-yellow-900/40 text-yellow-300 border border-yellow-800/50',
    strategy: 'bg-blue-900/40 text-blue-300 border border-blue-800/50',
    puzzle:   'bg-green-900/40 text-green-300 border border-green-800/50',
    racing:   'bg-orange-900/40 text-orange-300 border border-orange-800/50',
    network:  'bg-blue-900/40 text-blue-300 border border-blue-800/50',
    web:      'bg-purple-900/40 text-purple-300 border border-purple-800/50',
    default:  'bg-gray-800 text-gray-300 border border-gray-700',
}

export default function Badge({ label, type = 'default' }) {
    const style = variants[type?.toLowerCase()] ?? variants.default

    return (
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide ${style}`}>
            {label}
        </span>
    )
}