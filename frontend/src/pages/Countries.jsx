// import React, { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useCountries } from "../hooks/useCountries";
// import { useDebounce } from "../hooks/useDebounce";
// import { useNavigate } from "react-router-dom";
// import CountryCard from "../components/countries/CountryCard";
// import SearchBar from "../components/countries/SearchBar";
// import RegionFilter from "../components/countries/RegionFilter";
// import LoadingSpinner from "../components/ui/LoadingSpinner";
// import { toast } from "react-hot-toast";
// import {
//   searchCountries,
//   getCountriesByRegion,
//   getCountriesByLanguage,
// } from "../services/countriesService";
// import LanguageFilter from "../components/countries/LanguageFilter";

// const Countries = () => {
//   const navigate = useNavigate();
//   const { countries: allCountries, loading } = useCountries();
//   const [filteredCountries, setFilteredCountries] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [regionFilter, setRegionFilter] = useState("");
//   const { user, toggleFavorite } = useAuth();
//   const [languageFilter, setLanguageFilter] = useState("");
//   const debouncedSearchTerm = useDebounce(searchTerm, 300);

//   useEffect(() => {
//     const applyFilters = async () => {
//       try {
//         let results = allCountries;

//         if (debouncedSearchTerm) {
//           const searched = await searchCountries(debouncedSearchTerm);
//           results = results.filter((c1) =>
//             searched.some((c2) => c2.cca3 === c1.cca3)
//           );
//         }

//         if (regionFilter) {
//           const byRegion = await getCountriesByRegion(regionFilter);
//           results = results.filter((c1) =>
//             byRegion.some((c2) => c2.cca3 === c1.cca3)
//           );
//         }

//         if (languageFilter) {
//           const byLanguage = await getCountriesByLanguage(languageFilter);
//           results = results.filter((c1) =>
//             byLanguage.some((c2) => c2.cca3 === c1.cca3)
//           );
//         }

//         setFilteredCountries(results);
//       } catch (error) {
//         toast.error("Failed to apply filters");
//       }
//     };

//     if (allCountries.length > 0) {
//       applyFilters();
//     }
//   }, [allCountries, debouncedSearchTerm, regionFilter, languageFilter]);

//   const handleSearch = (term) => setSearchTerm(term);
//   const handleRegionFilter = (region) => setRegionFilter(region);
//   const handleLanguageFilter = (language) => setLanguageFilter(language);

//   const handleCardClick = (countryCode) => {
//     if (!user) {
//       navigate("/login", {
//         state: {
//           from: `/countries/${countryCode}`,
//           message: "Please login to view country details",
//         },
//       });
//       return;
//     }
//     navigate(`/countries/${countryCode}`);
//   };

//   const handleToggleFavorite = async (countryCode) => {
//     if (!user) {
//       navigate("/login", {
//         state: {
//           from: location.pathname,
//           message: "Please login to save favorites",
//         },
//       });
//       return;
//     }

//     try {
//       await toggleFavorite(countryCode);
//       toast.success(
//         user.favoriteCountries?.includes(countryCode)
//           ? "Removed from favorites"
//           : "Added to favorites"
//       );
//     } catch (error) {
//       toast.error("Failed to update favorites");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[50vh]">
//         <LoadingSpinner size="lg" />
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Filters Section */}
//       <div className="mb-10">
//         <h1 className="text-3xl font-bold text-gray-900 mb-6">
//           Explore Countries
//         </h1>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
//           <div className="lg:col-span-2">
//             <SearchBar
//               onSearch={handleSearch}
//               placeholder="Search by name, capital, or region..."
//             />
//           </div>
//           <RegionFilter
//             onFilter={handleRegionFilter}
//             selectedRegion={regionFilter}
//           />
//           <LanguageFilter
//             onFilter={handleLanguageFilter}
//             selectedLanguage={languageFilter}
//           />
//         </div>

