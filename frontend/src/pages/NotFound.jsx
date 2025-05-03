import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <Link
        to="/"
        className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
