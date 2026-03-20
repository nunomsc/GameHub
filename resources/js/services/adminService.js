import api from './api'

const adminService = {
    // Jogos
    getGames()          { return api.get('/admin/games').then(r => r.data) },
    getGame(id)         { return api.get(`/admin/games/${id}`).then(r => r.data) },
    createGame(data)    { return api.post('/admin/games', data).then(r => r.data) },
    updateGame(id, data){ return api.put(`/admin/games/${id}`, data).then(r => r.data) },
    deleteGame(id)      { return api.delete(`/admin/games/${id}`) },

    // Lookups
    createGenre(name)      { return api.post('/admin/genres', { name }).then(r => r.data) },
    deleteGenre(id)        { return api.delete(`/admin/genres/${id}`) },
    createPlatform(name)   { return api.post('/admin/platforms', { name }).then(r => r.data) },
    deletePlatform(id)     { return api.delete(`/admin/platforms/${id}`) },
    createTag(name)        { return api.post('/admin/tags', { name }).then(r => r.data) },
    deleteTag(id)          { return api.delete(`/admin/tags/${id}`) },
}

export default adminService