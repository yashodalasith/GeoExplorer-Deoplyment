import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Parallax } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/parallax";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { motion } from "framer-motion";

// Import high-quality images (replace with your actual assets)
import EiffelTowerImage from "../assets/eiffel-tower.png";
import GreatWallImage from "../assets/great-wall.png";
import TajMahalImage from "../assets/taj-mahal.png";
import AuroraImage from "../assets/northern-lights.png";
import SafariImage from "../assets/safari.png";
import BeachImage from "../assets/tropical-beach.png";

const Home = () => {
  const { user } = useAuth();
  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  const stats = [
    { value: "195", label: "Countries" },
    { value: "7", label: "Continents" },
    { value: "6500+", label: "Languages" },
    { value: "8B+", label: "People" },
  ];

  const features = [
    {
      icon: "🌎",
      title: "Global Coverage",
      description:
        "Detailed profiles for every recognized country in the world",
    },
    {
      icon: "📊",
      title: "Rich Data",
      description: "Population, languages, currencies, and much more",
    },
    {
      icon: "❤️",
      title: "Favorites",
      description: "Save your favorite countries for quick access",
    },
    {
      icon: "🔍",
      title: "Advanced Search",
      description: "Find countries by region, language, or other criteria",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 z-0">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fpsLimit: 60,
            interactivity: {
              events: {
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
              },
              modes: {
                repulse: {
                  distance: 100,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: "#3b82f6",
              },
              links: {
                color: "#93c5fd",
                distance: 150,
                enable: true,
                opacity: 0.3,
                width: 1,
              },
              collisions: {
                enable: true,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: 1,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 60,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 3 },
              },
            },
            detectRetina: true,
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">
              Discover Our World
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto mb-10">
            Explore every corner of the planet with our comprehensive country
            profiles, stunning visuals, and fascinating cultural insights.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/countries"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-lg"
              >
                Explore Countries
              </Link>
            </motion.div>

            {!user && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-lg"
                >
                  Join Our Community
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Globe Animation Placeholder */}
        <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 relative mt-10">
          <div className="absolute inset-0 rounded-full border-4 border-blue-400/30 animate-spin-slow"></div>
          <div className="absolute inset-4 rounded-full border-4 border-indigo-400/30 animate-spin-slow-reverse"></div>
          <div className="absolute inset-8 rounded-full bg-blue-500/10 backdrop-blur-sm flex items-center justify-center">
            <span className="text-6xl">🌍</span>
          </div>
        </div>
      </section>

      {/* Featured Destinations Slider */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Journey Through Wonders
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover some of the most breathtaking destinations our planet has
              to offer
            </p>
          </motion.div>

          <Swiper
            modules={[Autoplay, EffectFade, Parallax]}
            effect="fade"
            parallax={true}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            speed={1000}
            className="h-[500px] sm:h-[600px] rounded-3xl shadow-2xl overflow-hidden"
          >
            <SwiperSlide>
              <div className="relative h-full w-full">
                <div
                  className="absolute inset-0 bg-black/30 z-10 flex items-center justify-center"
                  data-swiper-parallax="-300"
                >
                  <div className="text-center px-4">
                    <h3
                      className="text-4xl sm:text-5xl font-bold text-white mb-4"
                      data-swiper-parallax="-200"
                    >
                      Paris, France
                    </h3>
                    <p
                      className="text-xl text-white max-w-2xl mx-auto"
                      data-swiper-parallax="-100"
                    >
                      The City of Light, home to the iconic Eiffel Tower and
                      world-class art
                    </p>
                  </div>
                </div>
                <img
                  src={EiffelTowerImage}
                  alt="Eiffel Tower"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="relative h-full w-full">
                <div className="absolute inset-0 bg-black/30 z-10 flex items-center justify-center">
                  <div className="text-center px-4">
                    <h3 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                      Great Wall, China
                    </h3>
                    <p className="text-xl text-white max-w-2xl mx-auto">
                      The longest wall in the world, stretching over 21,000
                      kilometers
                    </p>
                  </div>
                </div>
                <img
                  src={GreatWallImage}
                  alt="Great Wall of China"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="relative h-full w-full">
                <div className="absolute inset-0 bg-black/30 z-10 flex items-center justify-center">
                  <div className="text-center px-4">
                    <h3 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                      Taj Mahal, India
                    </h3>
                    <p className="text-xl text-white max-w-2xl mx-auto">
                      A white marble mausoleum and one of the New Seven Wonders
                      of the World
                    </p>
                  </div>
                </div>
                <img
                  src={TajMahalImage}
                  alt="Taj Mahal"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="relative h-full w-full">
                <div className="absolute inset-0 bg-black/30 z-10 flex items-center justify-center">
                  <div className="text-center px-4">
                    <h3 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                      Northern Lights
                    </h3>
                    <p className="text-xl text-white max-w-2xl mx-auto">
                      Nature's most spectacular light show in polar regions
                    </p>
                  </div>
                </div>
                <img
                  src={AuroraImage}
                  alt="Northern Lights"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="relative h-full w-full">
                <div className="absolute inset-0 bg-black/30 z-10 flex items-center justify-center">
                  <div className="text-center px-4">
                    <h3 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                      African Safari
                    </h3>
                    <p className="text-xl text-white max-w-2xl mx-auto">
                      Witness the majestic wildlife in their natural habitats
                    </p>
                  </div>
                </div>
                <img
                  src={SafariImage}
                  alt="African Safari"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="relative h-full w-full">
                <div className="absolute inset-0 bg-black/30 z-10 flex items-center justify-center">
                  <div className="text-center px-4">
                    <h3 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                      Tropical Paradise
                    </h3>
                    <p className="text-xl text-white max-w-2xl mx-auto">
                      Pristine beaches with crystal clear waters around the
                      world
                    </p>
                  </div>
                </div>
                <img
                  src={BeachImage}
                  alt="Tropical Beach"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      {/* World Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-indigo-900 text-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Our Amazing Planet
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Fascinating facts about the world we live in
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="text-4xl sm:text-5xl font-bold text-blue-300 mb-2">
                  {stat.value}
                </div>
                <div className="text-lg text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Why Explore With Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover what makes our platform the ultimate resource for global
              exploration
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-xl transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-indigo-500 to-blue-600 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Explore the World?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
              Join thousands of explorers discovering our planet's wonders every
              day
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/countries"
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-lg"
                >
                  Browse Countries
                </Link>
              </motion.div>

              {!user && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="px-8 py-4 bg-indigo-700 text-white rounded-xl hover:bg-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-lg"
                  >
                    Create Free Account
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Inspirational Quote */}
      <footer className="py-12 bg-gray-900 text-white relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="text-2xl sm:text-3xl font-light italic mb-6">
            "The world is a book, and those who do not travel read only one
            page."
          </blockquote>
          <p className="text-lg text-gray-400">— Saint Augustine</p>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-500">
              Did you know? Vatican City is the smallest country in the world at
              just 0.49 km²!
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
