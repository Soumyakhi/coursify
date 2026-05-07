import { useState } from "react";
import { FiMail, FiPhone, FiUser, FiEdit2, FiSave, FiX } from "react-icons/fi";
import { edit_student_data } from "../../service/student/auth";
import { updateUserData } from "../../localstorage";

export default function StudentProfile({ userData, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(userData?.description || "");
  const [skills, setSkills] = useState(userData?.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);

  if (!userData) return null;

  // ➕ Add skill
  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  // ❌ Remove skill
  const handleRemoveSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  // 💾 Save changes (API call)
  const handleSave = async () => {
    try {
      setLoading(true);

      // ✅ remove sensitive fields
      const { password, token, ...rest } = userData || {};

      const payload = {
        ...rest,
        description,
        skills,
      };

      const res = await edit_student_data(payload);
      console.log("Updated response:", res);

      // ✅ Update UI instantly
      userData.description = description;
      userData.skills = skills;

      updateUserData({ description, skills });

      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
      alert(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        {/* HEADER */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-[#0A66C2] to-blue-400 text-white flex items-center justify-center rounded-full text-2xl font-bold shadow-md">
            {userData?.name?.charAt(0)?.toUpperCase()}
          </div>

          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            {userData?.name}
          </h2>

          <p className="text-sm text-gray-500">{userData?.email}</p>
        </div>

        {/* DETAILS */}
        <div className="space-y-4 text-sm text-gray-700">

          <div className="flex items-center gap-3">
            <FiMail className="text-[#0A66C2]" />
            <span>{userData?.email}</span>
          </div>

          <div className="flex items-center gap-3">
            <FiPhone className="text-[#0A66C2]" />
            <span>{userData?.phoneNumber}</span>
          </div>

          {/* DESCRIPTION */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <FiUser className="text-[#0A66C2]" />
              <span className="font-medium">About</span>
            </div>

            {isEditing ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
              />
            ) : (
              <p className="text-gray-600 text-sm">
                {description || "No description added"}
              </p>
            )}
          </div>

          {/* SKILLS */}
          <div>
            <p className="font-medium mb-2">Skills</p>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-[#0A66C2] text-xs rounded-full"
                >
                  {skill}

                  {isEditing && (
                    <FiX
                      className="cursor-pointer hover:text-red-500"
                      onClick={() => handleRemoveSkill(skill)}
                    />
                  )}
                </span>
              ))}
            </div>

            {/* Add Skill */}
            {isEditing && (
              <div className="flex gap-2 mt-3">
                <input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add skill..."
                  className="flex-1 border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                />
                <button
                  onClick={handleAddSkill}
                  className="bg-[#0A66C2] text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ACTION BUTTON */}
        <div className="mt-6">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full flex items-center justify-center gap-2 bg-[#0A66C2] text-white py-2 rounded-xl font-medium hover:bg-blue-700 transition"
            >
              <FiEdit2 />
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl font-medium transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              <FiSave />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}