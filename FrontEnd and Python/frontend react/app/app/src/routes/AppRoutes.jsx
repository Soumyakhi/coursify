import { Route, Routes } from "react-router-dom"
import DashboardCards from "../admin/Home/dashboard"
import TeacherLogin from "../admin/Admin_Register/login"
import PrivateRoute from "./PrivateRoute"
import Course from "../admin/Course/Course"




const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardCards />} />
            <Route path="/courses" element={<Course />} />
            <Route path="/teacher-login" element={<TeacherLogin />} />

            {/* <Route path="/" element={<Dashboard />} /> */}
            {/* <Route path="/" element={
                <PrivateRoute>
                    <Dashboard />
                </PrivateRoute>
            }
            /> */}
        </Routes>
    )
}

export default AppRoutes