import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { student_login } from "../../service/student/auth";
import { login } from "../../localstorage";
import CustomAlert from "../../alert/customalert";

export default function StudentLogin({ setShowLogin,setShowSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    student_login({ email, password })
      .then((data) => {
        login(data);
        setAlert({
          type: "success",
          message: "Login successful",
        });

        setTimeout(() => {
          setShowLogin(false);
          window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        setAlert({
          type: "error",
          message:
            err?.response?.data?.message ||
            "Invalid email or password",
        });
      });
  };

  return (
    <div>

      {/* 🔥 ALERT */}
      <CustomAlert
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: "", message: "" })}
      />

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-[#0A66C2]">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Sign in to continue learning
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Email */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Email address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
            placeholder="student@example.com"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block text-sm text-gray-600 mb-1">
            Password
          </label>

          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A66C2] pr-10"
            placeholder="••••••••"
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 cursor-pointer text-[#0A66C2]"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </span>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-[#0A66C2] text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
        >
          Sign In
        </button>
      </form>

       <p className="text-center text-sm text-gray-500 mt-4">
        Not registered yet?{" "}
        <span
          onClick={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
          className="text-[#0A66C2] cursor-pointer font-semibold hover:underline"
        >
          Register here
        </span>
      </p>

      <p className="text-center text-xs text-gray-400 mt-6">
        © 2026 Student Portal
      </p>
    </div>
  );
}