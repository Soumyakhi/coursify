import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { teacher_login, teacher_signup } from "../service/teacher/auth";
import { loginTeacher } from "../localstorage";
import { 
  Mail, 
  Lock, 
  User, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Loader2, 
  GraduationCap, 
  LogIn, 
  UserPlus 
} from "lucide-react";

const TeacherPortal = () => {
  const navigate = useNavigate();

  // State
  const [isLoginView, setIsLoginView] = useState(true);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handlers
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const toggleView = (view) => {
    setIsLoginView(view === 'login');
    setMessage({ type: "", text: "" }); // Clear messages on switch
    setShowPassword(false); // Reset password visibility
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    try {
      const data = await teacher_login(loginData);
      // Saves specifically to 'teacher_data' in localStorage
      loginTeacher(data);
      setMessage({ type: "success", text: "Teacher login successful." });
      navigate("/teacher/home");
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.response?.data?.message || error?.message || "Teacher login failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    try {
      await teacher_signup(signupData);
      setMessage({ type: "success", text: "Signup successful. You can now log in." });
      setIsLoginView(true); // Switch to login view after successful signup
      setSignupData({ name: "", email: "", password: "" }); // Clear form
      setShowPassword(false);
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.response?.data?.message || error?.message || "Signup failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative">
      {/* Back to Student Portal Button */}
      <button 
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-[#0A66C2] font-medium text-sm transition group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Student Portal
      </button>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header / Tabs */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => toggleView('login')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 text-center font-semibold text-sm transition ${
              isLoginView 
                ? "bg-white text-[#0A66C2] border-b-2 border-[#0A66C2]" 
                : "bg-slate-50 text-slate-500 hover:bg-slate-100"
            }`}
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </button>
          <button
            onClick={() => toggleView('signup')}
            className={`flex-1 py-4 flex items-center justify-center gap-2 text-center font-semibold text-sm transition ${
              !isLoginView 
                ? "bg-white text-[#0A66C2] border-b-2 border-[#0A66C2]" 
                : "bg-slate-50 text-slate-500 hover:bg-slate-100"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Create Account
          </button>
        </div>

        <div className="p-8">
          <div className="mb-8 text-center flex flex-col items-center">
            <div className="bg-blue-50 p-3 rounded-full mb-3 text-[#0A66C2]">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">
              {isLoginView ? "Welcome Back" : "Join as a Teacher"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {isLoginView 
                ? "Sign in to access your instructor dashboard." 
                : "Create an account to start managing courses."}
            </p>
          </div>

          {/* Alert Message */}
          {message.text && (
            <div className={`p-4 mb-6 rounded-xl text-sm font-medium flex items-start gap-2 ${
              message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'
            }`}>
              {message.text}
            </div>
          )}

          {/* ---------------- LOGIN FORM ---------------- */}
          {isLoginView ? (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] outline-none transition"
                    placeholder="teacher@school.edu"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                    className="w-full pl-10 pr-12 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] outline-none transition"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 bg-[#0A66C2] text-white font-semibold py-3 rounded-xl hover:bg-[#084e8a] transition shadow-md shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          ) : (
            /* ---------------- SIGNUP FORM ---------------- */
            <form onSubmit={handleSignupSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={signupData.name}
                    onChange={handleSignupChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] outline-none transition"
                    placeholder="Dr. Jane Smith"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] outline-none transition"
                    placeholder="teacher@school.edu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    required
                    className="w-full pl-10 pr-12 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A66C2]/20 focus:border-[#0A66C2] outline-none transition"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 bg-[#0A66C2] text-white font-semibold py-3 rounded-xl hover:bg-[#084e8a] transition shadow-md shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default TeacherPortal;