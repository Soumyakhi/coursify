import { FaTimes, FaVideo } from "react-icons/fa"

const Addcourse = ({ setIsAddOpen, handleAddCourse, newCourse, setNewCourse, addQuestion, handleVideoUpload,updateQuestion,removeQuestion }) => {
    return (
        <>
            <div className="fixed inset-0 bg-black/40"></div>

            <div className="fixed top-1/2 left-1/2 bg-white p-6 w-[420px] max-h-[90vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold">Add Course</h2>
                    <FaTimes
                        className="cursor-pointer text-red-500"
                        onClick={() => setIsAddOpen(false)}
                    />
                </div>

                <form onSubmit={handleAddCourse} className="space-y-3">
                    <input placeholder="Course Name" className="border p-2 w-full" value={newCourse.name} onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })} required />

                    <textarea placeholder="Description" className="border p-2 w-full" value={newCourse.description} onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} required />

                    <label className={`flex items-center justify-center gap-3 w-full cursor-pointer border-2 border-dashed rounded-lg p-4 font-medium transition ${newCourse.videoFile
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-[#0A66C2] text-[#0A66C2] hover:bg-blue-50"
                        }`}>
                        {newCourse.videoFile ? (
                            <>
                                <FaVideo className="text-lg text-green-600" />
                                <span className="truncate max-w-[220px]">
                                    {newCourse.videoFile.name}
                                </span>
                                <span className="text-sm font-semibold">(Selected)</span>
                            </>
                        ) : (
                            <>
                                <FaVideo className="text-lg" />
                                <span>Select Video</span>
                            </>
                        )}

                        <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                    </label>



                    {newCourse.questions.map((q, i) => (
                        <div key={i} className="border p-6 rounded relative">
                            <FaTimes className="absolute top-1.5 right-1.5 cursor-pointer text-red-500" onClick={() => removeQuestion(i)} />

                            <input placeholder="Question" className="border p-2 w-full mb-2" value={q.question} onChange={(e) => updateQuestion(i, "question", e.target.value)} />

                            {["option1", "option2", "option3", "option4"].map((opt, idx) => (
                                <input key={idx} placeholder={`Option ${idx + 1}`} className="border p-2 w-full mb-2" value={q[opt]} onChange={(e) => updateQuestion(i, opt, e.target.value)} />
                            ))}

                            <select className="border p-2 w-full" value={q.correctAnswer} onChange={(e) => updateQuestion(i, "correctAnswer", Number(e.target.value))}>
                                <option value={1}>Correct Option 1</option>
                                <option value={2}>Correct Option 2</option>
                                <option value={3}>Correct Option 3</option>
                                <option value={4}>Correct Option 4</option>
                            </select>
                        </div>
                    ))}

                    <button type="button" onClick={addQuestion} className="text-[#0A66C2]">
                        + Add Question
                    </button>

                    <button className="w-full bg-[#0A66C2] text-white py-2 rounded">
                        Add Course
                    </button>
                </form>
            </div>
        </>
    )
}

export default Addcourse
