import axios from "axios";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(";").shift());
  }
  return "";
}

const AUTH_API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/auth/`,
  withCredentials: true,
});

export const getCsrf = async () => {
  return AUTH_API.get("csrf/", {
    withCredentials: true,
  });
};

export const loginUser = async (data) => {
  await getCsrf();
  const csrfToken = getCookie("csrftoken");

  return AUTH_API.post("login/", data, {
    withCredentials: true,
    headers: {
      "X-CSRFToken": csrfToken,
    },
  });
};

export const registerUser = async (data) => {
  await getCsrf();
  const csrfToken = getCookie("csrftoken");

  return AUTH_API.post("register/", data, {
    withCredentials: true,
    headers: {
      "X-CSRFToken": csrfToken,
    },
  });
};

export const logoutUser = async () => {
  await getCsrf();
  const csrfToken = getCookie("csrftoken");

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
