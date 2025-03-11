// src/components/layout/MainLayout.jsx
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const MainLayout = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navigation */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            CAD Viewer
          </Link>

          <nav className="flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-200">
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/models" className="hover:text-blue-200">
                  Models
                </Link>
                <Link to="/dashboard" className="hover:text-blue-200">
                  Dashboard
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-1 hover:text-blue-200">
                    <span>{user?.username}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto py-6 px-4">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2">CAD Viewer</h3>
              <p className="text-gray-400">A 3D model viewer for engineers</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/" className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/models" className="hover:text-white">
                    Models
                  </Link>
                </li>
                {isAuthenticated ? (
                  <li>
                    <Link to="/dashboard" className="hover:text-white">
                      Dashboard
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link to="/login" className="hover:text-white">
                      Sign in
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-gray-400 text-sm text-center">
            &copy; {new Date().getFullYear()} CAD Viewer. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
