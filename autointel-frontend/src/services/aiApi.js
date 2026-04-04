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

const BACKEND_ORIGIN = import.meta.env.VITE_API_BASE_URL.replace("/api/cars", "");

const AI_API = axios.create({
  baseURL: `${BACKEND_ORIGIN}/api/ai/`,
  withCredentials: true,
});

export const askGarageAI = async (payload) => {
  await getCsrf();
  return AI_API.post("garage/", payload, {
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
  });
};

export const getUsedCarAdvice = async (payload) => {
  await getCsrf();
  return AI_API.post("used-car-advisor/", payload, {
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
  });
};
