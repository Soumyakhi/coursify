import { Navigate, Route, Routes } from "react-router-dom";
import { isRecruiterLoggedIn } from "../localstorage";
import RecruiterAuth from "./RecruiterAuth";
import RecruiterHome from "./RecruiterHome";
import RecruiterDashboard from "./RecruiterDashboard";

const RecruiterRoutes = () => {
  const loggedInRecruiter = isRecruiterLoggedIn();

  return (
    <Routes>
      <Route
        index
        element={
          loggedInRecruiter ? <Navigate to="home" replace /> : <RecruiterAuth />
        }
      />

      <Route
        path="home/*"
        element={
          loggedInRecruiter ? <RecruiterHome /> : <Navigate to="/recruiter" replace />
        }
      >
        <Route index element={<RecruiterDashboard />} />
      </Route>
    </Routes>
  );
};

export default RecruiterRoutes;