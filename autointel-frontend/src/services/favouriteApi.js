import axios from "axios";
import { getCsrf } from "./authApi";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/`,
  withCredentials: true,
});

export const getFavourites = async () => {
  return API.get("favorites/");
};

export const getFavouriteStatus = async (carSlug) => {
  return API.get(`favorites/status/${carSlug}/`);
};

export const addFavourite = async (carSlug) => {
  const csrfToken = await getCsrf();

  console.log("Favourite add csrfToken:", csrfToken);

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

  console.log("Favourite remove csrfToken:", csrfToken);

  return API.delete(`favorites/${carSlug}/`, {
    withCredentials: true,
    headers: {
      "X-CSRFToken": csrfToken,
    },
  });
};

export default API;
