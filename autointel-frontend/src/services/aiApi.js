import axios from "axios";
import { getCsrf } from "./authApi";

const AI_API = axios.create({
  baseURL: "https://motoe.onrender.com/api/ai/",
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

export default AI_API;
