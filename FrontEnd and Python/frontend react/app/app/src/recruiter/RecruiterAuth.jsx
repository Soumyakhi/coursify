import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBriefcase, FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import Swal from "sweetalert2";
import { recruiter_login, recruiter_signup } from "../service/recruiter/auth";
import { loginRecruiter } from "../localstorage";

const RecruiterAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const data = await recruiter_login(form.email, form.password);
        loginRecruiter(data);
        navigate("/recruiter/home");
      } else {
        await recruiter_signup(form.name, form.email, form.password, form.companyName);
        Swal.fire({
          icon: "success",
          title: "Account Created!",
          text: "You can now log in with your credentials.",
          confirmButtonColor: "#0A66C2",
        });
        setIsLogin(true);
        setForm({ name: "", email: "", password: "", companyName: "" });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: isLogin ? "Login Failed" : "Signup Failed",
        text: error?.response?.data?.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#0A66C2",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

      {/* Back to Student Portal — same position as TeacherPortal */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-slate-500 hover:text-[#0A66C2] font-medium text-sm transition"
      >
        &larr; Back to Student Portal
      </button>

      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <FiBriefcase size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Recruiter<span className="text-slate-400 font-medium">Portal</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isLogin ? "Sign in to your recruiter account" : "Create a new recruiter account"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">

          {/* Tab Toggle */}
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                isLogin
                  ? "text-[#0A66C2] border-b-2 border-[#0A66C2] bg-blue-50/40"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 text-sm font-semibold transition-colors ${
                !isLogin
                  ? "text-[#0A66C2] border-b-2 border-[#0A66C2] bg-blue-50/40"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text" name="name" required value={form.name} onChange={handleChange}
                    placeholder="e.g. Soumyajit Kundu"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] outline-none text-sm transition"
                  />
                </div>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name</label>
                <div className="relative">
                  <FiBriefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text" name="companyName" required value={form.companyName} onChange={handleChange}
                    placeholder="e.g. LtiMindTree"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] outline-none text-sm transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email" name="email" required value={form.email} onChange={handleChange}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] outline-none text-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type={showPassword ? "text" : "password"} name="password" required
                  value={form.password} onChange={handleChange} placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0A66C2] focus:border-[#0A66C2] outline-none text-sm transition"
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={isLoading}
              className="w-full mt-2 bg-[#0A66C2] hover:bg-[#084e8a] disabled:opacity-70 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <FiArrowRight size={16} />
                </>
              )}
            </button>

          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Recruiter access only. Students &amp; Teachers have separate portals.
        </p>

      </div>
    </div>
  );
};

export default RecruiterAuth;