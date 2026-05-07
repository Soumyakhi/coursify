import { publicAxios, recruiterPrivateAxios } from "../helper";

// POST /loginRecruiter
export const recruiter_login = async (email, password) => {
    const res = await publicAxios.post("/loginRecruiter", { email, password });
    return res.data;
};

// POST /signUpRecruiter
export const recruiter_signup = async (name, email, password, companyName) => {
    const res = await publicAxios.post("/signUpRecruiter", { name, email, password, companyName });
    return res.data;
};
