import { publicAxios,privateAxios } from "../helper";

export const student_signup = (data) => {
    return publicAxios.post(`/signUpStd`,data).then(response=>response.data);
}

export const student_signup_with_resume = (formData) => {
  return publicAxios.post("/signUpStdPdf", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then(response=>response.data);
};

export const student_login = (data) => {
    return publicAxios.post(`/loginStd`,data).then(response=>response.data);
}

export const edit_student_data = (data) => {
    return privateAxios.put(`/student/editStd`,data).then(response=>response.data);
}