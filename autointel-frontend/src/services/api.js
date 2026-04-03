import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export default api;
// OPTIONAL (if you want helper functions)
export const getCars = () => api.get("/");
export const getCarBySlug = (slug) => api.get(`/${slug}/`);
