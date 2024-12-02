import { AnySchema } from "yup";
import { useToast } from "vue-toastification";

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const optionsDate: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const datePart = date
    .toLocaleDateString("tr-TR", optionsDate)
    .replace(/\./g, "/");
  const timePart = date.toLocaleTimeString("tr-TR", optionsTime);
  return `${datePart} ${timePart}`;
};

const toast = useToast();

export const validateData = async (
  data: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  schema: AnySchema
): Promise<boolean> => {
  console.log("data: ", data);

  try {
    await schema.validate(data, { abortEarly: false });
    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (validationError: any) {
    if (validationError.inner) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validationError.inner.forEach((error: any) => {
        toast.error(error.message);
      });
    } else {
      toast.error(validationError.message);
    }
    return false;
  }
};