//         {/* Active filters */}
//         {(searchTerm || regionFilter || languageFilter) && (
//           <div className="mt-4 flex flex-wrap gap-2">
//             {searchTerm && (
//               <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
//                 Search: {searchTerm}
//                 <button
//                   onClick={() => setSearchTerm("")}
//                   className="ml-1 text-blue-400 hover:text-blue-600"
//                 >
//                   ×
//                 </button>
//               </span>
//             )}
//             {regionFilter && (
//               <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
//                 Region: {regionFilter}
//                 <button
//                   onClick={() => setRegionFilter("")}
//                   className="ml-1 text-green-400 hover:text-green-600"
//                 >
//                   ×
//                 </button>
//               </span>
//             )}
//             {languageFilter && (
//               <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
//                 Language: {languageFilter}
//                 <button
//                   onClick={() => setLanguageFilter("")}
//                   className="ml-1 text-purple-400 hover:text-purple-600"
//                 >
//                   ×
//                 </button>
//               </span>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Results */}
//       {filteredCountries.length === 0 ? (
//         <div className="text-center py-16">
//           <div className="mx-auto w-24 h-24 text-gray-400 mb-4">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={1.5}
//                 d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//           </div>
//           <h3 className="text-xl font-medium text-gray-600 mb-2">
//             No countries found
//           </h3>
//           <p className="text-gray-500 max-w-md mx-auto">
//             Try adjusting your search or filters. Explore all countries by
//             clearing all filters.
//           </p>
//           <button
//             onClick={() => {
//               setSearchTerm("");
//               setRegionFilter("");
//               setLanguageFilter("");
//             }}
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
//           >
//             Clear All Filters
//           </button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {filteredCountries.map((country) => (
//             <CountryCard
//               key={country.cca3}
//               country={country}
//               onToggleFavorite={handleToggleFavorite}
//               onClick={handleCardClick} // Add this prop
//               isFavorite={user?.favoriteCountries?.includes(country.cca3)}
//               isLoggedIn={!!user} // Pass auth status
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Countries;

import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useCountries } from "../hooks/useCountries";
import { useDebounce } from "../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import CountryCard from "../components/countries/CountryCard";
import SearchBar from "../components/countries/SearchBar";
import RegionFilter from "../components/countries/RegionFilter";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { toast } from "react-hot-toast";
import {
  searchCountries,
  getCountriesByRegion,
  getCountriesByLanguage,
} from "../services/countriesService";
import LanguageFilter from "../components/countries/LanguageFilter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import Globe from "globe.gl";

// 2D Map View Component
const MapView = ({ countries, onCountryClick }) => {
  const [hoveredCountry, setHoveredCountry] = useState(null);

  return (
    <div className="relative h-[600px] w-full bg-gradient-to-b from-blue-900 to-indigo-900 rounded-3xl overflow-hidden shadow-2xl">
      <ComposableMap
        projection="geoEqualEarth" // Changed from geoMercator
        projectionConfig={{
          scale: 150, // Increased from 120
          rotate: [0, 0, 0], // Explicit rotation
        }}
        width={800} // Explicit width
        height={600} // Explicit height
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Geographies geography="https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json">
          {({ geographies }) =>
            geographies.map((geo) => {
              const country = countries.find((c) => c.cca3 === geo.id);
              const isActive = country && country.population > 0;
              const isHovered = hoveredCountry === geo.id;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={
                    isHovered ? "#60a5fa" : isActive ? "#3b82f6" : "#1e3a8a"
                  }
                  stroke={isHovered ? "#ffffff" : "#93c5fd"}
                  strokeWidth={isHovered ? 1 : 0.5}
                  style={{
                    default: { outline: "none", cursor: "pointer" },
                    hover: { outline: "none" },
                    pressed: { outline: "none" },
                  }}
                  onClick={() => isActive && onCountryClick(country.cca3)}
                  onMouseEnter={() => setHoveredCountry(geo.id)}
                  onMouseLeave={() => setHoveredCountry(null)}
                />
              );
            })
          }
        </Geographies>

        {countries.map((country) => (
          <Marker
            key={country.cca3}
            coordinates={[country.latlng[1], country.latlng[0]]}
          >
            <circle
              r={4 + Math.log10(country.population) * 0.5}
              fill={hoveredCountry === country.cca3 ? "#f97316" : "#f59e0b"}
              stroke="#d97706"
              strokeWidth={1}
              className="cursor-pointer transition-all"
              onClick={() => onCountryClick(country.cca3)}
              onMouseEnter={() => setHoveredCountry(country.cca3)}
              onMouseLeave={() => setHoveredCountry(null)}
            />
          </Marker>
        ))}
      </ComposableMap>

      <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Click any colored country</span>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span>Circle size = Population</span>
        </div>
      </div>

      {hoveredCountry && (
        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg">
          {countries.find((c) => c.cca3 === hoveredCountry)?.name.common}
        </div>
      )}
    </div>
  );
};

