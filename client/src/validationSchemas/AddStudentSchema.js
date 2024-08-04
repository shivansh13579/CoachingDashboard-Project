import { object, string, number } from "yup";

export default object({
  firstName: string().required().label("First Name"),
  lastName: string().required().label("Last Name"),
  fatherName: string().label("Father Name"),
  mobile: number().required().label("Mobile"),
  parentMobile: number().required().label("Parent Mobile"),
  batch: string().required().label("Batch"),
});
