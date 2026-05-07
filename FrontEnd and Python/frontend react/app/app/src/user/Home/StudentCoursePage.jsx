import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Hls from "hls.js";
import { enroll_course, fetch_course_student, rate_course, start_exam, submit_exam } from "../../service/student/course";
import { BASE_URL } from "../../service/helper";
import { getUserData } from "../../localstorage";
import { 
  FiArrowLeft, 
  FiPlay, 
  FiPause, 
  FiVolume2, 
  FiVolumeX, 
  FiRewind,
  FiFastForward
} from "react-icons/fi";

const StudentCoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [overallRating, setOverallRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ratingValue, setRatingValue] = useState("5");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [quality, setQuality] = useState("1080p");

  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const savedTimeRef = useRef(0);
  const wasPlayingRef = useRef(false);
  const containerRef = useRef(null);
  const examSectionRef = useRef(null);
  const autoSubmitTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const examAnswersRef = useRef([]);
  const playbackRateRef = useRef(1);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [examData, setExamData] = useState(null);
  const [examAnswers, setExamAnswers] = useState([]);
  const [examLoading, setExamLoading] = useState(false);
  const [examError, setExamError] = useState("");
  const [examResult, setExamResult] = useState(null);
  const [examCompleted, setExamCompleted] = useState(false);
  const [examTimeLeft, setExamTimeLeft] = useState(20);

  const formatTime = (time) => {
    const s = Math.floor(time || 0);
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  };

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const on = (e, fn) => video.addEventListener(e, fn);
    const off = (e, fn) => video.removeEventListener(e, fn);

    const handlePlay = () => { setIsPlaying(true); };
    const handlePause = () => { setIsPlaying(false); };
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime || 0);
      savedTimeRef.current = video.currentTime || 0;
    };
    const handleDuration = () => setDuration(video.duration || 0);
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handleVolumeChange = () => { setVolume(video.volume); setIsMuted(video.muted); };

    on("play", handlePlay);
    on("pause", handlePause);
    on("timeupdate", handleTimeUpdate);
    on("durationchange", handleDuration);
    on("loadedmetadata", handleDuration);
    on("waiting", handleWaiting);
    on("playing", handlePlaying);
    on("volumechange", handleVolumeChange);

    return () => {
      off("play", handlePlay);
      off("pause", handlePause);
      off("timeupdate", handleTimeUpdate);
      off("durationchange", handleDuration);
      off("loadedmetadata", handleDuration);
      off("waiting", handleWaiting);
      off("playing", handlePlaying);
      off("volumechange", handleVolumeChange);
    };
  }, [isEnrolled, course]); 

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.paused ? video.play().catch(() => {}) : video.pause();
  };

  const seekVideo = (amount) => {
    const video = videoRef.current;
    if (!video) return;
    let newTime = video.currentTime + amount;
    if (newTime < 0) newTime = 0;
    if (video.duration && newTime > video.duration) newTime = video.duration;
    video.currentTime = newTime;
  };

  const togglePlaybackRate = () => {
    const video = videoRef.current;
    if (!video) return;
    const newRate = playbackRate === 1 ? 1.5 : 1;
    video.playbackRate = newRate;
    setPlaybackRate(newRate);
    playbackRateRef.current = newRate;
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
      if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'ArrowRight') seekVideo(5);
        if (e.key === 'ArrowLeft') seekVideo(-5);
        if (e.key === ' ') togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleProgressChange = (e) => {
    const video = videoRef.current;
    if (!video) return;
    const val = Number(e.target.value);
    video.currentTime = val;
    setCurrentTime(val);
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    if (!video) return;
    const val = Number(e.target.value);
    video.volume = val;
    video.muted = val === 0;
    setVolume(val);
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleQualityChange = (q) => {
    if (videoRef.current) {
      savedTimeRef.current = videoRef.current.currentTime || 0;
      wasPlayingRef.current = !videoRef.current.paused;
    }
    setQuality(q);
  };

  // Fetch course
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch_course_student(courseId);
        const normalizedCourse = {
          ...res,
          videoFilePath: res.videoFilePath ?? res.videoFIle,
          overallRating: res.overAllRating ?? res.overallRating ?? res.averageRating ?? res.rating ?? null,
        };
        setCourse(normalizedCourse);
        setOverallRating(normalizedCourse.overallRating);
        setIsEnrolled(Boolean(normalizedCourse?.enrolled));
        if (normalizedCourse?.rating != null) setRatingValue(String(normalizedCourse.rating));
      } catch (err) {
        console.error(err);
        setError("Unable to load course details.");
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchCourse();
  }, [courseId]);

  const displayedOverallRating = overallRating != null ? parseFloat(overallRating).toFixed(1) : null;
  const yourRatingText = course?.rating != null ? `Your rating: ${course.rating} / 5` : "You haven't rated this course yet.";

  const handleEnroll = async () => {
    try {
      setLoading(true);
      await enroll_course(courseId);
      setIsEnrolled(true);
      setCourse((prev) => (prev ? { ...prev, enrolled: true } : prev));
      window.location.reload();
    } catch (err) {
      setError("Unable to enroll in the course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scrollToExamSection = () => {
    examSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const submitExamNow = async (force = false) => {
    if (!examData) return;
    const answersToSend = examAnswersRef.current;
    if (!force && answersToSend.some((item) => item.answer == null)) {
      setExamError("Please answer all questions before submitting.");
      return;
    }

    setExamLoading(true);
    setExamError("");
    try {
      const payload = {
        examVal: examData.examVal,
        courseId,
        answers: answersToSend.map((item) => ({
          index: item.index,
          answer: item.answer != null ? item.answer : 0,
        })),
      };
      const response = await submit_exam(payload);
      setExamResult(response);
      setExamCompleted(true);
      setExamData(null);
      window.location.reload();
    } catch (err) {
      console.error(err);
      setExamError("Unable to submit the exam. Please try again.");
    } finally {
      setExamLoading(false);
    }
  };

  const handleStartExam = async () => {
    setExamLoading(true);
    setExamError("");
    try {
      const response = await start_exam(courseId);
      const initialAnswers = response.indexes.map((index) => ({ index, answer: null }));
      setExamData(response);
      setExamAnswers(initialAnswers);
      examAnswersRef.current = initialAnswers;
      setExamResult(null);
      setExamCompleted(false);
    } catch (err) {
      console.error(err);
      setExamError("Unable to start the exam. Please try again.");
    } finally {
      setExamLoading(false);
    }
  };

  const updateExamAnswer = (position, selectedAnswer) => {
    setExamAnswers((prev) => {
      const next = prev.map((item, idx) => (
        idx === position ? { ...item, answer: selectedAnswer } : item
      ));
      examAnswersRef.current = next;
      return next;
    });
  };

  const handleSubmitExam = async () => {
    await submitExamNow(false);
  };

  useEffect(() => {
    if (!examData) {
      clearTimeout(autoSubmitTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      setExamTimeLeft(20);
      return;
    }

    scrollToExamSection();
    setExamTimeLeft(20);
    clearTimeout(autoSubmitTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    countdownIntervalRef.current = window.setInterval(() => {
      setExamTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    autoSubmitTimerRef.current = window.setTimeout(() => {
      submitExamNow(true);
    }, 20000);

    return () => {
      clearTimeout(autoSubmitTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [examData]);

  const handleSubmitRating = async () => {
    try {
      setLoading(true);
      const response = await rate_course(courseId, Number(ratingValue));
      setCourse((prev) => ({ ...prev, rating: ratingValue }));
      setOverallRating((prev) => response?.overAllRating ?? response?.overallRating ?? response?.averageRating ?? prev);
      window.location.reload();
    } catch (err) {
      setError("Unable to submit rating. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadQuality = (selectedQuality) => {
    const videoPath = course?.videoFilePath ?? course?.videoFIle;
    if (!videoPath || !videoRef.current) return;

    const video = videoRef.current;
    const token = getUserData("token");
    const fullUrl = `${BASE_URL}/student/hls/${videoPath}/${selectedQuality}/index.m3u8`;
    const savedTime = savedTimeRef.current;
    const shouldPlay = wasPlayingRef.current;

    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }

    const seekAndResume = () => {
      if (savedTime > 0) video.currentTime = savedTime;
      video.playbackRate = playbackRateRef.current;
      if (shouldPlay) video.play().catch(() => {});
      wasPlayingRef.current = false;
    };

    if (Hls.isSupported()) {
      const hls = new Hls({
        xhrSetup: (xhr) => { 
          // 1. Bypass the Ngrok warning screen (CRITICAL)
          xhr.setRequestHeader("ngrok-skip-browser-warning", "true");
          
          // 2. Pass your Auth token
          if (token) {
             xhr.setRequestHeader("Authorization", `Bearer ${token}`); 
          }
        },
      });
      hlsRef.current = hls;
      hls.attachMedia(video);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => hls.loadSource(fullUrl));
      hls.on(Hls.Events.MANIFEST_PARSED, () => seekAndResume());
    } else {
      video.src = fullUrl;
      video.load();
      video.addEventListener("loadedmetadata", () => seekAndResume(), { once: true });
    }
  };

  const hasVideo = course?.videoFilePath ?? course?.videoFIle;

  useEffect(() => {
    if (isEnrolled && hasVideo) loadQuality(quality);
    return () => { if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; } };
  }, [isEnrolled, hasVideo, quality]);

  if (loading) return (
    <div className="max-w-6xl mx-auto px-6 py-20 text-center">
      <div className="text-xl font-semibold text-gray-700">Loading course details...</div>
    </div>
  );

  if (error) return (
    <div className="max-w-6xl mx-auto px-6 py-20 text-center text-red-600">{error}</div>
  );

  // Only include segments that are strictly less than the video duration.
  // When duration is 0 (not yet loaded), show all segments so they appear once video loads.
  const videoSegments = course?.timeStamps
    ? [...new Set([0, ...course.timeStamps.map(Number)])]
        .filter((v) => !Number.isNaN(v))
        .filter((v) => duration === 0 || v < duration)
    : [];

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#0A66C2] hover:text-blue-700 mb-6"
      >
        <FiArrowLeft /> Back
      </button>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#0A66C2] to-blue-500 p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">{course?.courseName}</h1>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid gap-4 md:grid-cols-3">
            <Card label="Course ID" value={course?.courseId} />
            <Card label="Enrolled" value={isEnrolled ? "Yes" : "No"} />
            <Card label="Complete" value={course?.complete ? "Yes" : "No"} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <InfoBlock title="Description" value={course?.description || "No description available."} />
            <InfoBlock title="Marks" value={course?.marks != null ? String(course.marks) : "Not available"} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Rating */}
            <div className="bg-gray-50 rounded-3xl border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Course Rating</h2>
              <div className="space-y-4">
                <p className="text-gray-600">{yourRatingText}</p>
                {isEnrolled ? (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRatingValue(String(value))}
                          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                            Number(ratingValue) === value
                              ? "bg-[#0A66C2] text-white"
                              : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-50"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleSubmitRating}
                      className="mt-4 rounded-2xl bg-[#0A66C2] px-5 py-3 text-white font-semibold hover:bg-blue-700 transition"
                    >
                      Submit Rating
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">You must enroll before rating.</p>
                )}
                {displayedOverallRating != null && (
                  <p className="text-sm text-gray-500">
                    Overall rating: <span className="font-semibold text-gray-900">{displayedOverallRating} / 5</span>
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 rounded-3xl border border-gray-100 p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Course Actions</h2>
                <p className="text-gray-600 mb-4">
                  {isEnrolled
                    ? examCompleted
                      ? "Exam completed."
                      : course?.complete
                        ? "Course completed."
                        : "You are enrolled. Start the exam when ready."
                    : "You are not enrolled yet. Enroll to begin learning."}
                </p>
              </div>
              {isEnrolled && !examCompleted && !course?.complete ? (
                <button
                  onClick={handleStartExam}
                  disabled={examLoading || examData != null}
                  className={`rounded-xl px-5 py-3 text-sm font-semibold text-white transition ${examData != null ? "bg-slate-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                >
                  {examData != null ? "Exam in progress" : examLoading ? "Starting exam..." : "Start Exam"}
                </button>
              ) : isEnrolled && course?.complete ? (
                <div className="rounded-xl px-5 py-3 text-sm font-semibold text-gray-700"></div>
              ) : isEnrolled && examCompleted ? (
                <div className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-gray-700">Exam completed</div>
              ) : (
                <button onClick={handleEnroll} className="rounded-xl bg-[#0A66C2] px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                  Enroll Now
                </button>
              )}
            </div>
          </div>

          {/* Video Player */}
          {isEnrolled && hasVideo && (
            <div className="bg-gray-50 rounded-3xl border border-gray-100 p-6 space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Course Video</h2>
                  <p className="text-sm text-gray-500">Choose quality and jump to segments.</p>
                </div>
                <div className="flex gap-2">
                  {["1080p", "360p"].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleQualityChange(q)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        quality === q ? "bg-[#0A66C2] text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-50"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div ref={containerRef} className="relative rounded-2xl overflow-hidden bg-black select-none">
                <video
                  ref={videoRef}
                  controls={false}
                  className="w-full block cursor-pointer"
                  style={{ aspectRatio: "16/9", maxHeight: "480px", objectFit: "contain" }}
                  playsInline
                  onClick={togglePlay}
                />

                {isBuffering && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="h-12 w-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
                  </div>
                )}
              </div>

              <div className="rounded-b-2xl bg-black/70 px-4 py-4">
                <div className="relative h-1 w-full rounded-full bg-white/20 mb-3">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full bg-blue-500 pointer-events-none"
                    style={{ width: `${progressPct}%` }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={0.1}
                    value={currentTime}
                    onChange={handleProgressChange}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => seekVideo(-5)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                  >
                    <FiRewind className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={togglePlay}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                  >
                    {isPlaying ? <FiPause className="h-5 w-5" /> : <FiPlay className="h-5 w-5 ml-0.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => seekVideo(5)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                  >
                    <FiFastForward className="h-4 w-4" />
                  </button>

                  <span className="text-xs text-gray-300 tabular-nums shrink-0">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                  
                  <div className="flex-1" />
                  
                  <button
                    type="button"
                    onClick={togglePlaybackRate}
                    className="flex h-8 px-2 items-center justify-center rounded bg-white/10 text-sm font-semibold text-white hover:bg-white/20 transition mr-2"
                  >
                    {playbackRate}x
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                    >
                      {isMuted || volume === 0 ? <FiVolumeX className="h-5 w-5" /> : <FiVolume2 className="h-5 w-5" />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="h-1 w-24 cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>
              </div>

              {examData && (
                <div ref={examSectionRef} className="rounded-3xl border border-gray-200 bg-white p-6 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Exam</h2>
                      <p className="text-sm text-gray-500">Answer the questions below and submit when ready.</p>
                    </div>
                    {examLoading && <span className="text-sm text-gray-500">Loading...</span>}
                  </div>

                  {examError && (
                    <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                      {examError}
                    </div>
                  )}

                  <div className="rounded-2xl bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-blue-900">
                    Auto-submit in <span className="font-semibold">{examTimeLeft}s</span>. Your selected answers will be sent when time runs out.
                  </div>

                  {examData.questionList.map((question, idx) => (
                    <div key={`${question.question}-${idx}`} className="rounded-2xl border border-gray-200 p-4">
                      <p className="font-semibold text-gray-900">{idx + 1}. {question.question}</p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {[
                          { value: 1, label: question.option1 },
                          { value: 2, label: question.option2 },
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => updateExamAnswer(idx, option.value)}
                            className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${examAnswers[idx]?.answer === option.value ? "border-blue-600 bg-blue-50 text-blue-800" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"}`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-500">Exam code: <span className="font-semibold text-gray-900">{examData.examVal}</span></p>
                    <button
                      type="button"
                      onClick={handleSubmitExam}
                      disabled={examLoading || examAnswers.some((item) => item.answer == null)}
                      className="rounded-xl bg-[#0A66C2] px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      Submit Exam
                    </button>
                  </div>
                </div>
              )}

              {examResult && (
                <div className="rounded-3xl border border-green-200 bg-green-50 p-6">
                  <p className="font-semibold text-green-900">Exam submitted successfully.</p>
                  <pre className="mt-3 overflow-x-auto rounded-xl bg-white p-4 text-xs text-gray-700">{JSON.stringify(examResult, null, 2)}</pre>
                </div>
              )}

              {/* Video Segments — only shown when duration is known and segments exist */}
              {duration > 0 && videoSegments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-900">Video Segments</p>
                  <div className="flex flex-wrap gap-2">
                    {videoSegments.map((seconds, index) => (
                      <button
                        key={seconds}
                        type="button"
                        onClick={() => { if (videoRef.current) videoRef.current.currentTime = seconds; }}
                        className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition"
                      >
                        Segment {index + 1} ({Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Card = ({ label, value }) => (
  <div className="bg-gray-50 rounded-3xl border border-gray-100 p-6">
    <p className="text-sm text-gray-500 mb-2">{label}</p>
    <p className="text-lg font-semibold text-gray-900">{value ?? "—"}</p>
  </div>
);

const InfoBlock = ({ title, value }) => (
  <div className="bg-white rounded-3xl border border-gray-100 p-6">
    <p className="text-sm text-gray-500 mb-2">{title}</p>
    <p className="text-gray-700 text-sm leading-relaxed">{value}</p>
  </div>
);

export default StudentCoursePage;