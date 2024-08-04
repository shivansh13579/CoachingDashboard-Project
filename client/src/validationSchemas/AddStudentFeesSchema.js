import { object, string, number } from "yup";

export default object({
  amount: number().required().label("Payment Amount"),
  student: string().required().label("Student"),
  batch: string().required().label("Batch"),
});
