import React from "react";
import Banner from "./Banner";
import RecommendedCourses from "./RecomendedCourse";
import Footer from "./Footer";
import { isLoggedIn } from "../../localstorage";

const StudentDashboard = () => {
    return(
      <div className="flex flex-col min-h-full w-full">
        <div className="flex-1">
          <Banner />
          {isLoggedIn() && <RecommendedCourses />}
        </div>
        <Footer />
      </div>
    )
}

export default StudentDashboard;