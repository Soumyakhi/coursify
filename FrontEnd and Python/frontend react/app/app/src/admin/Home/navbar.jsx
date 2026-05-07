import { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { NavLink } from "react-router-dom"

/* Reusable Menu */
const MenuItems = ({ isMobile = false, onClick }) => {
  const baseClass =
    "text-left transition hover:underline hover:text-[#0A66C2] md:hover:text-white";

  const activeClass = "underline font-semibold";

  return (
    <div
      className={`${
        isMobile
          ? "flex flex-col p-4 gap-4 text-sm"
          : "flex gap-6 text-sm"
      }`}
    >
      <NavLink
        to="/"
        end
        onClick={onClick}
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : ""}`
        }
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/courses"
        onClick={onClick}
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : ""}`
        }
      >
        Courses
      </NavLink>

      <NavLink
        to="/students"
        onClick={onClick}
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : ""}`
        }
      >
        Students
      </NavLink>

      <NavLink
        to="/profile"
        onClick={onClick}
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : ""}`
        }
      >
        Profile
      </NavLink>
    </div>
  );
};

const Navbar = () => {
    const [open, setOpen] = useState(false);

    // Auto close drawer on desktop resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <nav className="bg-[#0A66C2] text-white px-4 md:px-8 py-4 flex justify-between items-center shadow relative">
            {/* Logo */}
            <h1 className="text-lg md:text-xl font-bold">
                Teacher Admin Panel
            </h1>

            {/* Desktop Menu */}
            <div className="hidden md:block">
                <MenuItems />
            </div>

            {/* Mobile 3-dot icon */}
            <button
                className="md:hidden text-2xl"
                onClick={() => setOpen(true)}
            >
                <BsThreeDotsVertical />
            </button>

            {/* Right Side Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-white text-gray-800 shadow-lg transform transition-transform duration-300 z-50
        ${open ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Drawer Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <span className="font-semibold">Menu</span>
                    <button onClick={() => setOpen(false)} className="text-xl">
                        <AiOutlineClose />
                    </button>
                </div>

                {/* Mobile Menu */}
                <MenuItems isMobile onClick={() => setOpen(false)} />
            </div>

            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/30 z-40"
                    onClick={() => setOpen(false)}
                />
            )}
        </nav>
    );
};

export default Navbar;
