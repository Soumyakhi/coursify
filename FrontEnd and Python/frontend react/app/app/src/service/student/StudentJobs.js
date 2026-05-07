import { privateAxios } from "../helper";

export const student_fetch_my_jobs = async () => {
  const response = await privateAxios.get("/student/myRecommendedJobs");
  console.log("Received jobs data:", response.data); 
  return response.data;
};