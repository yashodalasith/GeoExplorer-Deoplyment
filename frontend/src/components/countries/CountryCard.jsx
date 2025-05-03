import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

const CountryCard = ({
  country,
  onToggleFavorite,
  onClick,
  isFavorite,
  isLoggedIn,
}) => {
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(country.cca3);
  };

  return (
    <div
      onClick={() => onClick(country.cca3)}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
    >
      <div className="relative">
        <img
          src={country.flags.svg || country.flags.png}
          alt={`Flag of ${country.name.common}`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow hover:bg-white transition"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isLoggedIn ? (
            isFavorite ? (
              <HeartSolid className="h-5 w-5 text-red-500" />
            ) : (
              <HeartOutline className="h-5 w-5 text-gray-600 hover:text-red-500" />
            )
          ) : (
            <HeartOutline className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition">
          {country.name.common}
        </h3>

        <div className="space-y-2 text-gray-600">
          <p className="flex items-start">
            <span className="inline-block w-24 font-medium">Population:</span>
            <span>{country.population.toLocaleString()}</span>
          </p>
          <p className="flex items-start">
            <span className="inline-block w-24 font-medium">Region:</span>
            <span>{country.region}</span>
          </p>
          <p className="flex items-start">
            <span className="inline-block w-24 font-medium">Capital:</span>
            <span>{country.capital?.join(", ") || "N/A"}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CountryCard;
