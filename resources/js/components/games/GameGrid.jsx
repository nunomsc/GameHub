import GameCard from './GameCard'

export default function GameGrid({ games, installs, onSelect, selectedSlug }) {
    if (games.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
                Nenhum jogo encontrado.
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {games.map(game => (
                <GameCard
                    key={game.id}
                    game={game}
                    install={installs[game.id]}
                    onSelect={onSelect}
                    selected={selectedSlug === game.slug}
                />
            ))}
        </div>
    )
}