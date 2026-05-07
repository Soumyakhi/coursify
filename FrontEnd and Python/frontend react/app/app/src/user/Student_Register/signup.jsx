import { useState } from "react";
import { FiEye, FiEyeOff, FiX } from "react-icons/fi";
import { student_signup, student_signup_with_resume } from "../../service/student/auth";
import CustomAlert from "../../alert/customalert";
import "./StudentSignup.css";

const skillOptions = [
    "React", "Java", "Python", "Spring Boot", "Node.js",
    "Flutter", "Firebase", "Docker", "Kubernetes", "C++",
    "Figma", "FastAPI", "Flask", "GraphQL", "Git"
];

export default function StudentSignup({ setShowSignup, setShowLogin }) {
    const [signupMode, setSignupMode] = useState("normal");
    const [resume, setResume] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
        description: "",
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [skillTouched, setSkillTouched] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [skillInput, setSkillInput] = useState("");
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [alert, setAlert] = useState({ type: "", message: "" });

    const resetForm = () => {
        setFormData({
            name: "",
            phoneNumber: "",
            email: "",
            password: "",
            confirmPassword: "",
            description: "",
        });

        setErrors({});
        setTouched({});
        setSelectedSkills([]);
        setSkillInput("");
        setSkillTouched(false);
        setResume(null);
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    // Filter skills for autocomplete
    const filteredSkills = skillOptions.filter(
        (skill) =>
            skill.toLowerCase().startsWith(skillInput.toLowerCase()) &&
            !selectedSkills.includes(skill)
    );

    const addSkill = (skill) => {
        const trimmed = skill.trim();
        if (!trimmed) return;
        if (selectedSkills.includes(trimmed)) return;
        setSelectedSkills((prev) => [...prev, trimmed]);
        setSkillInput("");
        setSkillTouched(true);
    };

    // Validation logic
    const validateField = (name, value, updatedForm = formData) => {
        switch (name) {
            case "name": return value ? "" : "Name is required";
            case "phoneNumber": return /^[0-9]{10}$/.test(value) ? "" : "Enter valid 10 digit phone";
            case "email": return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Invalid email";
            case "password":
                if (!value) return "Password is required";
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{6,}$/.test(value)
                    ? "" : "Password must have uppercase, lowercase, number & special character";
            case "confirmPassword": return value === updatedForm.password ? "" : "Passwords do not match";
            case "description": return value.length >= 10 ? "" : "Min 10 characters required";
            default: return "";
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedForm = { ...formData, [name]: value };
        setFormData(updatedForm);

        // mark field as touched so validation shows live
        setTouched((prev) => ({ ...prev, [name]: true }));

        // validate this field
        let newErrors = { ...errors };
        newErrors[name] = validateField(name, value, updatedForm);

        // re-validate confirmPassword if password changes
        if (name === "password") {
            newErrors.confirmPassword =
                updatedForm.confirmPassword === value ? "" : "Passwords do not match";
        }

        setErrors(newErrors);
    };

    const handleBlur = (e) => setTouched({ ...touched, [e.target.name]: true });

    // Check form validity
    const isFormValid =
        Object.values(errors).every((e) => e === "") &&
        Object.values(formData).every((v) => v !== "") &&
        selectedSkills.length > 0;

    const isResumeFormValid =
        formData.email &&
        formData.password &&
        formData.confirmPassword &&
        resume &&
        formData.password === formData.confirmPassword &&
        !errors.password &&
        !errors.confirmPassword;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        student_signup({ ...formData, skills: selectedSkills })
            .then(() => {
                setAlert({ type: "success", message: "Signup successful" });
                setTimeout(() => { setShowSignup(false); setShowLogin(true); }, 1000);
            })
            .catch((error) => {
                setAlert({ type: "error", message: error?.response?.data?.message || "Invalid credentials" });
            });
    };

    return (
        <div className="student-signup-container">

            <CustomAlert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert({ type: "", message: "" })}
            />

            <div className="header">
                <h1>Build Your Profile</h1>
                <p>Connect your skills with real opportunities</p>
            </div>

            <div className="toggle-btns">
                <button
                    type="button"
                    onClick={() => { setSignupMode("normal"); resetForm() }}
                    className={signupMode === "normal" ? "active" : "inactive"}>
                    Normal Signup
                </button>
                <button
                    type="button"
                    onClick={() => { setSignupMode("resume"); resetForm() }}
                    className={signupMode === "resume" ? "active" : "inactive"}>
                    Signup with Resume
                </button>
            </div>

            {/* NORMAL SIGNUP FORM */}
            {signupMode === "normal" && (
                <form onSubmit={handleSubmit} className="form-layout">

                    <input
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`input ${errors.name && touched.name ? "input-error" : ""}`}
                    />

                    <input
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`input ${errors.phoneNumber && touched.phoneNumber ? "input-error" : ""}`}
                    />

                    <input
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`input ${errors.email && touched.email ? "input-error" : ""}`}
                    />

                    {/* Skills */}
                    <div className="relative">
                        <input
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onBlur={() => setSkillTouched(true)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addSkill(skillInput);
                                }
                            }}
                            placeholder={selectedSkills.length === 0 ? "Select at least one skill..." : "Search skills..."}
                            className={`input ${selectedSkills.length === 0 && skillTouched ? "input-error" : ""}`}
                        />
                        {skillInput && (
                            <div className="dropdown">
                                {filteredSkills.slice(0, 5).map((skill, i) => (
                                    <div
                                        key={i}
                                        onClick={() => addSkill(skill)}
                                        className="dropdown-item"
                                    >
                                        {skill}
                                    </div>
                                ))}
                                {filteredSkills.length === 0 && skillInput.trim() !== "" && !selectedSkills.includes(skillInput.trim()) && (
                                    <div
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => addSkill(skillInput)}
                                        className="dropdown-item"
                                    >
                                        Add "{skillInput.trim()}"
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedSkills.map((skill, i) => (
                                <span key={i} className="skill-tag">{skill} <FiX onClick={() => setSelectedSkills(selectedSkills.filter(s => s !== skill))} /></span>
                            ))}
                        </div>
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`input pr-10 ${errors.password && touched.password ? "input-error" : ""}`}
                        />
                        <span onClick={() => setShowPassword(!showPassword)} className="icon">
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </span>
                        {touched.password && errors.password && <p className="error">{errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`input pr-10 ${errors.confirmPassword && touched.confirmPassword ? "input-error" : ""}`}
                        />
                        <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="icon">
                            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </span>
                        {touched.confirmPassword && errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                    </div>

                    <textarea
                        name="description"
                        placeholder="Tell us about yourself..."
                        value={formData.description}
                        onChange={handleChange}
                        className="input"
                    />

                    <button type="submit" disabled={!isFormValid} className={`btn-primary ${!isFormValid ? "btn-disabled" : ""}`}>
                        Create Account
                    </button>
                </form>
            )}

            {/* RESUME SIGNUP FORM */}
            {signupMode === "resume" && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!isResumeFormValid) {
                            setAlert({ type: "error", message: "Please fill all fields correctly and upload resume" });
                            return;
                        }

                        const fd = new FormData();
                        fd.append("email", formData.email);
                        fd.append("password", formData.password);
                        fd.append("file", resume);

                        student_signup_with_resume(fd)
                            .then(() => {
                                setAlert({ type: "success", message: "Signup successful" });
                                setTimeout(() => { setShowSignup(false); setShowLogin(true); }, 1000);
                            })
                            .catch(() => { setAlert({ type: "error", message: "Signup failed" }); });
                    }}
                    className="form-layout"
                >
                    <input
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`input ${errors.email ? "input-error" : ""}`}
                    />

                    {/* Password */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`input pr-10 ${errors.password ? "input-error" : ""}`}
                        />
                        <span onClick={() => setShowPassword(!showPassword)} className="icon">
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </span>
                        {errors.password && <p className="error">{errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`input pr-10 ${errors.confirmPassword ? "input-error" : ""}`}
                        />
                        <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="icon">
                            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </span>
                        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                    </div>

                    {/* Resume Upload */}
                    <label className={`file-input-label ${resume ? "file-selected" : "file-unselected"}`}>
                        {resume ? resume.name : "Choose your resume (PDF)"}
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setResume(e.target.files[0])}
                            className="file-input"
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={!isResumeFormValid}
                        className={`btn-primary w-full ${!isResumeFormValid ? "btn-disabled" : ""}`}
                    >
                        Signup with Resume
                    </button>
                </form>
            )}

            <p className="text-center text-sm text-gray-500 mt-4">
                Already have an account?{" "}
                <span
                    onClick={() => {
                        setShowSignup(false);
                        setShowLogin(true);
                    }}
                    className="text-[#0A66C2] cursor-pointer font-semibold hover:underline"
                >
                    Sign in
                </span>
            </p>

        </div>
    );
}