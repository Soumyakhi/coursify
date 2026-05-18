import React, { useState, useEffect, useRef } from "react";
import { getTeacherData } from "../localstorage";
import { teacher_fetch_my_courses, teacher_add_course } from "../service/teacher/course";
import { FiPlus, FiBookOpen, FiX, FiVideo, FiTrash2, FiStar, FiUpload, FiCheck, FiChevronDown, FiPlay, FiUsers, FiAward, FiTrendingUp } from "react-icons/fi";
import Swal from "sweetalert2";

const levelMap = {
  1: { label: "Beginner", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "#10b981" },
  2: { label: "Intermediate", cls: "bg-amber-50 text-amber-700 border-amber-200", dot: "#f59e0b" },
  3: { label: "Advanced", cls: "bg-rose-50 text-rose-700 border-rose-200", dot: "#f43f5e" },
};

const safeRating = (r) => (!r || r === "NaN" ? "0.0" : parseFloat(r).toFixed(1));
const getEmptyQuestion = () => ({ question: "", option1: "", option2: "", correctAnswer: 1 });

const StarRating = ({ rating }) => {
  const r = parseFloat(rating);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="12" height="12" viewBox="0 0 12 12" fill={s <= Math.round(r) ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="1.5">
          <polygon points="6,1 7.5,4.5 11,4.8 8.5,7 9.3,10.5 6,8.5 2.7,10.5 3.5,7 1,4.8 4.5,4.5" />
        </svg>
      ))}
      <span className="text-xs font-bold text-slate-600 ml-1">{rating}</span>
    </div>
  );
};

