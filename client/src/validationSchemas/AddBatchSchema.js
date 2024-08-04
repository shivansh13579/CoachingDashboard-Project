import { object, string, number, date } from "yup";

export default object({
  batchName: string().required().label("Batch Name"),
  studentLimit: number().required().label("Student Limit"),
  description: string().label("Description"),
  batchFee: number().required().label("Batch Fee"),
  batchStartDate: date().required().label("Batch Start Date"),
  batchEndingDate: date().required().label("Batch Ending Date"),
  batchStartTime: string().required().label("Batch Start Time"),
  batchEndingTime: string().required().label("Batch Ending Time"),
});
