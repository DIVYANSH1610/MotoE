import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/cars",
  withCredentials: true,
});

export default api;

// OPTIONAL (if you want helper functions)
export const getCars = () => api.get("/");
export const getCarBySlug = (slug) => api.get(`/${slug}/`);