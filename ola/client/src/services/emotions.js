import api from './api'

export const getAll = async () => (await api.get('/emotionentries')).data
export const getById = async (id) => (await api.get(`/emotionentries/${id}`)).data
export const create = async (payload) => (await api.post('/emotionentries', payload)).data
export const update = async (id, payload) => (await api.put(`/emotionentries/${id}`, payload)).data
export const remove = async (id) => (await api.delete(`/emotionentries/${id}`)).data
