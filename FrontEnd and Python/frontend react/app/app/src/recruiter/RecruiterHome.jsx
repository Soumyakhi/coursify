import { Outlet } from "react-router-dom";
import RecruiterNavbar from "./RecruiterNavbar";

const RecruiterHome = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <RecruiterNavbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default RecruiterHome;