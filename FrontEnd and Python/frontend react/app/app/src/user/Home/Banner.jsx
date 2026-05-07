import React from "react";
import { FaBriefcase, FaRocket, FaRegLightbulb, FaTrophy } from "react-icons/fa";
import { MdOutlineWorkspacePremium, MdVerified } from "react-icons/md";
import { HiSparkles } from "react-icons/hi2";

const Banner = () => {
  return (
    <div className="w-full flex justify-center px-4 pt-10">

      {/* BANNER CARD */}
      <div
        className="max-w-7xl w-full rounded-3xl shadow-2xl px-10 py-16 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0f0c29 0%, #302b63 30%, #8e2de2 58%, #f7971e 85%, #ffd200 100%)",
        }}
      >

        {/* ── Decorative blobs ── */}
        <div className="absolute -top-10 -left-10 w-56 h-56 rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, #ffd200, transparent)" }} />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full blur-3xl opacity-25"
          style={{ background: "radial-gradient(circle, #8e2de2, transparent)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 rounded-full blur-[80px] opacity-10"
          style={{ background: "#fff" }} />

        {/* ── Subtle grid overlay ── */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative text-center text-white">

          {/* BADGE */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest uppercase mb-5">
            <HiSparkles className="text-yellow-300 text-sm" />
            Your Career Starts Here
            <HiSparkles className="text-yellow-300 text-sm" />
          </div>

          {/* MAIN HEADING */}
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight drop-shadow-lg">
            Learn Anything.{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(90deg, #ffd200, #f7971e)",
              }}
            >
              Get Hired.
            </span>{" "}
            <FaRocket className="inline mb-1 text-yellow-300 text-3xl" />
          </h1>

          {/* SUB TEXT */}
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            From <b className="text-white">creative arts</b> to{" "}
            <b className="text-white">business strategy</b>,{" "}
            <b className="text-white">technology</b> to{" "}
            <b className="text-white">healthcare</b> — find the course that
            launches your career. Real instructors, real skills, real
            opportunities.
          </p>

          {/* STATS ROW */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-center">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-yellow-300">50+</span>
              <span className="text-xs text-white/60 mt-0.5">Courses</span>
            </div>
            <div className="w-px bg-white/20 self-stretch hidden sm:block" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-yellow-300">300+</span>
              <span className="text-xs text-white/60 mt-0.5">Learners</span>
            </div>
            <div className="w-px bg-white/20 self-stretch hidden sm:block" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-yellow-300">95%</span>
              <span className="text-xs text-white/60 mt-0.5">Job Success</span>
            </div>
            <div className="w-px bg-white/20 self-stretch hidden sm:block" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-yellow-300">200+</span>
              <span className="text-xs text-white/60 mt-0.5">Hiring Partners</span>
            </div>
          </div>

          {/* HIGHLIGHTS PILLS */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">

            <span className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm hover:bg-white/25 transition-colors cursor-default">
              <FaBriefcase className="text-yellow-300" />
              Job-Ready Courses
            </span>

            <span className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm hover:bg-white/25 transition-colors cursor-default">
              <FaRegLightbulb className="text-yellow-300" />
              Skill-Based Learning
            </span>

            <span className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm hover:bg-white/25 transition-colors cursor-default">
              <MdVerified className="text-yellow-300" />
              Get Hired
            </span>

            <span className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm hover:bg-white/25 transition-colors cursor-default">
              <FaTrophy className="text-yellow-300" />
              Career Growth
            </span>

            <span className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm hover:bg-white/25 transition-colors cursor-default">
              <MdOutlineWorkspacePremium className="text-yellow-300" />
              Expert Instructors
            </span>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Banner;