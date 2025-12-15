import api from './api'

export const getAll = async () => (await api.get('/habits')).data
export const getById = async (id) => (await api.get(`/habits/${id}`)).data
export const create = async (payload) => (await api.post('/habits', payload)).data
export const update = async (id, payload) => (await api.put(`/habits/${id}`, payload)).data
export const remove = async (id) => (await api.delete(`/habits/${id}`)).data
export const getProgress = async (id) => (await api.get(`/habits/${id}/progress`)).data
export const getStreak = async (id) => (await api.get(`/habits/${id}/streak`)).data
export const addProgress = async (payload) => (await api.post('/progress', payload)).data

// legacy aliases for earlier pages
export const listHabits = getAll
export const createHabit = create
