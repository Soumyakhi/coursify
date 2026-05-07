import { teacherPrivateAxios } from "../helper";

export const teacher_fetch_my_courses = async () => {
  const response = await teacherPrivateAxios.get("/teacher/fetchMyCourses");
  return response.data;
};

export const teacher_add_course = async (formData) => {
  const response = await teacherPrivateAxios.post("/teacher/addCourse", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};