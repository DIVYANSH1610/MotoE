import axios from "axios";

const AUTH_API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/auth/`,
  withCredentials: true,
});

export const getCsrf = async () => {
  const response = await AUTH_API.get("csrf/", {
    withCredentials: true,
  });

  return response.data.csrfToken;
};

export const loginUser = async (data) => {
  const csrfToken = await getCsrf();

  return AUTH_API.post("login/", data, {
    withCredentials: true,
    headers: {
      "X-CSRFToken": csrfToken,
    },
  });
};

export const registerUser = async (data) => {
  const csrfToken = await getCsrf();

  return AUTH_API.post("register/", data, {
    withCredentials: true,
    headers: {
      "X-CSRFToken": csrfToken,
    },
  });
};

export const logoutUser = async () => {
  const csrfToken = await getCsrf();

  return AUTH_API.post(
    "logout/",
    {},
    {
      withCredentials: true,
      headers: {
        "X-CSRFToken": csrfToken,
      },
    }
  );
};

export const getSession = () =>
  AUTH_API.get("session/", { withCredentials: true });

export const getDashboard = () =>
  AUTH_API.get("dashboard/", { withCredentials: true });

export default AUTH_API;
