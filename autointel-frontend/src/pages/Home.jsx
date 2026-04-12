import { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { getCars } from "../services/api";
import CarCard from "../components/CarCard";
import PremiumSectionHeader from "../components/PremiumSectionHeader";
import GalleryLightbox from "../components/GalleryLightbox";
import TyreLoader from "../components/TyreLoader";
import HeroSection from "../components/HeroSection";
import "./Home.css";

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");

function Home() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const resolveImageUrl = useCallback((imagePath) => {
    if (!imagePath) return "";

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://") ||
      imagePath.startsWith("data:")
    ) {
      return imagePath;
    }

    const cleanedPath = imagePath.replace(/\\/g, "/").replace(/^\/+/, "");

    if (!BACKEND_URL) return `/${cleanedPath}`;

    if (cleanedPath.startsWith("media/")) {
      return `${BACKEND_URL}/${cleanedPath}`;
    }

    if (cleanedPath.startsWith("data/images/")) {
      return `${BACKEND_URL}/${cleanedPath}`;
    }

    if (
      cleanedPath.endsWith(".png") ||
      cleanedPath.endsWith(".jpg") ||
      cleanedPath.endsWith(".jpeg") ||
      cleanedPath.endsWith(".webp") ||
      cleanedPath.endsWith(".avif")
    ) {
      return `${BACKEND_URL}/media/${cleanedPath}`;
    }

    return `${BACKEND_URL}/${cleanedPath}`;
  }, []);

  useEffect(() => {
    getCars()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.cars || [];
        setCars(data);
      })
      .catch((err) => console.error("Failed to fetch cars:", err))
      .finally(() => setLoading(false));
  }, []);

  const galleryImages = useMemo(() => {
    return cars
      .flatMap((car) => {
        if (Array.isArray(car.gallery) && car.gallery.length) {
          return car.gallery.map((img) => ({
            src: resolveImageUrl(img),
            label: car.car_name,
          }));
        }

        return car.image
          ? [
              {
                src: resolveImageUrl(car.image),
                label: car.car_name,
              },
            ]
          : [];
      })
      .filter((item) => item.src)
      .slice(0, 24);
  }, [cars, resolveImageUrl]);

  useEffect(() => {
    if (!loading) {
      const savedScroll = sessionStorage.getItem("homeScrollY");
      if (savedScroll) {
        requestAnimationFrame(() => {
          window.scrollTo({
            top: Number(savedScroll),
            behavior: "auto",
          });
          sessionStorage.removeItem("homeScrollY");
        });
      }
    }
  }, [loading]);

  const scrollToSection = (sectionId) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openLightbox = useCallback((index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const handleSelectImage = useCallback((index) => {
    setCurrentImageIndex(index);
  }, []);

  return (
    <div className="home-page">
      <div className="home-wrapper">
        <HeroSection onExplore={() => scrollToSection("#explore")} />

        <motion.section
          id="featured"
          className="section-block"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <PremiumSectionHeader
            kicker="Curated Selection"
            title="Featured Machines"
            subtitle="Handpicked high-performance and luxury cars."
          />

          {loading ? (
            <TyreLoader label="Loading featured machines..." />
          ) : (
            <div className="car-grid">
              {cars.slice(0, 6).map((car) => (
                <CarCard key={car.slug || car.id} car={car} />
              ))}
            </div>
          )}
        </motion.section>

        <motion.section
          id="explore"
          className="section-block"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.42 }}
        >
          <PremiumSectionHeader
            kicker="Garage Collection"
            title="Explore All Cars"
            subtitle="Browse the complete collection of automotive excellence."
          />

          {loading ? (
            <TyreLoader label="Loading garage collection..." />
          ) : (
            <div className="car-grid">
              {cars.map((car) => (
                <CarCard key={car.slug || car.id} car={car} />
              ))}
            </div>
          )}
        </motion.section>

        <motion.section
          id="performance"
          className="section-block performance-section"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.44 }}
        >
          <PremiumSectionHeader
            kicker="Engineering Focus"
            title="Performance Insights"
            subtitle="Power, speed, engineering, and driving emotion explained."
          />

          <div className="performance-grid">
            <motion.div
              className="performance-card"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <h3>Horsepower</h3>
              <p>
                Discover how raw power defines throttle response, driving
                character, and speed potential.
              </p>
            </motion.div>

            <motion.div
              className="performance-card"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <h3>Top Speed</h3>
              <p>
                Explore the machines that push aerodynamic engineering and
                mechanical precision to the limit.
              </p>
            </motion.div>

            <motion.div
              className="performance-card"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <h3>Acceleration</h3>
              <p>
                Understand how 0–100 km/h times reflect traction, tuning,
                gearing, and real-world urgency.
              </p>
            </motion.div>

            <motion.div
              className="performance-card"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <h3>Engineering</h3>
              <p>
                Deep dive into engines, torque delivery, weight balance, and the
                technology behind performance.
              </p>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          id="gallery"
          className="section-block gallery-section"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.46 }}
        >
          <PremiumSectionHeader
            kicker="Visual Identity"
            title="Visual Gallery"
            subtitle="Tap any image to open it in a premium popup viewer."
          />

          {loading ? (
            <TyreLoader label="Loading gallery..." />
          ) : (
            <>
              <div className="gallery-grid desktop-gallery">
                {galleryImages.map((item, index) => (
                  <motion.button
                    key={`${item.src}-${index}`}
                    type="button"
                    className="gallery-item"
                    whileHover={{ y: -6, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.22 }}
                    onClick={() => openLightbox(index)}
                  >
                    <img src={item.src} alt={item.label} />
                    <div className="gallery-item-overlay">
                      <span>{item.label}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mobile-gallery-swiper-wrap">
                <Swiper
                  modules={[Pagination]}
                  slidesPerView={1.08}
                  spaceBetween={14}
                  grabCursor={true}
                  allowTouchMove={true}
                  simulateTouch={true}
                  touchRatio={1}
                  pagination={{ clickable: true }}
                  breakpoints={{
                    0: { slidesPerView: 1.05, spaceBetween: 12 },
                    480: { slidesPerView: 1.15, spaceBetween: 14 },
                    640: { slidesPerView: 1.35, spaceBetween: 14 },
                    768: { slidesPerView: 1.6, spaceBetween: 16 },
                  }}
                  className="mobile-gallery-swiper"
                >
                  {galleryImages.map((item, index) => (
                    <SwiperSlide key={`${item.src}-${index}`}>
                      <div
                        className="mobile-gallery-item"
                        onClick={() => openLightbox(index)}
                      >
                        <img src={item.src} alt={item.label} />
                        <div className="gallery-item-overlay">
                          <span>{item.label}</span>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </>
          )}
        </motion.section>
      </div>

      {lightboxOpen && galleryImages.length > 0 && (
        <GalleryLightbox
          images={galleryImages.map((item) => item.src)}
          currentIndex={currentImageIndex}
          onClose={closeLightbox}
          onSelect={handleSelectImage}
          carName={galleryImages[currentImageIndex]?.label || "Garage Gallery"}
        />
      )}
    </div>
  );
}

export default Home;