import Navbar from "./navbar";
import { FaUserGraduate, FaUserTie, FaBook } from "react-icons/fa";

const Dashboard = () => {


  const stats = [
    {
      title: "Students",
      value: 124,
      description: "Total active students",
      icon: <FaUserGraduate />,
    },
    {
      title: "Recruiters",
      value: 18,
      description: "Total active recruiters",
      icon: <FaUserTie />,
    },
    {
      title: "Courses",
      value: 12,
      description: "Total active courses",
      icon: <FaBook />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Welcome back
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {stats.map((stat, idx) => (
            <StatCard
              key={idx}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              description={stat.description}
            />
          ))}

        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, description }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 border-t-4 border-[#0A66C2]">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center bg-[#0A66C2] rounded-full text-white text-xl">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>

      <p className="text-4xl font-bold text-gray-900 mt-6">{value}</p>
      {description && (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
};

export default Dashboard;
