import axios from "axios";
import { getCsrf } from "./authApi";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/`,
  withCredentials: true,
});

export const getFavourites = () => API.get("favorites/");

export const getFavouriteStatus = (carSlug) =>
  API.get(`favorites/status/${carSlug}/`);

export const addFavourite = async (carSlug) => {
  const csrfToken = await getCsrf();

  console.log("Favourite csrfToken:", csrfToken);

  if (!csrfToken) {
    throw new Error("CSRF token missing.");
  }

  return API.post(
    "favorites/",
    { car_slug: carSlug },
    {
      withCredentials: true,
      headers: {
        "X-CSRFToken": csrfToken,
      },
    }
  );
};

export const removeFavourite = async (carSlug) => {
  const csrfToken = await getCsrf();

  console.log("Favourite csrfToken:", csrfToken);

  if (!csrfToken) {
    throw new Error("CSRF token missing.");
  }

  return API.delete(`favorites/${carSlug}/`, {
    withCredentials: true,
    headers: {
      "X-CSRFToken": csrfToken,
    },
  });
};

export default API;
