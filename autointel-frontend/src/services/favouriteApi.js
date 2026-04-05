import axios from "axios";
import { getCsrf } from "./authApi";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/`,
  withCredentials: true,
});

// Attach CSRF token automatically to every mutating request
API.interceptors.request.use(async (config) => {
  const mutatingMethods = ["post", "put", "patch", "delete"];
  if (mutatingMethods.includes(config.method?.toLowerCase())) {
    try {
      const csrfToken = await getCsrf();
      if (csrfToken) {
        config.headers["X-CSRFToken"] = csrfToken;
      }
    } catch (err) {
      console.warn("Could not fetch CSRF token:", err.message);
    }
  }
  return config;
});

export const getFavourites = async () => {
  return API.get("favorites/");
};

export const getFavouriteStatus = async (carSlug) => {
  return API.get(`favorites/status/${carSlug}/`);
};

export const addFavourite = async (carSlug) => {
  return API.post("favorites/", { car_slug: carSlug });
};

export const removeFavourite = async (carSlug) => {
  return API.delete(`favorites/${carSlug}/`);
};

export default API;
