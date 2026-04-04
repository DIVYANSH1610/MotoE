import axios from "axios";
import { getCsrf } from "./authApi";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const BACKEND_ORIGIN = API_BASE.replace("/api/cars", "");

// AI Garage Assistant
export const askGarageAI = async (payload) => {
  const csrfToken = await getCsrf();

  return axios.post(
    `${BACKEND_ORIGIN}/api/ai/garage/`,
    payload,
    {
      withCredentials: true,
      headers: {
        "X-CSRFToken": csrfToken,
      },
    }
  );
};

// Used Car Advisor
export const getUsedCarAdvice = async (payload) => {
  const csrfToken = await getCsrf();

  return axios.post(
    `${BACKEND_ORIGIN}/api/ai/used-car-advisor/`,
    payload,
    {
      withCredentials: true,
      headers: {
        "X-CSRFToken": csrfToken,
      },
    }
  );
};
