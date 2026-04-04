import axios from "axios";
import { getCsrf } from "./authApi";

const BACKEND_ROOT =
  import.meta.env.VITE_BACKEND_ROOT || "https://motoe.onrender.com";

const AI_API = axios.create({
  baseURL: `${BACKEND_ROOT}/api/ai/`,
  withCredentials: true,
});

export const askGarageAI = async (payload) => {
  const csrfToken = await getCsrf();

  return AI_API.post("garage/", payload, {
    withCredentials: true,
    headers: {
      "X-CSRFToken": csrfToken,
    },
  });
};

export const askUsedCarAdvisor = async (payload) => {
  const csrfToken = await getCsrf();

  return AI_API.post("used-car-advisor/", payload, {
    withCredentials: true,
    headers: {
      "X-CSRFToken": csrfToken,
    },
  });
};

export const getUsedCarAdvice = askUsedCarAdvisor;

export default AI_API;
