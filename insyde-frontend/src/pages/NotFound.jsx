// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

const NotFound = () => {
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto text-center py-12">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mb-6">
          Page Not Found
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-700 transition"
        >
          Go to Homepage
        </Link>
      </div>
    </MainLayout>
  );
};

export default NotFound;
