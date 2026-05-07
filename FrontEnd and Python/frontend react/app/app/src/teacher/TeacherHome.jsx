import { Outlet } from "react-router-dom";
import TeacherNavbar from "./TeacherNavbar";

const TeacherHome = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <TeacherNavbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default TeacherHome;
