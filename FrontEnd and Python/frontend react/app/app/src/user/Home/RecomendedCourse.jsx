import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get_recommended_courses, not_interested_course } from "../../service/student/course";

import { HiOutlineAcademicCap, HiOutlineGlobeAlt, HiOutlinePencil } from "react-icons/hi2";
import { BsBarChartFill, BsBookHalf, BsAward, BsPeopleFill } from "react-icons/bs";
import { MdOutlineSportsScore, MdOutlineScience, MdOutlinePalette, MdOutlineHealthAndSafety } from "react-icons/md";
import { FiBookOpen, FiTarget, FiTrendingUp } from "react-icons/fi";

const iconPool = [
  HiOutlineAcademicCap, BsBookHalf, HiOutlineGlobeAlt, MdOutlinePalette,
  FiTarget, MdOutlineScience, BsAward, HiOutlinePencil,
  MdOutlineSportsScore, MdOutlineHealthAndSafety, FiTrendingUp, BsPeopleFill,
];

const cardStyles = [
  { bg: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)", accent: "#93c5fd" },
  { bg: "linear-gradient(135deg, #6b21a8 0%, #a855f7 100%)", accent: "#d8b4fe" },
  { bg: "linear-gradient(135deg, #065f46 0%, #10b981 100%)", accent: "#6ee7b7" },
  { bg: "linear-gradient(135deg, #92400e 0%, #f59e0b 100%)", accent: "#fde68a" },
  { bg: "linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 100%)", accent: "#bae6fd" },
  { bg: "linear-gradient(135deg, #881337 0%, #f43f5e 100%)", accent: "#fda4af" },
];

const levelLabel = (level) => {
  if (level === 1) return { label: "Beginner",     color: "#22c55e" };
  if (level === 2) return { label: "Intermediate", color: "#f59e0b" };
  return               { label: "Advanced",        color: "#ef4444" };
};

const RecommendedCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await get_recommended_courses();
        setCourses(res || []);
      } catch (err) {
        console.error(err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const enrich = (course, index) => ({
    ...course,
    Icon:  iconPool[index % iconPool.length],
    style: cardStyles[index % cardStyles.length],
  });

  const handleNotInterested = async (courseId) => {
    try {
      const res = await not_interested_course(courseId);
      console.log(res);
      window.location.reload();
    } catch (err) {
      console.error("Not interested error:", err);
    }
  };

  // ── LOADING ──
  if (loading) return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-8 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-7 w-52 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <div className="h-36 bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-3 bg-white">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 rounded-full" style={{ background: "linear-gradient(to bottom, #6366f1, #8b5cf6)" }} />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">Recommended for You</h2>
            <p className="text-sm text-gray-400 mt-0.5">Curated based on your interests</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course, index) => {
          const data = enrich(course, index);
          const lvl  = levelLabel(course.level);

          return (
            <div
              key={course.id}
              onClick={() => navigate(`/student/home/course/${course.id}`, { state: { course } })}
              className="group rounded-2xl overflow-hidden border border-gray-100 bg-white cursor-pointer rc-card"
            >
              {/* HEADER */}
              <div
                className="h-36 flex items-center justify-center relative overflow-hidden"
                style={{ background: data.style.bg }}
              >
                {/* noise texture */}
                <div
                  className="absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                    backgroundSize: "150px",
                  }}
                />
                {/* glow blob */}
                <div className="absolute w-24 h-24 rounded-full blur-2xl opacity-40" style={{ background: data.style.accent }} />

                {/* icon */}
                <div className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 bg-white/15 group-hover:scale-110 transition-transform duration-300">
                  <data.Icon className="text-3xl text-white drop-shadow" />
                </div>

                {/* level badge */}
                <div
                  className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                  style={{
                    background: "rgba(0,0,0,0.35)",
                    color: lvl.color,
                    backdropFilter: "blur(6px)",
                    border: `1px solid ${lvl.color}40`,
                  }}
                >
                  {lvl.label}
                </div>
              </div>

              {/* BODY */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-1">
                  {course.name}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-1 mb-3">
                  {course.description}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span>👥 {(course.totalEnrolled || 0).toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <BsBarChartFill className="text-indigo-400 text-xs" />
                    <span>Level {course.level}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNotInterested(course.id);
                  }}
                  className="w-full text-center text-sm font-semibold text-red-600 border border-red-100 bg-red-50 hover:bg-red-100 rounded-xl py-2 transition"
                >
                  Not interested
                </button>
              </div>

              {/* bottom accent line */}
              <div className="h-0.5 w-0 group-hover:w-full transition-all duration-500" style={{ background: data.style.bg }} />
            </div>
          );
        })}
      </div>


      <style>{`
        .rc-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04);
        }
        .rc-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 28px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.05);
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-slide-up   { animation: slideUp   0.35s ease both; }
        .anim-slide-down { animation: slideDown  0.35s ease both; }
      `}</style>
    </div>
  );
};

export default RecommendedCourses;