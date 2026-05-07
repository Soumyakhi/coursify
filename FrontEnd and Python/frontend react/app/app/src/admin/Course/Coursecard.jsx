import { FaTimes } from "react-icons/fa";
import Videoplayer from "./Videoplayer";

const Coursecard = ({ selectedCourse, setSelectedCourse }) => {
    return (
        <>
            <div className="fixed inset-0 bg-black/40 z-40"></div>

            <div className="fixed top-1/2 left-1/2 bg-white p-6 w-[500px] max-h-[90vh] overflow-y-auto 
      -translate-x-1/2 -translate-y-1/2 rounded z-50">

                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold">
                        {selectedCourse.name}
                    </h2>
                    <FaTimes
                        className="cursor-pointer text-red-500"
                        onClick={() => setSelectedCourse(null)}
                    />
                </div>

                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">Video</h2>
                    <Videoplayer
                        videoHQ={selectedCourse.videoFilePath}
                        videoLQ={selectedCourse.videoFilePathLq}
                    />
                </div>
                <h2 className="text-xl font-bold mb-4">Questions</h2>
                {selectedCourse.questions.length === 0 ? (
                    <p className="text-gray-500 text-center">No questions added</p>
                ) : (
                    <div className="space-y-4">
                        {selectedCourse.questions.map((q, i) => (
                            <div key={i} className="border p-4 rounded bg-gray-50">
                                <p className="font-semibold mb-2">
                                    Q{i + 1}. {q.question}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                    {["option1", "option2", "option3", "option4"].map((opt, idx) => (
                                        <div
                                            key={idx}
                                            className={`p-2 rounded border ${q.correctAnswer === idx + 1
                                                ? "bg-green-100 border-green-500 font-semibold"
                                                : "bg-white"
                                                }`}
                                        >
                                            {q[opt]}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default Coursecard;
