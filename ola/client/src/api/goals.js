import api from '../services/api'

export const getAll = async ()=> (await api.get('/goals')).data
export const getById = async (id)=> (await api.get(`/goals/${id}`)).data
export const create = async (payload)=> (await api.post('/goals', payload)).data
export const update = async (id, payload)=> (await api.put(`/goals/${id}`, payload)).data
export const remove = async (id)=> (await api.delete(`/goals/${id}`)).data
export const updateProgress = async (id, progress)=> (await api.patch(`/goals/${id}/progress`, { goalId: id, progress })).data
export const updateStatus = async (id, status)=> (await api.patch(`/goals/${id}/status`, { goalId: id, status })).data
