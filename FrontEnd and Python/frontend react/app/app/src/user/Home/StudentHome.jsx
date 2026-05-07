import Navbar from "./Navbar";
import StudentRoutes from "../routes/student_routes";
import { Outlet } from "react-router-dom";

export default function StudentHome() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col w-full">
      <Navbar />
      <main className="flex flex-1">
        <div className="flex-1 flex flex-col w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}