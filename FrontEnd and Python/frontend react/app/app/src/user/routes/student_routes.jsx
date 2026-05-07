import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import StudentHome from "../Home/StudentHome";
import SearchResults from "../Home/SearchResults";
import StudentDashboard from "../Home/StudentDashboard";
import StudentProfile from "../Home/StudentProfile";
import StudentCoursePage from "../Home/StudentCoursePage";
import MyCourses from "../Home/MyCourses";
import MyJobs from "../Home/MyJobs";
import { getUserData } from "../../localstorage";

const StudentProfilePage = () => {
  const navigate = useNavigate();
  const userData = getUserData();

  return <StudentProfile userData={userData} onClose={() => navigate("/student/home")} />;
};

const StudentRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="home" replace />} />
      <Route path="home/*" element={<StudentHome />}>
        <Route index element={<StudentDashboard />} />
        <Route path="search/course/:query/:page" element={<SearchResults />} />
        <Route path="course/:courseId" element={<StudentCoursePage />} />
        <Route path="profile" element={<StudentProfilePage />} />
        <Route path="my-courses" element={<MyCourses />} />
        <Route path="my-jobs" element={<MyJobs />} />
      </Route>
    </Routes>
  );
};

export default StudentRoutes;