import { useState, useEffect, useRef } from "react";
import { student_fetch_my_jobs } from "../../service/student/StudentJobs";
import {
  FiBriefcase,
  FiExternalLink,
  FiUser,
  FiCopy,
  FiCheck,
  FiAward,
  FiClock,
} from "react-icons/fi";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === true) return;

    const fetchJobs = async () => {
      try {
        const data = await student_fetch_my_jobs();
        setJobs(data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("Failed to load recommended jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();

    return () => {
      effectRan.current = true;
    };
  }, []);

  const handleCopyRef = (job) => {
    navigator.clipboard.writeText(job.recommendationKey);
    setCopiedId(job.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 text-sm">
        Loading recommended jobs...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-64 text-red-500 text-sm">
        {error}
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">

      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <FiBriefcase size={20} className="text-[#0A66C2]" />
          Recommended Jobs
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Jobs matched to your profile — use your reference key when applying
        </p>
      </div>

      {/* EMPTY STATE */}
      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white border border-gray-100 rounded-2xl py-20 px-6 text-center">
          <div className="bg-blue-50 p-4 rounded-full mb-4">
            <FiBriefcase size={28} className="text-[#0A66C2] opacity-60" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-1">
            No recommended jobs yet
          </h3>
          <p className="text-sm text-gray-400 max-w-xs">
            Check back later — new opportunities are matched to your profile regularly.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              copied={copiedId === job.id}
              onCopy={() => handleCopyRef(job)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ── Job Card ─────────────────────────────────────────────────────────────────
const JobCard = ({ job, copied, onCopy }) => {
  const [skillsExpanded, setSkillsExpanded] = useState(false);
  const skills = job.skills || [];
  const visibleSkills = skillsExpanded ? skills : skills.slice(0, 5);
  const hasMore = skills.length > 5;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-[#0A66C2]/30 hover:shadow-sm transition-all duration-200">

      {/* TOP ROW */}
      <div className="flex justify-between items-start gap-4">
        {/* Left: avatar + title */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0A66C2] flex items-center justify-center font-bold text-sm flex-shrink-0">
            {job.companyName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 leading-tight">
              {job.position}
            </h3>
            <p className="text-xs text-[#0A66C2] font-medium mt-0.5">{job.companyName}</p>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <FiUser size={10} />
              {job.recruiterName}
            </p>
          </div>
        </div>

        {/* Apply button */}
        <a
          href={job.link?.startsWith("http") ? job.link : `https://${job.link}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium bg-[#0A66C2] text-white px-3.5 py-2 rounded-lg hover:bg-[#084e8a] transition-colors"
        >
          Apply Now
          <FiExternalLink size={12} />
        </a>
      </div>

      {/* DESCRIPTION */}
      <p className="text-xs text-gray-500 mt-3 leading-relaxed line-clamp-2">
        {job.description}
      </p>

      {/* QUALIFICATION + EXPERIENCE */}
      {(job.qualification || job.experience) && (
        <div className="flex flex-wrap gap-3 mt-3">
          {job.qualification && (
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
              <FiAward size={11} className="text-gray-400" />
              {job.qualification}
            </span>
          )}
          {job.experience && (
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
              <FiClock size={11} className="text-gray-400" />
              {job.experience}
            </span>
          )}
        </div>
      )}

      {/* SKILLS */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {visibleSkills.map((skill) => (
            <span
              key={skill}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-[#0A66C2] border border-blue-100"
            >
              {skill}
            </span>
          ))}
          {hasMore && !skillsExpanded && (
            <button
              onClick={() => setSkillsExpanded(true)}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
            >
              +{skills.length - 5} more
            </button>
          )}
        </div>
      )}

      {/* REFERENCE KEY */}
      {job.recommendationKey && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Reference key</span>
            <code className="text-xs bg-gray-50 border border-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-mono tracking-wide">
              {job.recommendationKey}
            </code>
          </div>
          <button
            onClick={onCopy}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
              copied
                ? "bg-green-50 border-green-200 text-green-600"
                : "bg-gray-50 border-gray-100 text-gray-500 hover:border-[#0A66C2] hover:text-[#0A66C2]"
            }`}
          >
            {copied ? (
              <><FiCheck size={11} /> Copied</>
            ) : (
              <><FiCopy size={11} /> Copy ref</>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default MyJobs;