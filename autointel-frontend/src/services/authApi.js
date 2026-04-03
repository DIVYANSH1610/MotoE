import axios from "axios";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
  return "";
}

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/cars/auth/",
  withCredentials: true,
});

export const getCsrf = () => API.get("csrf/");

export const registerUser = async (data) => {
  await getCsrf();
  return API.post("register/", data, {
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
  });
};

export const loginUser = async (data) => {
  await getCsrf();
  return API.post("login/", data, {
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
    },
  });
};

export const logoutUser = async () => {
  await getCsrf();
  return API.post(
    "logout/",
    {},
    {
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
    }
  );
};

export const getSession = () => API.get("session/");
export const getDashboard = () => API.get("dashboard/");

export default API;