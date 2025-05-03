import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import CountryCard from "../components/countries/CountryCard";
import { getCountriesByCodes } from "../services/countriesService";
import {
  GlobeAmericasIcon,
  UserIcon,
  EnvelopeIcon,
  CakeIcon,
  FlagIcon,
  MapPinIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const Profile = () => {
  const { user, logout } = useAuth();
  const [favoriteCountries, setFavoriteCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteCountries = async () => {
      if (!user?.favoriteCountries?.length) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getCountriesByCodes(user.favoriteCountries);
        setFavoriteCountries(response);
      } catch (error) {
        toast.error("Failed to fetch favorite countries");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteCountries();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  if (!user) {
    return null;
  }

  // Format date of birth for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <div className="flex items-end">
                <div className="relative -mb-12">
                  <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                    {user.gender === "female" ? (
                      <img
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
                <div className="ml-32 mb-4">
                  <h1 className="text-3xl font-bold text-white">
                    {user.username}
                  </h1>
                  <p className="text-blue-100">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute top-6 right-6">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition flex items-center gap-2 border border-white/30"
              >
                <span>Logout</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l3-3a1 1 0 10-1.414-1.414L14 7.586l-2.293-2.293a1 1 0 10-1.414 1.414L12.586 9H7a1 1 0 100 2h5.586l-1.293 1.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="pt-16 px-8 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                  <EnvelopeIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                  <CakeIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Date of Birth
                  </h3>
                  <p className="text-gray-900">
                    {formatDate(user.dateOfBirth)}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                  <MapPinIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Residence
                  </h3>
                  <p className="text-gray-900">
                    {user.countryOfResidence || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                  <FlagIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Nationality
                  </h3>
                  <p className="text-gray-900">
                    {user.nationality || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <GlobeAmericasIcon className="h-6 w-6 text-indigo-600" />
                  <span>Favorite Countries</span>
                </h2>
                <div className="text-sm text-gray-500">
                  {favoriteCountries.length}{" "}
                  {favoriteCountries.length === 1 ? "country" : "countries"}
                </div>
              </div>

              {loading ? (
                <div
                  className="flex justify-center items-center h-64"
                  data-testid="loading-spinner"
                >
                  <LoadingSpinner />
                </div>
              ) : favoriteCountries.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    No favorite countries yet
                  </h3>
                  <p className="mt-2 text-gray-500 max-w-md mx-auto">
                    You haven't added any countries to your favorites. Explore
                    the world and mark your favorite destinations!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteCountries.map((country) => (
                    <CountryCard
                      key={country.cca3}
                      country={country}
                      isFavorite={true}
                      isLoggedIn={true}
                      onClick={() => {}}
                      onToggleFavorite={() => {}}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
