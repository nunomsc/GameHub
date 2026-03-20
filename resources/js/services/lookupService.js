import api from './api'

const lookupService = {
    getGenres() {
        return api.get('/genres').then(res => res.data)
    },

    getPlatforms() {
        return api.get('/platforms').then(res => res.data)
    },

    getTags() {
        return api.get('/tags').then(res => res.data)
    },

    // Carrega tudo de uma vez — útil no arranque da app
    getAll() {
        return Promise.all([
            lookupService.getGenres(),
            lookupService.getPlatforms(),
            lookupService.getTags(),
        ]).then(([genres, platforms, tags]) => ({
            genres,
            platforms,
            tags,
        }))
    },
}

export default lookupService