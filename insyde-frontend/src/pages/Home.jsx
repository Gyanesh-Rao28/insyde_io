// src/pages/Home.jsx (continued)
import { Link } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        {/* Hero section */}
        <div className="text-center py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Insyde CAD Viewer
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Import, view, and manipulate 3D models with our powerful web-based
            CAD viewer. Support for STL and OBJ files.
          </p>
          <div className="flex justify-center space-x-4">
            {isAuthenticated ? (
              <Link
                to="/models"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
              >
                View Models
              </Link>
            ) : (
              <Link
                to="/register"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            )}
            <Link
              to={isAuthenticated ? "/dashboard" : "/login"}
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 transition"
            >
              {isAuthenticated ? "Dashboard" : "Sign In"}
            </Link>
          </div>
        </div>

        {/* Features section */}
        <div className="py-12">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">3D Model Import</h3>
              <p className="text-gray-600">
                Easily upload and import STL and OBJ files to view and
                manipulate in your browser.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Viewer</h3>
              <p className="text-gray-600">
                Rotate, zoom, and pan to explore your 3D models from every
                angle.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Format Conversion</h3>
              <p className="text-gray-600">
                Convert between different file formats - export STL files to OBJ
                and vice versa.
              </p>
            </div>
          </div>
        </div>

        {/* How it works section */}
        <div className="py-12">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload</h3>
              <p className="text-gray-600">
                Upload your STL or OBJ file to our platform
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">View</h3>
              <p className="text-gray-600">
                Instantly view your 3D model in the browser
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Manipulate</h3>
              <p className="text-gray-600">
                Rotate, zoom, and pan to explore the model
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Convert</h3>
              <p className="text-gray-600">
                Optionally convert to a different file format
              </p>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="py-12 bg-blue-50 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our platform today and start viewing your 3D models in seconds.
          </p>
          <Link
            to={isAuthenticated ? "/models" : "/register"}
            className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg hover:bg-blue-700 transition"
          >
            {isAuthenticated ? "View Models" : "Sign Up Now"}
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
