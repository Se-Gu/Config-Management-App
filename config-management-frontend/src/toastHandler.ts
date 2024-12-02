import { useToast } from "vue-toastification";

const toast = useToast();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleResponseError = (error: any): void => {
  let message = "An unexpected error occurred.";

  if (error.response && error.response.data) {
    message = error.response.data.message || message;
  } else if (error.message) {
    message = error.message;
  }

  toast.error(message, {
    timeout: 5000,
  });
};
