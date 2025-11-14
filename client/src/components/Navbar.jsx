import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="flex justify-between items-center px-6 py-8">
        {/* Logo / Brand */}
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="text-2xl font-bold tracking-wide hover:text-yellow-400 transition"
        >
          🎟️ Event Scheduler
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link
            to="/"
            className="hover:text-yellow-300 font-medium transition duration-150"
          >
            Home
          </Link>

          {user && (
            <Link
              to="/dashboard"
              className="hover:text-yellow-300 font-medium transition duration-150"
            >
              Dashboard
            </Link>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md font-medium transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-yellow-300 font-medium transition duration-150"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md font-medium transition"
              >
                Signup
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 py-4 space-y-3 text-center animate-slideDown">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block hover:text-yellow-300 font-medium transition duration-150"
          >
            Home
          </Link>

          {user && (
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-yellow-300 font-medium transition duration-150"
            >
              Dashboard
            </Link>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md font-medium transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block hover:text-yellow-300 font-medium transition duration-150"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md font-medium transition w-fit mx-auto"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
