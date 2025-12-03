import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    } else if (status >= 500) {
      console.error("Server error", err?.response?.data);
      err.userMessage = "Server error. Please try again.";
    } else if (status === 409) {
      err.userMessage = "Conflict: data constraints violated.";
    }
    return Promise.reject(err);
  }
);

export async function validateCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return;
  try {
    await api.get("/users/me");
  } catch {
    localStorage.removeItem("token");
  }
}

export default api;
