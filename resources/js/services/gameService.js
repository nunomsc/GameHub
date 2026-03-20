import api from './api'

const gameService = {
    // Lista todos os jogos com filtros opcionais
    // ex: getAll({ source: 'network', genre: 'rpg', search: 'dragon' })
    getAll(params = {}) {
        return api.get('/games', { params })
            .then(res => res.data)
    },

    // Devolve um jogo pelo slug com todos os detalhes
    getBySlug(slug) {
        return api.get(`/games/${slug}`)
            .then(res => res.data)
    },
}

export default gameService