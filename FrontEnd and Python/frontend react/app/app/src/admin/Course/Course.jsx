import { useState } from "react";
import { courses as dummyCourses } from "../../dumy_data/course_data";
import Navbar from "../Home/navbar";
import { FaVideo, FaPlus, FaTimes, FaQuestionCircle } from "react-icons/fa";
import Addcourse from "./Addcourse";
import Coursecard from "./Coursecard";

const emptyQuestion = () => ({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctAnswer: 1,
});

const Course = () => {
    const [courses, setCourses] = useState(dummyCourses);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);


    const [newCourse, setNewCourse] = useState({
        name: "",
        description: "",
        rating: "0.0",
        videoFile: null,
        videoFilePath: "",
        videoFilePathLq: "",
        questions: [],
    });

    const handleAddCourse = (e) => {
        e.preventDefault();

        const coursePayload = {
            name: newCourse.name,
            description: newCourse.description,
            rating: newCourse.rating,
            questions: newCourse.questions.map((q) => ({
                question: q.question,
                option1: q.option1,
                option2: q.option2,
                option3: q.option3,
                option4: q.option4,
                correctAnswer: q.correctAnswer,
            })),
        };

        const formData = new FormData();
        formData.append("course", JSON.stringify(coursePayload));
        formData.append("material", newCourse.videoFile);

        console.log("----- FORM DATA -----");
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        setNewCourse({
            name: "",
            description: "",
            rating: "0.0",
            videoFile: null,
            videoFilePath: "",
            videoFilePathLq: "",
            questions: [],
        });

        setIsAddOpen(false);
    };

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== "video/mp4") {
            alert("Only MP4 videos are allowed");
            e.target.value = "";
            return;
        }

        setNewCourse({
            ...newCourse,
            videoFile: file,
            videoFilePath: URL.createObjectURL(file),
            videoFilePathLq: URL.createObjectURL(file),
        });
    };


    const addQuestion = () => {
        setNewCourse({
            ...newCourse,
            questions: [...newCourse.questions, emptyQuestion()],
        });
    };

    const removeQuestion = (i) => {
        const updated = [...newCourse.questions];
        updated.splice(i, 1);
        setNewCourse({ ...newCourse, questions: updated });
    };

    const updateQuestion = (i, field, value) => {
        const updated = [...newCourse.questions];
        updated[i][field] = value;
        setNewCourse({ ...newCourse, questions: updated });
    };


    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="p-6 sm:p-8">
                <div className="flex justify-between mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold">Courses</h1>
                    <button onClick={() => setIsAddOpen(true)} className="bg-[#0A66C2] text-white px-4 py-2 rounded flex items-center gap-2">
                        <FaPlus /> Add Course
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((c) => (
                        <div key={c.id} onClick={() => setSelectedCourse(c)} className="bg-white p-4 cursor-pointer sm:p-5 md:p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-base sm:text-lg text-gray-800">
                                    {c.name}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-3">
                                    {c.description}
                                </p>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-3 text-xs sm:text-sm text-gray-700 font-medium">
                                <div className="flex items-center gap-1">
                                    <FaVideo className="text-[#0A66C2]" />
                                    {c.videoFilePath ? "1 Video" : "No Video"}
                                </div>

                                <div className="flex items-center gap-1">
                                    <FaQuestionCircle className="text-[#0A66C2]" />
                                    {c.questions.length} Questions
                                </div>

                                <div className="flex items-center gap-1 text-yellow-500 font-bold">
                                    ⭐ {c.rating}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isAddOpen && (
                <Addcourse setIsAddOpen={setIsAddOpen} handleAddCourse={handleAddCourse} newCourse={newCourse} setNewCourse={setNewCourse} addQuestion={addQuestion} handleVideoUpload={handleVideoUpload} updateQuestion={updateQuestion} removeQuestion={removeQuestion} />
            )}

            {selectedCourse && (
                <Coursecard selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} />
            )}

        </div>
    );
};

export default Course;





