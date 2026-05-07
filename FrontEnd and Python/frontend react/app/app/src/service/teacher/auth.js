import { publicAxios } from "../helper";

export const teacher_login = (data) => {
  return publicAxios.post("/loginTeacher", data).then((response) => response.data);
};

export const teacher_signup = (data) => {
  return publicAxios.post("/signUpTeacher", data).then((response) => response.data);
};