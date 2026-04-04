import axios from "axios";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
  return "";
}

const AUTH_API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/auth/`,
  withCredentials: true,
});

export const getCsrf = async () => {
  return AUTH_API.get("csrf/");
};

export const loginUser = async (data) => {
  await getCsrf();
  return AUTH_API.post("login/", data, {
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
  });
};

export const registerUser = async (data) => {
  await getCsrf();
  return AUTH_API.post("register/", data, {
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
  });
};

export const logoutUser = async () => {
  await getCsrf();
  return AUTH_API.post(
    "logout/",
    {},
    {
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
    }
  );
};

export const getSession = () => AUTH_API.get("session/");
export const getDashboard = () => AUTH_API.get("dashboard/");

export default AUTH_API;
