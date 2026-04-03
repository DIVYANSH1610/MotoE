import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const authApi = axios.create({
  baseURL: `${BASE_URL}/auth`,
  withCredentials: true,
});

export const getCsrf = () => authApi.get("/csrf/");

export const loginUser = async (data) => {
  await getCsrf();
  return authApi.post("/login/", data);
};

export const registerUser = async (data) => {
  await getCsrf();
  return authApi.post("/register/", data);
};

export const logoutUser = async () => {
  await getCsrf();
  return authApi.post("/logout/");
};

export const getSession = () => authApi.get("/session/");
export const getDashboard = () => authApi.get("/dashboard/");
