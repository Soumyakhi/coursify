import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { search_courses } from "../../service/student/course";

import { FaCode, FaDatabase, FaChartLine, FaBrain, FaCogs, FaRocket } from "react-icons/fa";

const gradients = [
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-700",
  "from-emerald-400 to-teal-600",
  "from-orange-400 to-rose-500",
  "from-sky-400 to-blue-600",
  "from-pink-500 to-fuchsia-600",
];

const iconPool = [FaCode, FaDatabase, FaChartLine, FaBrain, FaCogs, FaRocket];

const getSeededIndex = (str, max) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) % 100000;
  return hash % max;
};

const safeRating = (r) => (!r || r === "NaN" ? "0.0" : parseFloat(r).toFixed(1));

const levelMap = {
  1: { label: "Beginner",     cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  2: { label: "Intermediate", cls: "bg-amber-50  text-amber-700  ring-1 ring-amber-200"   },
  3: { label: "Advanced",     cls: "bg-rose-50   text-rose-700   ring-1 ring-rose-200"    },
};

const StarRating = ({ rating }) => {
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

const SearchResults = () => {
  const navigate = useNavigate();
  const { query, page } = useParams();

  const [courses, setCourses] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(true);

  const currentPage = parseInt(page) || 1;

  useEffect(() => {
    if (!query) {
      setCourses([]);
      setPageCount(1);
      setLoading(false);
      return;
    }

    fetchCourses();
  }, [query, page]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await search_courses(query, currentPage);
      setCourses(res?.courseDto || []);
      if (currentPage === 1 && res?.pageCount != null) {
        setPageCount(res.pageCount);
      }
    } catch (err) {
      console.error(err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const paginatedCourses = courses;

  const goToPage = (p) => navigate(`/student/home/search/course/${query}/${p}`);

  const enriched = useMemo(() =>
    paginatedCourses.map((c) => ({
      ...c,
      gradient: gradients[getSeededIndex(c.id,  gradients.length)],
      Icon:     iconPool [getSeededIndex(c.name, iconPool.length)],
    })),
  [paginatedCourses]);

  /* ── LOADING ── */
  if (loading) return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
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
    </div>
  );

  /* ── EMPTY ── */
  if (!courses.length) return (
    <div className="flex flex-col items-center justify-center min-h-[55vh] text-center px-6 gap-3">
      <span className="text-5xl">🔍</span>
      <h2 className="text-xl font-bold text-gray-800">No results for "{query}"</h2>
      <p className="text-sm text-gray-500">Try a different keyword or browse our catalog.</p>
    </div>
  );

  const totalShowing = courses.length;

  return (
    <div className="max-w-6xl mx-auto px-3 py-8">

      {/* ── GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {enriched.map((course) => {
          const rating = safeRating(course.rating);
          const level  = levelMap[course.level] || { label: `Level ${course.level}`, cls: "bg-gray-100 text-gray-600 ring-1 ring-gray-200" };

          return (
            <div
              key={course.id}
              onClick={() => navigate(`/student/home/course/${course.id}`)}
              className="course-card group relative bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer"
            >
              {/* ── HEADER ── */}
              <div className={`relative h-36 bg-gradient-to-br ${course.gradient} flex flex-col items-center justify-center overflow-hidden`}>
                {/* decorative rings via CSS only */}
                <span className="absolute -top-8 -right-8 w-36 h-36 rounded-full border border-white/20 pointer-events-none" />
                <span className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full border border-white/15 pointer-events-none" />

                {/* icon bubble */}
                <div className="relative z-10 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2 shadow-md">
                  <course.Icon className="text-white text-xl" />
                </div>

                <span className="relative z-10 text-[10px] font-semibold tracking-widest uppercase text-white/85 bg-black/20 px-3 py-1 rounded-full">
                  {course.videoFilePath ? "Video Course" : "Learning Path"}
                </span>
              </div>

              {/* ── BODY ── */}
              <div className="p-4 flex flex-col gap-2.5">
                <h2 className="text-[15px] font-bold text-gray-800 leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
                  {course.name}
                </h2>

                <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2 min-h-[40px]">
                  {course.description}
                </p>

                <StarRating rating={rating} />

                {/* FOOTER */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${level.cls}`}>
                    {level.label}
                  </span>
                  <span className="text-[12px] text-gray-400 font-medium">
                    👥 {(course.totalEnrolled || 0).toLocaleString()} students
                  </span>
                </div>
              </div>

              {/* animated bottom accent bar */}
              <div className={`h-[3px] bg-gradient-to-r ${course.gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
            </div>
          );
        })}
      </div>

      {/* ── PAGINATION ── */}
      {pageCount > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">

          <button
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150
              ${currentPage === 1
                ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                : "border-gray-200 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 shadow-sm cursor-pointer"
              }`}
          >
            ← Prev
          </button>

          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`w-10 h-10 rounded-xl text-sm font-semibold border transition-all duration-150
                ${currentPage === i + 1
                  ? "bg-blue-600 text-white border-blue-600 page-active-shadow"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 shadow-sm cursor-pointer"
                }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === pageCount}
            onClick={() => goToPage(currentPage + 1)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150
              ${currentPage === pageCount
                ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                : "border-gray-200 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 shadow-sm cursor-pointer"
              }`}
          >
            Next →
          </button>

        </div>
      )}

      {/* ── MINIMAL CUSTOM CSS ── */}
      <style>{`
        .course-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04);
        }
        .course-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.05);
        }
        .page-active-shadow {
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
        }
        .skeleton-shimmer {
          background: linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default SearchResults;