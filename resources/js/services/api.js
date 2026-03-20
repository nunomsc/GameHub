import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept':        'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
})

// Injecta o CSRF token do Laravel em todos os pedidos
api.interceptors.request.use(config => {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
    if (token) {
        config.headers['X-CSRF-TOKEN'] = token
    }
    return config
})

// Tratamento global de erros
api.interceptors.response.use(
    response => response,
    error => {
        console.error('API error:', error.response?.status, error.response?.data)
        return Promise.reject(error)
    }
)

export default api