import axios from "axios";
import { auth } from "../firebase/index";
import { useToast } from "vue-toastification";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const token = await currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const toast = useToast();

api.interceptors.response.use(
  (response) => {
    const method = response.config.method;
    const message = response.data?.message;

    if (message) {
      if (method === "post") {
        toast.success(message);
      } else if (method === "delete") {
        toast.success(message);
      }
    }

    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message =
        error.response.data?.message || "An unexpected error occurred.";

      if (status === 400) {
        toast.error(`Bad Request: ${message}`);
      } else if (status === 401) {
        toast.error("Unauthorized: Please log in again.");
      } else if (status === 403) {
        toast.error("Forbidden: You don't have permission to access this.");
      } else if (status === 404) {
        toast.error("Not Found: The requested resource was not found.");
      } else if (status === 500) {
        toast.error("Server Error: Please try again later.");
      } else {
        toast.error(message);
      }
    } else {
      toast.error("Network Error: Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export default api;
