import { privateAxios, publicAxios } from "../helper";
export const search_courses = (query, page = 1) => {
  return publicAxios.get(`/search/${query}/${page}`).then((response) => response.data);
};
export const get_recommended_courses = () => {
  return privateAxios.get(`/student/recommend`).then((response) => response.data);
};
export const not_interested_course = (courseId) => {
  return privateAxios.put(`/student/notInterested/${courseId}`).then((response) => response.data);
};
export const enroll_course = (courseId) => {
  return privateAxios.put(`/student/enrollCourse/${courseId}`).then((response) => response.data);
};
export const rate_course = (courseId, rating) => {
  return privateAxios.put(`/student/rateCourse/${courseId}/${rating}`).then((response) => response.data);
};
export const start_exam = (courseId) => {
  return privateAxios.put(`/student/startExam/${courseId}`).then((response) => response.data);
};
export const submit_exam = (payload) => {
  return privateAxios.put(`/student/submitExam`, payload).then((response) => response.data);
};
export const fetch_course_student = (courseId) => {
  return privateAxios.get(`/student/fetchCourseStd/${courseId}`).then((response) => response.data);
};
export const fetch_my_courses = async () => {
  const response = await privateAxios.get("/student/fetchMyCourses");
  return response.data; 
};