export default function TeacherDashboard() {
  const teacherData = getTeacherData();
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [myCourses, setMyCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vidFile, setVidFile] = useState(null);
  const [vidPreviewUrl, setVidPreviewUrl] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  const [courseDetails, setCourseDetails] = useState({ name: "", description: "", level: 1, timeStamps: "" });
  const [questions, setQuestions] = useState([getEmptyQuestion(), getEmptyQuestion(), getEmptyQuestion(), getEmptyQuestion()]);

  useEffect(() => {
    if (showViewModal) loadCourses();
  }, [showViewModal]);

  useEffect(() => {
    return () => { if (vidPreviewUrl) URL.revokeObjectURL(vidPreviewUrl); };
  }, [vidPreviewUrl]);

  const loadCourses = async () => {
    setLoadingCourses(true);
    try {
      const res = await teacher_fetch_my_courses();
      setMyCourses(res || []);
    } catch (e) { console.error(e); }
    finally { setLoadingCourses(false); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (vidPreviewUrl) URL.revokeObjectURL(vidPreviewUrl);
    setVidFile(file);
    setVidPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (vidPreviewUrl) URL.revokeObjectURL(vidPreviewUrl);
    setVidFile(file);
    setVidPreviewUrl(URL.createObjectURL(file));
  };

  const addQuestion = () => setQuestions([...questions, getEmptyQuestion()]);

  const removeQuestion = (i) => {
    if (questions.length <= 4) {
      Swal.fire({ icon: "warning", title: "Minimum Required", text: "A minimum of 4 questions is required.", confirmButtonColor: "#0A66C2" });
      return;
    }
    const u = [...questions]; u.splice(i, 1); setQuestions(u);
  };

  const handleQuestionChange = (i, field, val) => {
    const u = [...questions]; u[i][field] = val; setQuestions(u);
  };

  const handleAddCourseSubmit = async (e) => {
    e.preventDefault();
    if (!vidFile) {
      Swal.fire({ icon: "warning", title: "Missing Material", text: "Please upload a video or course material file.", confirmButtonColor: "#0A66C2" });
      return;
    }
    if (questions.length < 4) {
      Swal.fire({ icon: "warning", title: "Insufficient Questions", text: "A minimum of 4 questions is required.", confirmButtonColor: "#0A66C2" });
      return;
    }
    setIsSubmitting(true);
    try {
      const coursePayload = {
        name: courseDetails.name,
        description: courseDetails.description,
        level: Number(courseDetails.level),
        timeStamps: courseDetails.timeStamps.split(",").map((t) => t.trim()).filter((t) => t !== ""),
        questions: questions.map((q) => ({ ...q, correctAnswer: Number(q.correctAnswer) })),
      };
      const formData = new FormData();
      formData.append("course", JSON.stringify(coursePayload));
      formData.append("material", vidFile);
      await teacher_add_course(formData);
      Swal.fire({ icon: "success", title: "Published!", text: "Your course has been added successfully.", confirmButtonColor: "#0A66C2" });
      setVidFile(null); setVidPreviewUrl(null);
      setCourseDetails({ name: "", description: "", level: 1, timeStamps: "" });
      setQuestions([getEmptyQuestion(), getEmptyQuestion(), getEmptyQuestion(), getEmptyQuestion()]);
      setShowAddModal(false); setActiveStep(1);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Upload Failed", text: err?.response?.data?.message || "Failed to add course. Please try again.", confirmButtonColor: "#0A66C2" });
    } finally { setIsSubmitting(false); }
  };

  const resetAddModal = () => { setShowAddModal(false); setActiveStep(1); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        /* ── FIX 1: Force html/body/root to fill full viewport ── */
        html, body, #root {
          height: 100%;
          margin: 0;
          padding: 0;
        }

        .td-root * { font-family: 'Sora', sans-serif; }
        .td-mono { font-family: 'JetBrains Mono', monospace; }

        /* ── FIX 2: Hero fills full viewport height, never shorter ── */
        .td-hero-bg {
          background: linear-gradient(135deg, #f0f7ff 0%, #e8f4fd 40%, #f8faff 100%);
          position: relative;
          overflow: hidden;
          /* Use min-height: 100vh AND height: 100% so it fills screen even when content is short */
          min-height: 70vh;
          width: 100%;
          /* Ensure it always extends to at least full viewport */
          box-sizing: border-box;
        }

        /* ── FIX 3: Pseudo-elements fill the full background, not just content area ── */
        .td-hero-bg::before {
          content: '';
          position: fixed; /* fixed so it always covers full viewport */
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(10,102,194,0.07) 0%, transparent 70%);
          top: -200px; right: -100px;
          pointer-events: none;
          z-index: 0;
        }
        .td-hero-bg::after {
          content: '';
          position: fixed; /* fixed so it always covers full viewport */
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(10,102,194,0.05) 0%, transparent 70%);
          bottom: -150px; left: -50px;
          pointer-events: none;
          z-index: 0;
        }

        /* Ensure content sits above the pseudo-element decorations */
        .td-hero-bg > * {
          position: relative;
          z-index: 1;
        }

        .td-card {
          position: relative;
          background: #fff;
          border: 1.5px solid #e2ebf5;
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.35s cubic-bezier(0.23, 1, 0.32, 1);
          cursor: pointer;
        }
        .td-card:hover {
          border-color: #0A66C2;
          box-shadow: 0 20px 60px rgba(10,102,194,0.14), 0 4px 16px rgba(10,102,194,0.08);
          transform: translateY(-4px);
        }
        .td-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(10,102,194,0.03) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.35s;
          pointer-events: none;
        }
        .td-card:hover::before { opacity: 1; }

        .td-icon-box {
          width: 56px; height: 56px;
          background: linear-gradient(135deg, #e8f3fd, #d1e8f9);
          color: #0A66C2;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.35s cubic-bezier(0.23, 1, 0.32, 1);
          flex-shrink: 0;
        }
        .td-card:hover .td-icon-box {
          background: linear-gradient(135deg, #0A66C2, #1a7fd4);
          color: #fff;
          transform: rotate(-5deg) scale(1.1);
          box-shadow: 0 8px 24px rgba(10,102,194,0.3);
        }

        .td-arrow {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: #f0f7ff;
          color: #0A66C2;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          transition: all 0.3s;
          flex-shrink: 0;
        }
        .td-card:hover .td-arrow {
          background: #0A66C2;
          color: #fff;
          transform: translateX(4px);
        }

        /* ── FIX 4: Modal overlay uses fixed + full inset to always cover entire screen ── */
        .td-modal-overlay {
          position: fixed;
          inset: 0;
          top: 0; right: 0; bottom: 0; left: 0; /* explicit for older browsers */
          background: rgba(7,20,40,0.55);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999;
          padding: 16px;
          animation: td-fade-in 0.2s ease;
        }
        .td-modal {
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 40px 100px rgba(7,20,40,0.25), 0 0 0 1px rgba(10,102,194,0.1);
          display: flex; flex-direction: column;
          animation: td-slide-up 0.3s cubic-bezier(0.23,1,0.32,1);
          overflow: hidden;
        }
        @keyframes td-fade-in { from { opacity:0 } to { opacity:1 } }
        @keyframes td-slide-up { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }

        /* Course card */
        .td-course-card {
          background: #fff;
          border: 1.5px solid #e8eef5;
          border-radius: 18px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.23,1,0.32,1);
        }
        .td-course-card:hover {
          border-color: #0A66C2;
          box-shadow: 0 12px 40px rgba(10,102,194,0.12);
          transform: translateY(-3px);
        }

        /* Upload zone */
        .td-upload-zone {
          border: 2px dashed #c9ddf0;
          border-radius: 16px;
          padding: 32px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          background: #f8fbff;
        }
        .td-upload-zone:hover, .td-upload-zone.drag-over {
          border-color: #0A66C2;
          background: #eef6ff;
        }

        /* Input focus */
        .td-input {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #d4e3f0;
          border-radius: 10px;
          outline: none;
          font-size: 14px;
          font-family: 'Sora', sans-serif;
          background: #fff;
          color: #1e293b;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .td-input:focus {
          border-color: #0A66C2;
          box-shadow: 0 0 0 3px rgba(10,102,194,0.1);
        }

        /* Question card */
        .td-question-card {
          background: #f8fbff;
          border: 1.5px solid #e2ebf5;
          border-radius: 14px;
          padding: 18px;
          transition: border-color 0.2s;
        }
        .td-question-card:focus-within { border-color: #0A66C2; }

        /* Radio option */
        .td-radio-label {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 14px;
          border: 1.5px solid #dde8f2;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          color: #475569;
          transition: all 0.2s;
        }
        .td-radio-label.selected {
          border-color: #0A66C2;
          background: #eef6ff;
          color: #0A66C2;
        }

        /* Video preview */
        .td-video-preview {
          border-radius: 14px;
          overflow: hidden;
          background: #000;
          border: 2px solid #0A66C2;
          box-shadow: 0 8px 32px rgba(10,102,194,0.2);
        }

        .td-cancel-btn {
          border: 1.5px solid #d4e3f0;
          background: #fff;
          color: #64748b;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
          font-family: 'Sora', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }
        .td-cancel-btn:hover { background: #f8fafc; border-color: #94a3b8; }

        .td-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 20px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.02em;
          border: 1px solid;
        }

        .td-section-header {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 14px;
          display: flex; align-items: center; gap: 8px;
        }
        .td-section-header::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e8eef5;
        }

        .td-close-btn {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: #f1f5f9;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #64748b;
          transition: all 0.2s;
        }
        .td-close-btn:hover { background: #fee2e2; color: #ef4444; }

        /* Skeleton shimmer */
        .td-skeleton {
          background: linear-gradient(90deg, #f0f7ff 25%, #e1eef9 50%, #f0f7ff 75%);
          background-size: 200% 100%;
          animation: td-shimmer 1.5s infinite;
          border-radius: 10px;
        }
        @keyframes td-shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        .td-gradient-card {
          background: linear-gradient(135deg, #0A66C2 0%, #0d5ba8 50%, #083f7a 100%);
        }

        /* Scrollbar */
        .td-scroll::-webkit-scrollbar { width: 5px; }
        .td-scroll::-webkit-scrollbar-track { background: transparent; }
        .td-scroll::-webkit-scrollbar-thumb { background: #c9ddf0; border-radius: 99px; }
        .td-scroll::-webkit-scrollbar-thumb:hover { background: #0A66C2; }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── FIX 5: wrapper div stretches to full height of page, background always fills ── */}
      <div className="td-root td-hero-bg" style={{ minHeight: "100vh", width: "100%" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 16px" }}>

          {/* ── HEADER ── */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-white border border-[#c9ddf0] rounded-full px-4 py-1.5 mb-5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#0A66C2] animate-pulse"></span>
              <span className="text-xs font-semibold text-[#0A66C2] tracking-wider uppercase">Instructor Portal</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 leading-tight">
              Welcome back,{" "}
              <span style={{ background: "linear-gradient(135deg, #0A66C2, #1a7fd4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {teacherData?.name || "Teacher"}
              </span>
            </h1>
            <p className="text-slate-500 mt-2 text-lg">Manage your courses and shape the next generation of learners.</p>
          </div>

          {/* ── STAT CHIPS ── */}
          <div className="flex flex-wrap gap-3 mb-10">
            {[
              { icon: <FiBookOpen size={14} />, label: "Published Courses" },
              { icon: <FiUsers size={14} />, label: "Total Students" },
              { icon: <FiTrendingUp size={14} />, label: "Avg. Rating" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2 bg-white border border-[#e2ebf5] rounded-full px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
                <span className="text-[#0A66C2]">{s.icon}</span>
                {s.label}
              </div>
            ))}
          </div>

          {/* ── ACTION CARDS ── */}
          <div className="grid gap-5 sm:grid-cols-2">

            {/* Add Course */}
            <div className="td-card p-7" onClick={() => setShowAddModal(true)}>
              <div className="flex items-start justify-between mb-5">
                <div className="td-icon-box"><FiPlus size={24} /></div>
                <div className="td-arrow">→</div>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Add New Course</h2>
              <p className="text-slate-500 text-sm leading-relaxed">Upload video material, set chapter timestamps, and craft quiz questions for your students.</p>
              <div className="mt-6 flex gap-2">
                {["Upload", "Timestamps", "Quiz"].map((tag) => (
                  <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#f0f7ff] text-[#0A66C2] border border-[#d1e8f9]">{tag}</span>
                ))}
              </div>
            </div>

            {/* View Courses */}
            <div className="td-card p-7" onClick={() => setShowViewModal(true)}>
              <div className="flex items-start justify-between mb-5">
                <div className="td-icon-box"><FiBookOpen size={24} /></div>
                <div className="td-arrow">→</div>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">View My Courses</h2>
              <p className="text-slate-500 text-sm leading-relaxed">Browse and manage your published courses, view enrollment numbers and student ratings.</p>
              <div className="mt-6 flex gap-2">
                {["Analytics", "Students", "Ratings"].map((tag) => (
                  <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#f0f7ff] text-[#0A66C2] border border-[#d1e8f9]">{tag}</span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>


      {/* ══════════════════════════════════════════════
          VIEW COURSES MODAL
      ══════════════════════════════════════════════ */}
      {showViewModal && (
        <div className="td-root td-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowViewModal(false)}>
          <div className="td-modal w-full" style={{ maxWidth: 1000, maxHeight: "90vh" }}>

            {/* Header */}
            <div style={{ background: "linear-gradient(135deg, #0A66C2, #083f7a)", padding: "24px 32px", flexShrink: 0 }} className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">My Published Courses</h2>
                <p className="text-blue-200 text-sm mt-1">Manage and track your course library</p>
              </div>
              <button className="td-close-btn" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }} onClick={() => setShowViewModal(false)}>
                <FiX size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="td-scroll flex-1 overflow-y-auto" style={{ background: "#f5f9fd", padding: 28 }}>
              {loadingCourses ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#e8eef5]">
                      <div className="td-skeleton h-28" />
                      <div className="p-4 space-y-2">
                        <div className="td-skeleton h-4 w-3/4" />
                        <div className="td-skeleton h-3 w-full" />
                        <div className="td-skeleton h-3 w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : myCourses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div style={{ width: 80, height: 80, background: "linear-gradient(135deg,#e8f3fd,#d1e8f9)", borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center" }} className="mb-5">
                    <FiBookOpen size={36} color="#0A66C2" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">No courses yet</h3>
                  <p className="text-slate-500 mt-2 text-sm max-w-xs text-center">You haven't uploaded any courses. Click "Add New Course" to get started!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {myCourses.map((course) => {
                    const lvl = levelMap[course.level] || levelMap[1];
                    const rating = safeRating(course.rating);
                    return (
                      <div key={course.id} className="td-course-card">
                        <div className="td-gradient-card h-28 p-5 relative overflow-hidden flex flex-col justify-end">
                          <div style={{ position: "absolute", width: 100, height: 100, background: "rgba(255,255,255,0.06)", borderRadius: "50%", top: -20, right: -20 }} />
                          <div style={{ position: "absolute", width: 70, height: 70, background: "rgba(255,255,255,0.04)", borderRadius: "50%", bottom: -10, left: 10 }} />
                          <span style={{ position: "absolute", top: 10, right: 10, fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", color: "rgba(255,255,255,0.9)", background: "rgba(0,0,0,0.25)", padding: "3px 8px", borderRadius: 20 }}>
                            {course.videoFilePath ? "VIDEO" : "COURSE"}
                          </span>
                          <h3 className="text-base font-bold text-white line-clamp-2 relative z-10" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>{course.name}</h3>
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-slate-500 line-clamp-2 mb-3 min-h-[40px]">{course.description}</p>
                          <StarRating rating={rating} />
                          <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid #f0f7ff" }}>
                            <span className={`td-badge ${lvl.cls}`}>
                              <span style={{ width: 6, height: 6, borderRadius: "50%", background: lvl.dot, flexShrink: 0, display: "inline-block" }} />
                              {lvl.label}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                              <FiUsers size={11} /> {course.totalEnrolled || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* ══════════════════════════════════════════════
          ADD COURSE MODAL
      ══════════════════════════════════════════════ */}
      {showAddModal && (
        <div className="td-root td-modal-overlay" onClick={(e) => e.target === e.currentTarget && resetAddModal()}>
          <div className="td-modal w-full" style={{ maxWidth: 760, maxHeight: "95vh", display: "flex", flexDirection: "column" }}>

            {/* Header — fixed, never scrolls */}
            <div className="flex-shrink-0" style={{ background: "linear-gradient(135deg, #0A66C2, #083f7a)", padding: "22px 28px" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FiVideo size={20} color="#fff" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Create New Course</h2>
                    <p className="text-blue-200 text-xs mt-0.5">Fill in the details below to publish your course</p>
                  </div>
                </div>
                <button className="td-close-btn" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }} onClick={resetAddModal}>
                  <FiX size={18} />
                </button>
              </div>

              {/* Step Bar */}
              <div className="flex gap-1 mt-5">
                {[
                  { n: 1, label: "Course Info" },
                  { n: 2, label: "Material" },
                  { n: 3, label: "Quiz" },
                ].map(({ n, label }) => (
                  <button
                    key={n}
                    onClick={() => setActiveStep(n)}
                    style={{
                      flex: 1, padding: "8px 4px", borderRadius: 8, border: "none",
                      background: activeStep === n ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)",
                      color: activeStep === n ? "#fff" : "rgba(255,255,255,0.55)",
                      fontSize: 12, fontWeight: 700, fontFamily: "'Sora',sans-serif",
                      cursor: "pointer", transition: "all 0.2s",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                    }}
                  >
                    <span style={{
                      width: 18, height: 18, borderRadius: "50%",
                      background: activeStep > n ? "#10b981" : activeStep === n ? "#fff" : "rgba(255,255,255,0.25)",
                      color: activeStep > n ? "#fff" : activeStep === n ? "#0A66C2" : "rgba(255,255,255,0.6)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 800, flexShrink: 0
                    }}>
                      {activeStep > n ? <FiCheck size={10} /> : n}
                    </span>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* form takes remaining height, clips overflow so inner scroll works */}
            <form
              id="add-course-form"
              onSubmit={handleAddCourseSubmit}
              style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}
            >
              {/* scrollable body */}
              <div
                className="td-scroll"
                style={{ flex: 1, minHeight: 0, overflowY: "auto", background: "#f5f9fd", padding: 24 }}
              >

                {/* STEP 1: Course Info */}
                {activeStep === 1 && (
                  <div style={{ animation: "td-slide-up 0.25s ease" }}>
                    <div className="td-section-header">Course Details</div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Course Name</label>
                        <input
                          type="text" required value={courseDetails.name}
                          onChange={(e) => setCourseDetails({ ...courseDetails, name: e.target.value })}
                          className="td-input" placeholder="e.g. Advanced Operating Systems"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Description</label>
                        <textarea
                          required rows={3} value={courseDetails.description}
                          onChange={(e) => setCourseDetails({ ...courseDetails, description: e.target.value })}
                          className="td-input resize-none" placeholder="What will students learn from this course?"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Difficulty Level</label>
                          <div style={{ position: "relative" }}>
                            <select
                              value={courseDetails.level}
                              onChange={(e) => setCourseDetails({ ...courseDetails, level: e.target.value })}
                              className="td-input appearance-none pr-9"
                              style={{ cursor: "pointer" }}
                            >
                              <option value={1}>🟢 Beginner</option>
                              <option value={2}>🟡 Intermediate</option>
                              <option value={3}>🔴 Advanced</option>
                            </select>
                            <FiChevronDown size={14} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                            Timestamps <span className="td-mono text-[10px] normal-case font-normal text-slate-400">(seconds, comma-separated)</span>
                          </label>
                          <input
                            type="text" required value={courseDetails.timeStamps}
                            onChange={(e) => setCourseDetails({ ...courseDetails, timeStamps: e.target.value })}
                            className="td-input td-mono" placeholder="101, 2022, 3300"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <button
                        type="button"
                        onClick={() => setActiveStep(2)}
                        style={{ background: "linear-gradient(135deg,#0A66C2,#1a7fd4)", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14, fontFamily: "'Sora',sans-serif", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 14px rgba(10,102,194,0.3)" }}
                      >
                        Next: Upload Material →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Material Upload */}
                {activeStep === 2 && (
                  <div style={{ animation: "td-slide-up 0.25s ease" }}>
                    <div className="td-section-header">Course Material</div>

                    {/* Upload Zone */}
                    <div
                      className="td-upload-zone"
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      {vidFile ? (
                        <div className="flex items-center justify-center gap-3">
                          <div style={{ width: 40, height: 40, background: "#d1fae5", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <FiCheck size={20} color="#10b981" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-slate-800">{vidFile.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{(vidFile.size / (1024 * 1024)).toFixed(1)} MB · Click to replace</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div style={{ width: 52, height: 52, background: "#e8f3fd", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                            <FiUpload size={24} color="#0A66C2" />
                          </div>
                          <p className="text-sm font-bold text-slate-700">Drop your video here or <span style={{ color: "#0A66C2" }}>browse</span></p>
                          <p className="text-xs text-slate-400 mt-1">MP4, WebM, MOV — up to 2GB</p>
                        </>
                      )}
                      <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
                    </div>

                    {/* Video Preview */}
                    {vidPreviewUrl && (
                      <div className="mt-5">
                        <div className="td-section-header" style={{ marginBottom: 10 }}>
                          <FiPlay size={12} /> Preview
                        </div>
                        <div className="td-video-preview">
                          <video
                            ref={videoRef}
                            src={vidPreviewUrl}
                            controls
                            style={{ width: "100%", display: "block", maxHeight: 280 }}
                          />
                        </div>
                        <div style={{ background: "#eef6ff", borderRadius: 10, padding: "10px 14px", marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
                          <FiCheck size={14} color="#0A66C2" />
                          <p style={{ fontSize: 13, color: "#0A66C2", fontWeight: 600 }}>
                            Confirm this is the right video before proceeding
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between mt-6">
                      <button type="button" className="td-cancel-btn" onClick={() => setActiveStep(1)}>← Back</button>
                      <button
                        type="button"
                        onClick={() => setActiveStep(3)}
                        disabled={!vidFile}
                        style={{ background: vidFile ? "linear-gradient(135deg,#0A66C2,#1a7fd4)" : "#e2ebf5", color: vidFile ? "#fff" : "#94a3b8", border: "none", padding: "10px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14, fontFamily: "'Sora',sans-serif", cursor: vidFile ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 6, boxShadow: vidFile ? "0 4px 14px rgba(10,102,194,0.3)" : "none", transition: "all 0.2s" }}
                      >
                        Next: Quiz Questions →
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Quiz */}
                {activeStep === 3 && (
                  <div style={{ animation: "td-slide-up 0.25s ease" }}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="td-section-header" style={{ marginBottom: 0, flex: 1 }}>
                        Quiz Questions
                      </div>
                      <button
                        type="button" onClick={addQuestion}
                        style={{ display: "flex", alignItems: "center", gap: 5, background: "#eef6ff", color: "#0A66C2", border: "1.5px solid #d1e8f9", borderRadius: 8, padding: "6px 12px", fontSize: 13, fontWeight: 700, fontFamily: "'Sora',sans-serif", cursor: "pointer", flexShrink: 0 }}
                      >
                        <FiPlus size={13} /> Add Question
                      </button>
                    </div>

                    <div className="space-y-4">
                      {questions.map((q, index) => (
                        <div key={index} className="td-question-card">
                          <div className="flex items-center justify-between mb-3">
                            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "#0A66C2", background: "#eef6ff", padding: "3px 10px", borderRadius: 20 }}>Q{index + 1}</span>
                            {questions.length > 4 && (
                              <button type="button" onClick={() => removeQuestion(index)} style={{ background: "none", border: "none", cursor: "pointer", color: "#cbd5e1", padding: 4, borderRadius: 6, transition: "color 0.2s" }}
                                onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
                                onMouseLeave={e => e.currentTarget.style.color = "#cbd5e1"}
                              >
                                <FiTrash2 size={14} />
                              </button>
                            )}
                          </div>

                          <input
                            type="text" required value={q.question} placeholder="Enter your question..."
                            onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                            className="td-input mb-3" style={{ fontWeight: 600 }}
                          />

                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div>
                              <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>Option A</label>
                              <input type="text" required value={q.option1} placeholder="First choice" onChange={(e) => handleQuestionChange(index, "option1", e.target.value)} className="td-input" style={{ fontSize: 13 }} />
                            </div>
                            <div>
                              <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" }}>Option B</label>
                              <input type="text" required value={q.option2} placeholder="Second choice" onChange={(e) => handleQuestionChange(index, "option2", e.target.value)} className="td-input" style={{ fontSize: 13 }} />
                            </div>
                          </div>

                          <div>
                            <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Correct Answer</label>
                            <div className="flex gap-2">
                              {[{ val: 1, label: "Option A" }, { val: 2, label: "Option B" }].map(({ val, label }) => (
                                <label key={val} className={`td-radio-label ${q.correctAnswer === val ? "selected" : ""}`}
                                  onClick={() => handleQuestionChange(index, "correctAnswer", val)}
                                >
                                  <span style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${q.correctAnswer === val ? "#0A66C2" : "#d4e3f0"}`, background: q.correctAnswer === val ? "#0A66C2" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}>
                                    {q.correctAnswer === val && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }} />}
                                  </span>
                                  {label}
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between mt-6">
                      <button type="button" className="td-cancel-btn" onClick={() => setActiveStep(2)}>← Back</button>
                    </div>
                  </div>
                )}

              </div>

              {/* Footer — fixed, never scrolls */}
              <div style={{ padding: "16px 24px", borderTop: "1px solid #e8eef5", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                <p style={{ fontSize: 12, color: "#94a3b8" }}>
                  Step {activeStep} of 3 · {activeStep === 1 ? "Course Info" : activeStep === 2 ? "Material Upload" : "Quiz Questions"}
                </p>
                <div className="flex gap-2">
                  <button type="button" className="td-cancel-btn" onClick={resetAddModal}>Cancel</button>
                  {activeStep === 3 && (
                    <button
                      form="add-course-form" type="submit" disabled={isSubmitting}
                      style={{ background: "linear-gradient(135deg,#0A66C2,#1a7fd4)", color: "#fff", border: "none", padding: "11px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14, fontFamily: "'Sora',sans-serif", cursor: isSubmitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 7, boxShadow: "0 4px 16px rgba(10,102,194,0.3)", opacity: isSubmitting ? 0.7 : 1, transition: "all 0.2s" }}
                    >
                      {isSubmitting ? (
                        <>
                          <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                          Publishing…
                        </>
                      ) : (
                        <><FiAward size={15} /> Publish Course</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}