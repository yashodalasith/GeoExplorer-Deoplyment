import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import CountryMap from "../components/countries/CountryMap";
import {
  ArrowLeftIcon,
  HeartIcon as HeartOutline,
  GlobeAltIcon,
  UsersIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import {
  getCountriesByCodes,
  getCountryByCode,
} from "../services/countriesService";

const CountryDetail = () => {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borderCountries, setBorderCountries] = useState([]);
  const { user, toggleFavorite } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setLoading(true);
        const countryData = await getCountryByCode(code);
        setCountry(countryData);

        if (countryData.borders?.length > 0) {
          const bordersResponse = await getCountriesByCodes(
            countryData.borders
          );
          setBorderCountries(bordersResponse);
        }
      } catch (error) {
        toast.error("Failed to fetch country details");
        navigate("/countries", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [code, navigate]);

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate("/login", {
        state: {
          from: location.pathname,
          message: "Please login to save favorites",
        },
      });
      return;
    }

    try {
      await toggleFavorite(code);
      toast.success(
        user.favoriteCountries?.includes(code)
          ? "Removed from favorites"
          : "Added to favorites"
      );
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  if (loading || !country) {
    return (
      <div
        className="flex justify-center items-center min-h-[70vh]"
        data-testid="loading-spinner"
      >
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Get primary color from flag for dynamic theming
  const getDominantColor = () => {
    // In a real app, you might analyze the flag image to get dominant color
    // For demo purposes, we'll return a gradient based on region
    const regionColors = {
      Africa: "from-amber-500 to-yellow-600",
      Americas: "from-emerald-500 to-teal-600",
      Asia: "from-red-500 to-rose-600",
      Europe: "from-blue-500 to-indigo-600",
      Oceania: "from-green-500 to-emerald-600",
    };
    return regionColors[country.region] || "from-purple-500 to-pink-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Header with Country Name */}
      <div
        className={`bg-gradient-to-r ${getDominantColor()} py-12 px-4 sm:px-6 lg:px-8 text-white`}
      >
        <div className="container mx-auto max-w-7xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition mb-8"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Countries</span>
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-md">
                {country.name.common}
              </h1>
              <p className="text-xl opacity-90">{country.name.official}</p>
            </div>

            {user && (
              <button
                onClick={handleToggleFavorite}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition"
                aria-label={
                  user.favoriteCountries?.includes(country.cca3)
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                {user.favoriteCountries?.includes(country.cca3) ? (
                  <HeartSolid className="h-6 w-6 text-red-300" />
                ) : (
                  <HeartOutline className="h-6 w-6" />
                )}
                <span className="font-medium">
                  {user.favoriteCountries?.includes(country.cca3)
                    ? "Saved"
                    : "Save to Favorites"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 -mt-16">
        {/* Flag Display */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden mb-12 border-8 border-white">
          <img
            src={country.flags.svg || country.flags.png}
            alt={`Flag of ${country.name.common}`}
            className="w-full h-auto max-h-[400px] object-contain mx-auto"
            loading="lazy"
            style={{
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f8fafc", // Light fallback background
            }}
          />
        </div>

        {/* Country Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Key Facts */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Country Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fact Cards */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <UsersIcon className="h-8 w-8 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Population
                    </h3>
                  </div>
                  <p className="text-2xl font-bold text-blue-800">
                    {country.population.toLocaleString()}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <GlobeAltIcon className="h-8 w-8 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Region
                    </h3>
                  </div>
                  <p className="text-2xl font-bold text-green-800">
                    {country.region}
                    {country.subregion && (
                      <span className="block text-sm font-normal text-green-700">
                        {country.subregion}
                      </span>
                    )}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPinIcon className="h-8 w-8 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Capital
                    </h3>
                  </div>
                  <p className="text-2xl font-bold text-purple-800">
                    {country.capital?.join(", ") || "N/A"}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <CurrencyDollarIcon className="h-8 w-8 text-amber-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      Currency
                    </h3>
                  </div>
                  <p className="text-2xl font-bold text-amber-800">
                    {country.currencies
                      ? Object.values(country.currencies)
                          .map((c) => `${c.name} (${c.symbol || ""})`)
                          .join(", ")
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Languages Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
              <div className="flex items-center gap-3 mb-6">
                <ChatBubbleBottomCenterTextIcon className="h-8 w-8 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-800">Languages</h2>
              </div>

              {country.languages ? (
                <div className="flex flex-wrap gap-3">
                  {Object.entries(country.languages).map(([code, name]) => (
                    <span
                      key={code}
                      className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No language data available</p>
              )}
            </div>
          </div>

          {/* Sidebar with Additional Info */}
          <div>
            {/* Map Embed - Would be replaced with actual map component */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                <h3 className="text-lg font-semibold text-white">
                  Location Map
                </h3>
              </div>
              <CountryMap
                latlng={country.latlng}
                countryName={country.name.common}
              />
            </div>

            {/* Border Countries */}
            {borderCountries.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
                  <h3 className="text-lg font-semibold text-white">
                    Neighboring Countries
                  </h3>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {borderCountries.map((border) => (
                      <Link
                        key={border.cca3}
                        to={`/countries/${border.cca3}`}
                        className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 rounded-lg text-sm font-medium text-green-800 transition"
                      >
                        <img
                          src={border.flags.svg || border.flags.png}
                          alt={`${border.name.common} flag`}
                          className="h-4 w-6 object-cover rounded-sm"
                        />
                        {border.name.common}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Facts */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-8">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4">
                <h3 className="text-lg font-semibold text-white">
                  Quick Facts
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Time Zone
                  </h4>
                  <p className="font-medium">
                    {country.timezones?.join(", ") || "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Driving Side
                  </h4>
                  <p className="font-medium">
                    {country.car?.side
                      ? country.car.side.charAt(0).toUpperCase() +
                        country.car.side.slice(1)
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Country Code
                  </h4>
                  <p className="font-medium">
                    {country.cca2} / {country.cca3}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryDetail;
