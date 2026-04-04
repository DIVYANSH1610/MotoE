import axios from "axios";
import { getCsrf } from "./authApi";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(";").shift());
  }
  return "";
}

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/`,
  withCredentials: true,
});

export const getFavourites = () => API.get("favorites/");

export const getFavouriteStatus = (carSlug) =>
  API.get(`favorites/status/${carSlug}/`);

export const addFavourite = async (carSlug) => {
  await getCsrf();
  const csrfToken = getCookie("csrftoken");

  if (!csrfToken) {
    throw new Error("CSRF token missing. Cookie not set properly.");
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
  await getCsrf();
  const csrfToken = getCookie("csrftoken");

  if (!csrfToken) {
    throw new Error("CSRF token missing. Cookie not set properly.");
  }

  return API.delete(`favorites/${carSlug}/`, {
    withCredentials: true,
    headers: {
      "X-CSRFToken": csrfToken,
    },
  });
};

export default API;
