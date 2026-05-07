// ==========================================
// STUDENT FUNCTIONS (Reserved for user_data)
// ==========================================
export const login = (user_data) => {
  localStorage.setItem("user_data", JSON.stringify(user_data))
}

export const logout = () => {
  localStorage.removeItem("user_data")
}

export const isLoggedIn = () => {
  return !!localStorage.getItem("user_data")
}

export const getUserData = (option) => {
  const user_data = JSON.parse(localStorage.getItem("user_data"));
  if (option === "token") return user_data?.token;
  return user_data;
}

export const updateUserData = (newData) => {
  const user_data = JSON.parse(localStorage.getItem("user_data"));
  const updated_data = { ...user_data, ...newData };
  localStorage.setItem("user_data", JSON.stringify(updated_data));
}

export const loginTeacher = (teacher_data) => {
  localStorage.setItem("teacher_data", JSON.stringify(teacher_data));
};

export const logoutTeacher = () => {
  localStorage.removeItem("teacher_data");
};

export const isTeacherLoggedIn = () => {
  return !!localStorage.getItem("teacher_data");
};

export const getTeacherData = (option) => {
  const teacher_data = JSON.parse(localStorage.getItem("teacher_data"));
  if (option === "token") return teacher_data?.token;
  return teacher_data;
};
export const loginRecruiter = (recruiter_data) => {
  localStorage.setItem("recruiter_data", JSON.stringify(recruiter_data));
};
 
export const logoutRecruiter = () => {
  localStorage.removeItem("recruiter_data");
};
 
export const isRecruiterLoggedIn = () => {
  return !!localStorage.getItem("recruiter_data");
};
 
export const getRecruiterData = (option) => {
  const recruiter_data = JSON.parse(localStorage.getItem("recruiter_data"));
  if (option === "token") return recruiter_data?.token;
  return recruiter_data;
};

 