// 3D Globe Component - Fixed WebGL Context Issues
// 3D Globe Component - Updated with colorful markers and better zoom
const InteractiveGlobe = ({ countries, onCountryClick }) => {
  const globeEl = useRef();
  const globeInstance = useRef(null);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const autoRotationTimeout = useRef();

  // Color palette for markers
  const markerColors = [
    "#3b82f6", // blue
    "#ef4444", // red
    "#10b981", // green
    "#f59e0b", // amber
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#14b8a6", // teal
    "#f97316", // orange
  ];

  const getRandomColor = (countryCode) => {
    // Use country code to get a consistent color per country
    const hash = countryCode
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return markerColors[hash % markerColors.length];
  };

  useEffect(() => {
    // Clean up previous instance
    if (globeInstance.current) {
      globeInstance.current._destructor();
      globeInstance.current = null;
    }

    if (!countries.length || !globeEl.current) return;

    // Initialize new globe instance with more zoomed out view
    globeInstance.current = Globe()
      .globeImageUrl(
        "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      )
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
      .backgroundColor("rgba(255,255,255,1)")
      .showAtmosphere(true)
      .atmosphereColor("rgba(200, 200, 255, 0.3)") // Lighter atmosphere
      .height(600)
      .width(600)
      .pointOfView({ lat: 20, lng: 0, altitude: 2.5 })(
      // More zoomed out view
      globeEl.current
    );

    // Smoother controls
    globeInstance.current.controls().enableZoom = true;
    globeInstance.current.controls().zoomSpeed = 0.8;
    globeInstance.current.controls().enablePan = false;
    globeInstance.current.controls().autoRotate = true;
    globeInstance.current.controls().autoRotateSpeed = 0.5;

    const countryData = countries.map((country) => ({
      id: country.cca3,
      lat: country.latlng[0],
      lng: country.latlng[1],
      color: getRandomColor(country.cca3), // Use our color function
      name: country.name.common,
      radius: 0.8 + Math.log10(country.population) * 0.3,
    }));

    globeInstance.current
      .pointsData(countryData)
      .pointAltitude((d) => d.radius * 0.15)
      .pointColor((d) => (hoveredCountry === d.id ? "#ffffff" : d.color)) // White when hovered
      .pointRadius((d) => (hoveredCountry === d.id ? 0.6 : 0.5)) // Slightly larger when hovered
      .pointResolution(16)
      .onPointClick((d) => {
        onCountryClick(d.id);
        // Zoom to country with a medium zoom level
        globeInstance.current.pointOfView(
          { lat: d.lat, lng: d.lng, altitude: 1.5 },
          1000
        );
      })
      .onPointHover((d) => {
        setHoveredCountry(d ? d.id : null);
        if (d) {
          globeInstance.current.controls().autoRotate = false;
          clearTimeout(autoRotationTimeout.current);
        } else {
          autoRotationTimeout.current = setTimeout(() => {
            if (globeInstance.current) {
              globeInstance.current.controls().autoRotate = true;
            }
          }, 1000);
        }
      });

    // Start auto-rotation after initialization
    setTimeout(() => {
      if (globeInstance.current) {
        globeInstance.current.controls().autoRotate = true;
      }
    }, 2000);

    return () => {
      clearTimeout(autoRotationTimeout.current);
      if (globeInstance.current) {
        globeInstance.current._destructor();
      }
    };
  }, [countries, onCountryClick]);

  return (
    <div className="relative h-[600px] w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
      <div ref={globeEl} className="w-full h-full" />

      {hoveredCountry && (
        <div className="absolute top-4 left-4 bg-white/90 text-gray-800 px-3 py-2 rounded-lg shadow-md border border-gray-200">
          Click to view{" "}
          {countries.find((c) => c.cca3 === hoveredCountry)?.name.common}
        </div>
      )}

      <div className="absolute bottom-4 left-4 bg-white/90 text-gray-700 px-3 py-2 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
            />
          </svg>
          <span>Drag to rotate | Scroll to zoom</span>
        </div>
      </div>
    </div>
  );
};

const Countries = () => {
  const navigate = useNavigate();
  const { countries: allCountries, loading } = useCountries();
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const { user, toggleFavorite } = useAuth();
  const [languageFilter, setLanguageFilter] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const applyFilters = async () => {
      try {
        let results = allCountries;

        if (debouncedSearchTerm) {
          const searched = await searchCountries(debouncedSearchTerm);
          results = results.filter((c1) =>
            searched.some((c2) => c2.cca3 === c1.cca3)
          );
        }

        if (regionFilter) {
          const byRegion = await getCountriesByRegion(regionFilter);
          results = results.filter((c1) =>
            byRegion.some((c2) => c2.cca3 === c1.cca3)
          );
        }

        if (languageFilter) {
          const byLanguage = await getCountriesByLanguage(languageFilter);
          results = results.filter((c1) =>
            byLanguage.some((c2) => c2.cca3 === c1.cca3)
          );
        }

        setFilteredCountries(results);
      } catch (error) {
        toast.error("Failed to apply filters");
      }
    };

    if (allCountries.length > 0) {
      applyFilters();
    }
  }, [allCountries, debouncedSearchTerm, regionFilter, languageFilter]);

  const handleSearch = (term) => setSearchTerm(term);
  const handleRegionFilter = (region) => setRegionFilter(region);
  const handleLanguageFilter = (language) => setLanguageFilter(language);

  const handleCardClick = (countryCode) => {
    if (!user) {
      navigate("/login", {
        state: {
          from: `/countries/${countryCode}`,
          message: "Please login to view country details",
        },
      });
      return;
    }
    navigate(`/countries/${countryCode}`);
  };

  const handleToggleFavorite = async (countryCode) => {
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
      await toggleFavorite(countryCode);
      toast.success(
        user.favoriteCountries?.includes(countryCode)
          ? "Removed from favorites"
          : "Added to favorites"
      );
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            World Explorer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover every corner of our amazing planet
          </p>
        </motion.div>

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-xl bg-white p-1 shadow-md">
            {["list", "map", "globe"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  viewMode === mode
                    ? "bg-blue-600 text-white shadow-inner"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)} View
              </button>
            ))}
          </div>
        </div>

        {/* Filters Section */}
        <motion.div layout className="mb-10 bg-white rounded-2xl shadow-xl p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Search by name, capital, or region..."
              />
            </div>
            <RegionFilter
              onFilter={handleRegionFilter}
              selectedRegion={regionFilter}
            />
            <LanguageFilter
              onFilter={handleLanguageFilter}
              selectedLanguage={languageFilter}
            />
          </div>

          {/* Active filters */}
          {(searchTerm || regionFilter || languageFilter) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 flex flex-wrap gap-2"
            >
              {searchTerm && (
                <motion.span
                  layout
                  className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center"
                >
                  Search: {searchTerm}
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 text-blue-400 hover:text-blue-600"
                  >
                    ×
                  </button>
                </motion.span>
              )}
              {regionFilter && (
                <motion.span
                  layout
                  className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center"
                >
                  Region: {regionFilter}
                  <button
                    onClick={() => setRegionFilter("")}
                    className="ml-1 text-green-400 hover:text-green-600"
                  >
                    ×
                  </button>
                </motion.span>
              )}
              {languageFilter && (
                <motion.span
                  layout
                  className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center"
                >
                  Language: {languageFilter}
                  <button
                    onClick={() => setLanguageFilter("")}
                    className="ml-1 text-purple-400 hover:text-purple-600"
                  >
                    ×
                  </button>
                </motion.span>
              )}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setRegionFilter("");
                  setLanguageFilter("");
                }}
                className="text-xs font-medium text-gray-500 hover:text-gray-700"
              >
                Clear All
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {filteredCountries.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 bg-white rounded-2xl shadow-lg"
            >
              <div className="mx-auto w-24 h-24 text-gray-400 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No countries found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Try adjusting your search or filters.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchTerm("");
                  setRegionFilter("");
                  setLanguageFilter("");
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
              >
                Clear All Filters
              </motion.button>
            </motion.div>
          ) : viewMode === "list" ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredCountries.map((country) => (
                <motion.div
                  key={country.cca3}
                  layout
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CountryCard
                    country={country}
                    onToggleFavorite={handleToggleFavorite}
                    onClick={handleCardClick}
                    isFavorite={user?.favoriteCountries?.includes(country.cca3)}
                    isLoggedIn={!!user}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : viewMode === "map" ? (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <MapView
                countries={filteredCountries}
                onCountryClick={handleCardClick}
              />
            </motion.div>
          ) : (
            <motion.div
              key="globe"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden h-[600px]"
            >
              <InteractiveGlobe
                countries={filteredCountries}
                onCountryClick={handleCardClick}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Countries;
