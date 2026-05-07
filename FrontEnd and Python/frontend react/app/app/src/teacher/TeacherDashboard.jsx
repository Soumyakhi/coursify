import React, { useState, useEffect } from "react";
import { getTeacherData } from "../localstorage";
import { teacher_fetch_my_courses, teacher_add_course } from "../service/teacher/course"; 
import { FiPlus, FiBookOpen, FiX, FiVideo, FiTrash2, FiStar } from "react-icons/fi";
import Swal from 'sweetalert2'; // ✅ Imported SweetAlert2

const levelMap = {
  1: { label: "Beginner", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  2: { label: "Intermediate", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  3: { label: "Advanced", cls: "bg-rose-50 text-rose-700 border-rose-200" },
};

const safeRating = (r) => (!r || r === "NaN" ? "0.0" : parseFloat(r).toFixed(1));

// Helper function to generate an empty question object
const getEmptyQuestion = () => ({ question: "", option1: "", option2: "", correctAnswer: 1 });

const TeacherDashboard = () => {
  const teacherData = getTeacherData();

  // Modal States
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // View Courses State
  const [myCourses, setMyCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // Add Course Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vidFile, setVidFile] = useState(null);
  const [courseDetails, setCourseDetails] = useState({
    name: "",
    description: "",
    level: 1,
    timeStamps: "", 
  });
  
  // Initialize with exactly 4 questions
  const [questions, setQuestions] = useState([
    getEmptyQuestion(), getEmptyQuestion(), getEmptyQuestion(), getEmptyQuestion()
  ]);

  useEffect(() => {
    if (showViewModal) loadCourses();
  }, [showViewModal]);

  const loadCourses = async () => {
    setLoadingCourses(true);
    try {
      const res = await teacher_fetch_my_courses();
      setMyCourses(res || []);
    } catch (error) {
      console.error("Failed to fetch courses", error);
    } finally {
      setLoadingCourses(false);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, getEmptyQuestion()]);
  };

  const removeQuestion = (index) => {
    // Failsafe: Don't allow deleting if we only have 4 questions
    if (questions.length <= 4) {
      Swal.fire({
        icon: 'warning',
        title: 'Minimum Required',
        text: 'A minimum of 4 questions is required.',
        confirmButtonColor: '#0A66C2'
      });
      return;
    }
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleAddCourseSubmit = async (e) => {
    e.preventDefault();
    
    if (!vidFile) {
      // ✅ Replaced standard alert
      Swal.fire({
        icon: 'warning',
        title: 'Missing Material',
        text: 'Please upload a video or course material file.',
        confirmButtonColor: '#0A66C2'
      });
      return;
    }
    
    if (questions.length < 4) {
      // ✅ Replaced standard alert
      Swal.fire({
        icon: 'warning',
        title: 'Insufficient Questions',
        text: 'A minimum of 4 questions is required for the quiz.',
        confirmButtonColor: '#0A66C2'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const coursePayload = {
        name: courseDetails.name,
        description: courseDetails.description,
        level: Number(courseDetails.level),
        timeStamps: courseDetails.timeStamps
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t !== ""),
        questions: questions.map((q) => ({
          ...q,
          correctAnswer: Number(q.correctAnswer),
        })),
      };

      const formData = new FormData();
      
      formData.append("course", JSON.stringify(coursePayload)); 
      formData.append("material", vidFile);

      await teacher_add_course(formData);
      
      // ✅ Replaced standard alert with Success SweetAlert
      Swal.fire({
        icon: 'success',
        title: 'Published!',
        text: 'Your course has been added successfully.',
        confirmButtonColor: '#0A66C2'
      });
      
      // Reset Form
      setVidFile(null);
      setCourseDetails({ name: "", description: "", level: 1, timeStamps: "" });
      setQuestions([getEmptyQuestion(), getEmptyQuestion(), getEmptyQuestion(), getEmptyQuestion()]);
      setShowAddModal(false);

    } catch (error) {
      console.error("Failed to add course:", error);
      
      // ✅ Replaced standard alert with Error SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: error?.response?.data?.message || 'Failed to add course. Please try again.',
        confirmButtonColor: '#0A66C2'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-semibold text-slate-900 mb-2">
        Hello, {teacherData?.name || "Teacher"}
      </h1>
      <p className="text-slate-500 mb-8">What would you like to do today?</p>

      {/* ── ACTION CARDS ── */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div onClick={() => setShowAddModal(true)} className="group rounded-3xl border border-slate-200 bg-white p-8 cursor-pointer hover:border-[#0A66C2] hover:shadow-lg transition-all duration-300">
          <div className="w-14 h-14 bg-blue-50 text-[#0A66C2] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <FiPlus size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Add New Course</h2>
          <p className="text-slate-500">Upload new material, add timestamps, and create quiz questions for your students.</p>
        </div>

        <div onClick={() => setShowViewModal(true)} className="group rounded-3xl border border-slate-200 bg-white p-8 cursor-pointer hover:border-[#0A66C2] hover:shadow-lg transition-all duration-300">
          <div className="w-14 h-14 bg-blue-50 text-[#0A66C2] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <FiBookOpen size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">View My Courses</h2>
          <p className="text-slate-500">Browse and manage the list of all the courses you have successfully published.</p>
        </div>
      </div>

      {/* ── VIEW COURSES MODAL ── */}
      {showViewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
              <h2 className="text-2xl font-bold text-slate-800">My Published Courses</h2>
              <button onClick={() => setShowViewModal(false)} className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-red-50 hover:text-red-500 transition">
                <FiX size={20} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto bg-slate-50 flex-1">
              {loadingCourses ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A66C2]"></div>
                </div>
              ) : myCourses.length === 0 ? (
                <div className="text-center py-16">
                  <FiBookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-700">No courses yet</h3>
                  <p className="text-slate-500 mt-2">You haven't uploaded any courses. Create one to get started!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myCourses.map((course) => {
                    const lvl = levelMap[course.level] || levelMap[1];
                    const rating = safeRating(course.rating);

                    return (
                      <div key={course.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                        <div className="h-32 bg-gradient-to-br from-[#0A66C2] to-blue-800 p-6 flex flex-col justify-end relative overflow-hidden">
                          <span className="absolute top-3 right-3 text-[10px] font-bold tracking-wider uppercase text-white bg-black/20 px-2 py-1 rounded">
                            {course.videoFilePath ? "Video" : "Course"}
                          </span>
                          <h3 className="text-lg font-bold text-white line-clamp-2 leading-tight relative z-10">{course.name}</h3>
                        </div>
                        
                        <div className="p-5 flex flex-col gap-3">
                          <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px]">{course.description}</p>
                          <div className="flex items-center gap-1">
                            <FiStar className="text-amber-400 fill-amber-400" size={14} />
                            <span className="text-sm font-semibold text-slate-700">{rating}</span>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-1">
                            <span className={`text-[11px] font-semibold px-2 py-1 rounded border ${lvl.cls}`}>{lvl.label}</span>
                            <span className="text-xs font-medium text-slate-400">👥 {course.totalEnrolled || 0} Enrolled</span>
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

      {/* ── ADD COURSE MODAL ── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-white">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <FiVideo className="text-[#0A66C2]" /> Create New Course
              </h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-red-50 hover:text-red-500 transition">
                <FiX size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 bg-slate-50 p-8">
              <form id="add-course-form" onSubmit={handleAddCourseSubmit} className="space-y-8">
                
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4">Basic Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Course Name</label>
                    <input 
                      type="text" required value={courseDetails.name}
                      onChange={(e) => setCourseDetails({ ...courseDetails, name: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2] outline-none"
                      placeholder="e.g. Advanced Operating Systems"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea 
                      required rows={3} value={courseDetails.description}
                      onChange={(e) => setCourseDetails({ ...courseDetails, description: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2] outline-none resize-none"
                      placeholder="What will students learn?"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty Level</label>
                      <select 
                        value={courseDetails.level}
                        onChange={(e) => setCourseDetails({ ...courseDetails, level: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2] outline-none bg-white"
                      >
                        <option value={1}>Beginner (1)</option>
                        <option value={2}>Intermediate (2)</option>
                        <option value={3}>Advanced (3)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Timestamps (Seconds)</label>
                      <input 
                        type="text" required value={courseDetails.timeStamps}
                        onChange={(e) => setCourseDetails({ ...courseDetails, timeStamps: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0A66C2] outline-none"
                        placeholder="e.g. 101, 2022, 3300"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2 mb-4">Material Upload</h3>
                  <input 
                    type="file" required
                    onChange={(e) => setVidFile(e.target.files[0])}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#0A66C2] hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
                    <h3 className="font-semibold text-slate-800">Quiz Questions (Min 4)</h3>
                    <button type="button" onClick={addQuestion} className="text-sm text-[#0A66C2] font-medium hover:underline flex items-center gap-1">
                      <FiPlus /> Add Question
                    </button>
                  </div>

                  {questions.map((q, index) => (
                    <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group">
                      
                      {questions.length > 4 && (
                        <button type="button" onClick={() => removeQuestion(index)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition">
                          <FiTrash2 />
                        </button>
                      )}
                      
                      <div className="mb-3 pr-6">
                        <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Question {index + 1}</label>
                        <input 
                          type="text" required value={q.question} placeholder="Enter your question here..."
                          onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-[#0A66C2] outline-none text-sm"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Option 1</label>
                          <input 
                            type="text" required value={q.option1} placeholder="First answer"
                            onChange={(e) => handleQuestionChange(index, "option1", e.target.value)}
                            className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-2 focus:ring-[#0A66C2] outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">Option 2</label>
                          <input 
                            type="text" required value={q.option2} placeholder="Second answer"
                            onChange={(e) => handleQuestionChange(index, "option2", e.target.value)}
                            className="w-full px-3 py-1.5 border border-slate-300 rounded focus:ring-2 focus:ring-[#0A66C2] outline-none text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Correct Answer</label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                            <input 
                              type="radio" name={`correct-${index}`} value={1} checked={q.correctAnswer === 1}
                              onChange={() => handleQuestionChange(index, "correctAnswer", 1)}
                              className="accent-[#0A66C2] w-4 h-4"
                            /> Option 1
                          </label>
                          <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                            <input 
                              type="radio" name={`correct-${index}`} value={2} checked={q.correctAnswer === 2}
                              onChange={() => handleQuestionChange(index, "correctAnswer", 2)}
                              className="accent-[#0A66C2] w-4 h-4"
                            /> Option 2
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </form>
            </div>

            <div className="px-8 py-5 border-t border-slate-100 bg-white flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button 
                form="add-course-form" 
                type="submit" 
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-lg bg-[#0A66C2] text-white font-medium hover:bg-[#084e8a] transition disabled:opacity-70 flex items-center gap-2"
              >
                {isSubmitting ? "Uploading..." : "Publish Course"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default TeacherDashboard;