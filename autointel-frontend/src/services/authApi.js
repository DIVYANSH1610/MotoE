import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const authApi = axios.create({
  baseURL: `${BASE_URL}/auth`,
  withCredentials: true,
});

export const getCsrf = async () => {
  const res = await authApi.get("/csrf/");
  return res.data.csrfToken;
};

export const loginUser = async (data) => {
  const csrfToken = await getCsrf();
  return authApi.post("/login/", data, {
    headers: {
      "X-CSRFToken": csrfToken,
    },
  });
};

export const registerUser = async (data) => {
  const csrfToken = await getCsrf();
  return authApi.post("/register/", data, {
    headers: {
      "X-CSRFToken": csrfToken,
    },
  });
};

export const logoutUser = async () => {
  const csrfToken = await getCsrf();
  return authApi.post(
    "/logout/",
    {},
    {
      headers: {
        "X-CSRFToken": csrfToken,
      },
    }
  );
};

export const getSession = () => authApi.get("/session/");
export const getDashboard = () => authApi.get("/dashboard/");
