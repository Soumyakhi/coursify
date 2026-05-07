import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetch_my_courses } from "../../service/student/course"; 
import { FaCode, FaDatabase, FaChartLine, FaBrain, FaCogs, FaRocket, FaCheckCircle } from "react-icons/fa";

const gradients = [
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-700",
  "from-emerald-400 to-teal-600",
  "from-orange-400 to-rose-500",
  "from-sky-400 to-blue-600",
  "from-pink-500 to-fuchsia-600",
];

const iconPool = [FaCode, FaDatabase, FaChartLine, FaBrain, FaCogs, FaRocket];

const getSeededIndex = (str = "", max) => {
  let hash = 0;
  const safeStr = String(str);
  for (let i = 0; i < safeStr.length; i++) hash = (hash * 31 + safeStr.charCodeAt(i)) % 100000;
  return hash % max;
};

// Uses overAllRating and handles "NaN" or missing values
const safeRating = (r) => (!r || r === "NaN" || isNaN(r) ? "0.0" : parseFloat(r).toFixed(1));

const StarRating = ({ rating }) => {
  if (rating === "0.0") {
    return <span className="text-xs font-semibold text-gray-400">Unrated</span>;
  }
  const num = parseFloat(rating);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i < Math.round(num) ? "text-amber-400" : "text-gray-200"}`}
          viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
      <span className="text-xs font-semibold text-gray-600 ml-1">{rating}</span>
    </div>
  );
};

const MyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEnrolledCourses = async () => {
      try {
        setLoading(true);
        const res = await fetch_my_courses();
        // Just setting the response directly as sorting by createdAt is no longer possible with the new payload
        setCourses(res || []); 
      } catch (err) {
        console.error("Failed to fetch my courses. ERROR:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEnrolledCourses();
  }, []);

  const { completedCourses, incompleteCourses } = useMemo(() => {
    const enriched = courses.map((c) => ({
      ...c,
      gradient: gradients[getSeededIndex(c.courseId?.toString() || c.courseName, gradients.length)],
      Icon: iconPool[getSeededIndex(c.courseName || "course", iconPool.length)],
    }));

    // Split based on the exact boolean flag `complete`
    return {
      completedCourses: enriched.filter((c) => c.complete === true),
      incompleteCourses: enriched.filter((c) => c.complete === false),
    };
  }, [courses]);

  const renderCourseCard = (course, isCompleted) => {
    const rating = safeRating(course.overAllRating);

    return (
      <div
        key={course.courseId}
        onClick={() => navigate(`/student/home/course/${course.courseId}`)}
        className="course-card group relative bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer"
      >
        <div className={`relative h-36 bg-gradient-to-br ${course.gradient} flex flex-col items-center justify-center overflow-hidden ${isCompleted ? 'grayscale-[30%]' : ''}`}>
          <span className="absolute -top-8 -right-8 w-36 h-36 rounded-full border border-white/20 pointer-events-none" />
          <span className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full border border-white/15 pointer-events-none" />
          
          <div className="relative z-10 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2 shadow-md">
            <course.Icon className="text-white text-xl" />
          </div>
          
          <div className="relative z-10 flex gap-2">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-white/85 bg-black/20 px-3 py-1 rounded-full">
              Course
            </span>
            {isCompleted && (
              <span className="text-[10px] font-semibold tracking-widest uppercase text-emerald-100 bg-emerald-600/80 px-3 py-1 rounded-full flex items-center gap-1">
                <FaCheckCircle /> Completed
              </span>
            )}
          </div>
        </div>
        
        <div className="p-4 flex flex-col gap-2.5">
          <h2 className="text-[15px] font-bold text-gray-800 leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
            {course.courseName}
          </h2>
          <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2 min-h-[40px]">
            {course.description}
          </p>
          
          <div className="flex items-center justify-between mt-1">
            <StarRating rating={rating} />
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-end pt-3 border-t border-gray-50">
            <span className="text-[12px] text-blue-600 font-medium group-hover:underline">
              {isCompleted ? "Review Course →" : "Continue Learning →"}
            </span>
          </div>
        </div>
        <div className={`h-[3px] bg-gradient-to-r ${course.gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
      </div>
    );
  };

  /* ── LOADING ── */
  if (loading) return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Learning</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 bg-white">
            <div className="h-36 skeleton-shimmer" />
            <div className="p-4 space-y-3">
              <div className="h-4 rounded-lg skeleton-shimmer w-3/4" />
              <div className="h-3 rounded-lg skeleton-shimmer w-full" />
              <div className="h-3 rounded-lg skeleton-shimmer w-5/6" />
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .skeleton-shimmer {
          background: linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>
    </div>
  );

  /* ── EMPTY ── */
  if (!courses.length) return (
    <div className="flex flex-col items-center justify-center min-h-[55vh] text-center px-6 gap-3">
      <span className="text-5xl">📚</span>
      <h2 className="text-xl font-bold text-gray-800">You haven't enrolled in any courses yet</h2>
      <p className="text-sm text-gray-500 mb-4">Start exploring to build your skills.</p>
      <button 
        onClick={() => navigate("/student/home")}
        className="bg-[#0A66C2] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#084e8a] transition"
      >
        Browse Courses
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-3 py-8">
      <div className="mb-8 px-3">
        <h1 className="text-3xl font-bold text-gray-900">My Learning</h1>
        <p className="text-gray-500 mt-1">Pick up right where you left off and review your achievements.</p>
      </div>

      {/* Incomplete / Ongoing Courses */}
      {incompleteCourses.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4 px-3">Ongoing Learning</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {incompleteCourses.map((course) => renderCourseCard(course, false))}
          </div>
        </div>
      )}

      {/* Completed Courses */}
      {completedCourses.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-4 px-3 flex items-center gap-2">
            Completed Courses <FaCheckCircle className="text-emerald-500 text-lg" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedCourses.map((course) => renderCourseCard(course, true))}
          </div>
        </div>
      )}

      <style>{`
        .course-card { transition: transform 0.2s ease, box-shadow 0.2s ease; box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04); }
        .course-card:hover { transform: translateY(-4px); box-shadow: 0 10px 30px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.05); }
      `}</style>
    </div>
  );
};

export default MyCourses;