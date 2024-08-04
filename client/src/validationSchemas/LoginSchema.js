import { object, string } from "yup";

export const loginSchema = object({
  email: string().email().required().label("Email"),
  password: string().required().label("Password"),
});
