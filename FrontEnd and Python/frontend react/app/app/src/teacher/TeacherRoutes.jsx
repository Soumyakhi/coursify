import { Navigate, Route, Routes } from "react-router-dom";
import { isTeacherLoggedIn } from "../localstorage";
import TeacherPortal from "./TeacherPortal";
import TeacherHome from "./TeacherHome";
import TeacherDashboard from "./TeacherDashboard";

const TeacherRoutes = () => {
  const loggedInTeacher = isTeacherLoggedIn();

  return (
    <Routes>
      <Route
        index
        element={
          loggedInTeacher ? <Navigate to="home" replace /> : <TeacherPortal />
        }
      />

      <Route
        path="home/*"
        element={
          loggedInTeacher ? <TeacherHome /> : <Navigate to="/teacher" replace />
        }
      >
        <Route index element={<TeacherDashboard />} />
      </Route>
    </Routes>
  );
};

export default TeacherRoutes;