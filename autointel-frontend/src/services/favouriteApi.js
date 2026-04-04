import axios from "axios";
import { getCsrf } from "./authApi";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/`,
  withCredentials: true,
});

function getCookie(name) {
  const cookies = document.cookie ? document.cookie.split("; ") : [];

  for (let i = 0; i < cookies.length; i++) {
    const parts = cookies[i].split("=");
    const cookieName = parts.shift();
    const cookieValue = parts.join("=");

    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }

  return "";
}

async function getCsrfTokenOrThrow() {
  await getCsrf();

  const csrfToken = getCookie("csrftoken");

  console.log("document.cookie =>", document.cookie);
  console.log("csrftoken =>", csrfToken);

  if (!csrfToken || csrfToken.length < 20) {
    throw new Error("Invalid CSRF token. Cookie not set properly.");
  }

  return csrfToken;
}

export const getFavourites = () => API.get("favorites/");

export const getFavouriteStatus = (carSlug) =>
  API.get(`favorites/status/${carSlug}/`);

export const addFavourite = async (carSlug) => {
  const csrfToken = await getCsrfTokenOrThrow();

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
  const csrfToken = await getCsrfTokenOrThrow();

  return API.delete(`favorites/${carSlug}/`, {
    withCredentials: true,
    headers: {
      "X-CSRFToken": csrfToken,
    },
  });
};

export default API;
