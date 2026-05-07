import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLogOut, FiLayout, FiBookOpen } from "react-icons/fi";
import { getTeacherData, logoutTeacher } from "../localstorage";

const TeacherNavbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [teacherData, setTeacherData] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setTeacherData(getTeacherData());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutTeacher();
    navigate("/teacher");
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* LOGO */}
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/teacher/home")}
        >
          <div className="bg-slate-900 text-white p-1.5 rounded-lg">
            <FiLayout size={20} />
          </div>
          <span className="font-bold text-slate-900 text-xl tracking-tight">Teacher<span className="text-slate-500 font-medium">Panel</span></span>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-1 text-slate-600 text-sm font-medium">
            <FiBookOpen className="text-slate-400" />
            <span>Instructor Dashboard</span>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-50 transition border border-transparent hover:border-slate-100"
            >
              <div className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center rounded-full text-xs font-bold">
                {teacherData?.name?.charAt(0)}
              </div>
              <span className="hidden sm:block text-sm font-semibold text-slate-700">{teacherData?.name}</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-50 mb-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Teacher Account</p>
                  <p className="text-sm font-bold text-slate-800 truncate">{teacherData?.email}</p>
                </div>
                
                <button
                  onClick={() => { setShowDropdown(false); navigate("/teacher/home"); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition"
                >
                  <FiUser className="text-slate-400" />
                  Dashboard
                </button>

                <div className="my-1 border-t border-slate-50"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition font-medium"
                >
                  <FiLogOut className="text-red-400" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TeacherNavbar;