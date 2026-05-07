import { useState, useEffect } from "react";
import { getRecruiterData } from "../localstorage";
import {
  FiBriefcase,
  FiPlusCircle,
  FiX,
  FiLink,
  FiUsers,
  FiPower,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiTag,
  FiAward,
  FiClock,
  FiPlus,
} from "react-icons/fi";
import Swal from "sweetalert2";
import {
  recruiter_create_job,
  recruiter_fetch_all_jobs,
  recruiter_deactivate_job,
  recruiter_verify_referral,
} from "../service/recruiter/jobs";

const emptyJob = {
  position: "",
  description: "",
  link: "",
  totalRecommendations: "",
  skills: [],
  qualification: "",
  experience: "",
};

// ── Skill Tag Input ──────────────────────────────────────────────────────────
const SkillTagInput = ({ skills = [], onChange }) => {
  const [input, setInput] = useState("");

  const addSkill = () => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
    }
    setInput("");
  };

  const removeSkill = (skill) => onChange(skills.filter((s) => s !== skill));

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    } else if (e.key === "Backspace" && !input && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  };

  return (
    <div className="w-full border border-slate-300 rounded-lg focus-within:ring-2 focus-within:ring-[#0A66C2] bg-white p-2 flex flex-wrap gap-2 min-h-[44px]">
      {skills.map((skill) => (
        <span
          key={skill}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-[#0A66C2] text-xs font-semibold rounded-md border border-blue-200"
        >
          {skill}
          <button
            type="button"
            onClick={() => removeSkill(skill)}
            className="hover:text-red-500 transition ml-0.5"
          >
            <FiX size={10} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addSkill}
        placeholder={skills.length === 0 ? "Type a skill and press Enter…" : "Add more…"}
        className="flex-1 min-w-[140px] outline-none text-sm text-slate-700 placeholder-slate-400 bg-transparent"
      />
    </div>
  );
};

// ── Main Dashboard ───────────────────────────────────────────────────────────
const RecruiterDashboard = () => {
  const recruiterData = getRecruiterData();

  const [showJobsModal, setShowJobsModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const [jobForm, setJobForm] = useState(emptyJob);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (showJobsModal) loadJobs();
  }, [showJobsModal]);

  const loadJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await recruiter_fetch_all_jobs();
      setJobs(res || []);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await recruiter_create_job({
        position: jobForm.position,
        description: jobForm.description,
        link: jobForm.link,
        totalRecommendations: Number(jobForm.totalRecommendations),
        skills: jobForm.skills,
        qualification: jobForm.qualification,
        experience: jobForm.experience,
      });
      Swal.fire({
        icon: "success",
        title: "Job Posted!",
        text: "Your job listing has been published successfully.",
        confirmButtonColor: "#0A66C2",
      });
      setJobForm(emptyJob);
      setShowPostModal(false);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Post Failed",
        text: err?.response?.data?.message || "Failed to post job. Please try again.",
        confirmButtonColor: "#0A66C2",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeJobs = jobs.filter((j) => j.active);
  const inactiveJobs = jobs.filter((j) => !j.active);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-semibold text-slate-900 mb-1">
        Hello, {recruiterData?.name || "Recruiter"}
      </h1>
      <p className="text-slate-500 mb-8 text-sm flex items-center gap-1">
        <FiBriefcase size={13} />
        {recruiterData?.companyName || "Company Dashboard"}
      </p>

      {/* ── ACTION CARDS ── */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div
          onClick={() => setShowPostModal(true)}
          className="group rounded-3xl border border-slate-200 bg-white p-8 cursor-pointer hover:border-[#0A66C2] hover:shadow-lg transition-all duration-300"
        >
          <div className="w-14 h-14 bg-blue-50 text-[#0A66C2] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <FiPlusCircle size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Post a Job</h2>
          <p className="text-slate-500">Create a new job listing and start receiving applications from students.</p>
        </div>

        <div
          onClick={() => setShowJobsModal(true)}
          className="group rounded-3xl border border-slate-200 bg-white p-8 cursor-pointer hover:border-[#0A66C2] hover:shadow-lg transition-all duration-300"
        >
          <div className="w-14 h-14 bg-blue-50 text-[#0A66C2] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <FiBriefcase size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">View My Jobs</h2>
          <p className="text-slate-500">Browse all your published job listings split by active and inactive status.</p>
        </div>
      </div>

      {/* ── VIEW JOBS MODAL ── */}
      {showJobsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">My Job Listings</h2>
                {!loadingJobs && jobs.length > 0 && (
                  <p className="text-sm text-slate-400 mt-0.5">
                    {activeJobs.length} active · {inactiveJobs.length} inactive
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowJobsModal(false)}
                className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-red-50 hover:text-red-500 transition"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto bg-slate-50 flex-1 space-y-8">
              {loadingJobs ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A66C2]" />
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-16">
                  <FiBriefcase size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-700">No jobs posted yet</h3>
                  <p className="text-slate-500 mt-2">Create your first listing to start finding talent.</p>
                </div>
              ) : (
                <>
                  {activeJobs.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                          Active — {activeJobs.length}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeJobs.map((job) => (
                          <ActiveJobCard key={job.id} job={job} onRefresh={loadJobs} />
                        ))}
                      </div>
                    </div>
                  )}

                  {inactiveJobs.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                          Inactive — {inactiveJobs.length}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {inactiveJobs.map((job) => (
                          <InactiveJobCard key={job.id} job={job} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── POST JOB MODAL ── */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <FiBriefcase className="text-[#0A66C2]" /> Post a New Job
              </h2>
              <button
                onClick={() => setShowPostModal(false)}
                className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-red-50 hover:text-red-500 transition"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 bg-slate-50 p-8">
              <form id="post-job-form" onSubmit={handlePostJob} className="space-y-4">

                {/* ── Section: Basic Info ── */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Basic Info</p>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
                    <input
                      type="text" required value={jobForm.position}
                      onChange={(e) => setJobForm({ ...jobForm, position: e.target.value })}
                      placeholder="e.g. Software Engineer Intern"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2] outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea
                      required rows={4} value={jobForm.description}
                      onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                      placeholder="Describe the role and responsibilities..."
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2] outline-none resize-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Job Link</label>
                    <div className="relative">
                      <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                      <input
                        type="text" required value={jobForm.link}
                        onChange={(e) => setJobForm({ ...jobForm, link: e.target.value })}
                        placeholder="e.g. careers.example.com/apply"
                        className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2] outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Total Recommendations</label>
                    <div className="relative">
                      <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                      <input
                        type="number" required min={0} value={jobForm.totalRecommendations}
                        onChange={(e) => setJobForm({ ...jobForm, totalRecommendations: e.target.value })}
                        placeholder="e.g. 50"
                        className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2] outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Section: Requirements ── */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Requirements</p>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      <span className="flex items-center gap-1.5"><FiAward size={13} /> Qualification</span>
                    </label>
                    <input
                      type="text" value={jobForm.qualification}
                      onChange={(e) => setJobForm({ ...jobForm, qualification: e.target.value })}
                      placeholder="e.g. B.Tech / B.E. in Computer Science"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2] outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      <span className="flex items-center gap-1.5"><FiClock size={13} /> Experience</span>
                    </label>
                    <input
                      type="text" value={jobForm.experience}
                      onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                      placeholder="e.g. 0–1 years / Fresher"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2] outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      <span className="flex items-center gap-1.5"><FiTag size={13} /> Skills</span>
                    </label>
                    <SkillTagInput
                      skills={jobForm.skills}
                      onChange={(skills) => setJobForm({ ...jobForm, skills })}
                    />
                    <p className="text-xs text-slate-400 mt-1.5">Press Enter or comma to add a skill tag.</p>
                  </div>
                </div>

              </form>
            </div>

            <div className="px-8 py-5 border-t border-slate-100 bg-white flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPostModal(false)}
                className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition text-sm"
              >
                Cancel
              </button>
              <button
                form="post-job-form"
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-lg bg-[#0A66C2] text-white font-medium hover:bg-[#084e8a] transition disabled:opacity-70 text-sm"
              >
                {isSubmitting ? "Posting..." : "Post Job"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Shared metadata row ──────────────────────────────────────────────────────
const MetaRow = ({ icon: Icon, label, value }) =>
  value ? (
    <div className="flex items-start gap-2 text-xs text-slate-500">
      <Icon size={12} className="mt-0.5 shrink-0 text-slate-400" />
      <div>
        <span className="font-semibold text-slate-600">{label}: </span>
        {value}
      </div>
    </div>
  ) : null;

// ── Active Job Card ──────────────────────────────────────────────────────────
const ActiveJobCard = ({ job, onRefresh }) => {
  const [deactivating, setDeactivating] = useState(false);
  const [referralId, setReferralId] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const handleDeactivate = async () => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Deactivate Job?",
      text: `"${job.position}" will no longer be visible to students.`,
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#64748b",
    });
    if (!confirm.isConfirmed) return;

    setDeactivating(true);
    try {
      await recruiter_deactivate_job(job.id);
      await onRefresh();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err?.response?.data?.message || "Could not deactivate job.",
        confirmButtonColor: "#0A66C2",
      });
    } finally {
      setDeactivating(false);
    }
  };

  const handleVerify = async () => {
    if (!referralId.trim()) return;
    setVerifying(true);
    setVerifyResult(null);
    try {
      const result = await recruiter_verify_referral(job.id, referralId.trim());
      setVerifyResult(result);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: err?.response?.data?.message || "Could not verify referral ID.",
        confirmButtonColor: "#0A66C2",
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0A66C2] to-blue-800 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-white line-clamp-2 leading-snug flex-1">{job.position}</h3>
          <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 mt-0.5">
            Active
          </span>
        </div>
        {job.companyName && (
          <p className="text-blue-200 text-xs mt-1 font-medium">{job.companyName}</p>
        )}
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Description */}
        <p className="text-sm text-slate-500 line-clamp-2">{job.description}</p>

        {/* Meta info */}
        <div className="space-y-1.5 py-2 border-y border-slate-100">
          <MetaRow icon={FiAward} label="Qualification" value={job.qualification} />
          <MetaRow icon={FiClock} label="Experience" value={job.experience} />
        </div>

        {/* Skills */}
        {job.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {job.skills.slice(0, expanded ? undefined : 4).map((skill) => (
              <span
                key={skill}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-[#0A66C2] border border-blue-100"
              >
                {skill}
              </span>
            ))}
            {!expanded && job.skills.length > 4 && (
              <button
                onClick={() => setExpanded(true)}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
              >
                +{job.skills.length - 4} more
              </button>
            )}
          </div>
        )}

        {/* Link */}
        {job.link && (
          <a
            href={job.link.startsWith("http") ? job.link : `https://${job.link}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[#0A66C2] hover:underline font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            <FiLink size={11} />
            <span className="truncate max-w-[180px]">{job.link}</span>
          </a>
        )}

        {/* ── Verify Referral ── */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verify Referral ID</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={referralId}
              onChange={(e) => { setReferralId(e.target.value); setVerifyResult(null); }}
              placeholder="Enter referral ID"
              className="flex-1 min-w-0 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2] outline-none"
            />
            <button
              onClick={handleVerify}
              disabled={verifying || !referralId.trim()}
              className="px-3 py-1.5 bg-[#0A66C2] text-white text-xs font-semibold rounded-lg hover:bg-[#084e8a] disabled:opacity-50 transition flex items-center gap-1"
            >
              {verifying
                ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <FiSearch size={12} />
              }
              {verifying ? "" : "Check"}
            </button>
          </div>

          {verifyResult !== null && (
            <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg w-fit ${verifyResult ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}>
              {verifyResult
                ? <><FiCheckCircle size={13} /> Valid referral</>
                : <><FiXCircle size={13} /> Invalid referral</>
              }
            </div>
          )}
        </div>

        {/* ── Deactivate ── */}
        <button
          onClick={handleDeactivate}
          disabled={deactivating}
          className="mt-auto w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-rose-200 text-rose-600 text-xs font-semibold hover:bg-rose-50 disabled:opacity-50 transition"
        >
          {deactivating
            ? <div className="w-3 h-3 border-2 border-rose-300 border-t-rose-600 rounded-full animate-spin" />
            : <FiPower size={13} />
          }
          {deactivating ? "Deactivating..." : "Deactivate Job"}
        </button>
      </div>
    </div>
  );
};

// ── Inactive Job Card ────────────────────────────────────────────────────────
const InactiveJobCard = ({ job }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm opacity-60">
      <div className="bg-gradient-to-br from-slate-500 to-slate-700 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-bold text-white line-clamp-2 leading-snug flex-1">{job.position}</h3>
          <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/20 mt-0.5">
            Inactive
          </span>
        </div>
        {job.companyName && (
          <p className="text-slate-300 text-xs mt-1 font-medium">{job.companyName}</p>
        )}
      </div>

      <div className="p-4 space-y-3">
        <p className="text-sm text-slate-500 line-clamp-2">{job.description}</p>

        <div className="space-y-1.5 py-2 border-y border-slate-100">
          <MetaRow icon={FiAward} label="Qualification" value={job.qualification} />
          <MetaRow icon={FiClock} label="Experience" value={job.experience} />
        </div>

        {job.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {job.skills.slice(0, expanded ? undefined : 4).map((skill) => (
              <span
                key={skill}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200"
              >
                {skill}
              </span>
            ))}
            {!expanded && job.skills.length > 4 && (
              <button
                onClick={() => setExpanded(true)}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
              >
                +{job.skills.length - 4} more
              </button>
            )}
          </div>
        )}

        {job.link && (
          <a
            href={job.link.startsWith("http") ? job.link : `https://${job.link}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <FiLink size={11} />
            <span className="truncate max-w-[180px]">{job.link}</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;