import * as Yup from "yup";

export const addParameterSchema = Yup.object().shape({
  key: Yup.string()
    .trim()
    .required("Parameter Key is required.")
    .max(50, "Parameter Key cannot exceed 50 characters."),
  value: Yup.string()
    .trim()
    .required("Value is required.")
    .max(255, "Value cannot exceed 255 characters."),
  description: Yup.string()
    .trim()
    .required("Description is required.")
    .max(255, "Description cannot exceed 255 characters."),
});

export const editParameterSchema = Yup.object().shape({
  key: Yup.string()
    .trim()
    .required("Parameter Key is required.")
    .max(50, "Parameter Key cannot exceed 50 characters."),
  value: Yup.string()
    .trim()
    .required("Value is required.")
    .max(255, "Value cannot exceed 255 characters."),
  description: Yup.string()
    .trim()
    .required("Description is required.")
    .max(255, "Description cannot exceed 255 characters."),
  countrySpecificInformation: Yup.array()
    .of(
      Yup.object().shape({
        countryName: Yup.string()
          .trim()
          .required("Country Name is required.")
          .max(5, "Country Name cannot exceed 5 characters."),
        value: Yup.string()
          .trim()
          .required("Value is required.")
          .max(255, "Value cannot exceed 255 characters."),
      })
    )
    .optional(),
});
