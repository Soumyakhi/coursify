import { useParams } from "react-router-dom";
import TeacherRoutes from "./teacher/TeacherRoutes";
import StudentRoutes from "./user/routes/student_routes";
import Recruiterroutes from "./recruiter/Recruiterroutes";

export default function HomeRouter() {
  const { type } = useParams();

  if (type === "student") {
    return <StudentRoutes />;
  }

  if (type === "teacher") {
    return <TeacherRoutes />;
  }

  if (type === "recruiter") {
    return <Recruiterroutes />;
  }

  return (
    <div className="p-6 text-red-500">
      Invalid user type: {type}
    </div>
  );
}