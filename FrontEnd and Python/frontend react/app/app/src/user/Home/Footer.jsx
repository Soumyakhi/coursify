import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-10 mt-10">
      <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* About */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">
            Student Portal
          </h3>
          <p className="text-sm text-gray-400">
            A modern learning platform to help students build skills and grow in tech.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/student/home" className="hover:text-white transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="/student/home" className="hover:text-white transition-colors">
                Courses
              </a>
            </li>
            <li>
              <a href="/student/home/profile" className="hover:text-white transition-colors">
                Profile
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">
            Contact
          </h3>
          <p className="text-sm text-gray-400">
            <a href="mailto:support@studentportal.com" className="hover:text-white transition-colors">
              support@studentportal.com
            </a>
          </p>
        </div>

      </div>

      <div className="text-center text-xs text-gray-500 mt-8">
        © {new Date().getFullYear()} Student Portal. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;