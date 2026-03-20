import api from './api'

// Gera ou recupera o ID único desta máquina
function getMachineId() {
    let id = localStorage.getItem('gamehub_machine_id')
    if (!id) {
        // fallback para quando crypto.randomUUID não está disponível (HTTP)
        id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0
            const v = c === 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
        localStorage.setItem('gamehub_machine_id', id)
    }
    return id
}

function getMachineName() {
    return localStorage.getItem('gamehub_machine_name') || null
}

const installService = {
    // Devolve todas as instalações desta máquina
    getAll() {
        return api.get('/installs', {
            params: { machine_id: getMachineId() }
        }).then(res => res.data)
    },

    // Regista ou actualiza uma instalação
    save(gameId, versionId, status, installPath = null) {
        return api.post('/installs', {
            game_id:      gameId,
            version_id:   versionId,
            machine_id:   getMachineId(),
            machine_name: getMachineName(),
            status,
            install_path: installPath,
        }).then(res => res.data)
    },

    // Actualiza só o status de uma instalação existente
    updateStatus(installId, status) {
        return api.patch(`/installs/${installId}/status`, { status })
            .then(res => res.data)
    },

    getMachineId,
    getMachineName,
}

export default installService