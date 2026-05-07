import { publicAxios, recruiterPrivateAxios } from "../helper";
// POST /recruiter/createJob

export const recruiter_create_job = async (jobData) => {
    const res = await recruiterPrivateAxios.post("/recruiter/createJob", jobData);
    return res.data;
};
 
// GET /recruiter/fetchAllJobs
export const recruiter_fetch_all_jobs = async () => {
    const res = await recruiterPrivateAxios.get("/recruiter/fetchAllJobs");
    return res.data;
};
// PUT /recruiter/deactivateJob/{jobId}
export const recruiter_deactivate_job = async (jobId) => {
    const res = await recruiterPrivateAxios.put(`/recruiter/deactivateJob/${jobId}`);
    return res.data;
};
 
// GET /recruiter/verify/{jobId}/{referralId}  → returns true | false
export const recruiter_verify_referral = async (jobId, referralId) => {
    const res = await recruiterPrivateAxios.get(`/recruiter/verify/${jobId}/${referralId}`);
    return res.data; // true or false
};