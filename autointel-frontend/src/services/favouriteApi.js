import axios from "axios";
import { getCsrf } from "./authApi";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
  return "";
}

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export const getFavourites = () => API.get("favorites/");

export const getFavouriteStatus = (carSlug) =>
  API.get(`favorites/status/${carSlug}/`);

export const addFavourite = async (carSlug) => {
  await getCsrf();
  return API.post(
    "favorites/",
    { car_slug: carSlug },
    {
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
    }
  );
};

export const removeFavourite = async (carSlug) => {
  await getCsrf();
  return API.delete(`favorites/${carSlug}/`, {
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
  });
};

export default API;
