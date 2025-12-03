import api from "./api";

export const addProgress = async (data) => (await api.post("/progress", data)).data;
