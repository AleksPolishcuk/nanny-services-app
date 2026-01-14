import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(2, "Min 2 characters"),
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Please enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const appointmentSchema = yup.object({
  parentName: yup.string().required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
  phone: yup.string().required("Required"),
  address: yup.string().required("Required"),
  childAge: yup.string().required("Required"),
  time: yup.string().required("Required"),
  comment: yup.string().required("Required"),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;
export type RegisterFormValues = yup.InferType<typeof registerSchema>;
export type AppointmentFormValues = yup.InferType<typeof appointmentSchema>;
