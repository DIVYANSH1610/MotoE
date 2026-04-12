import { X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import { useEffect, useState } from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "./GalleryLightbox.css";

function GalleryLightbox({
  images,
  currentIndex,
  onClose,
  onSelect,
  carName,
}) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="lightbox-close" onClick={onClose}>
          <X size={22} />
        </button>

        <div className="lightbox-header">
          <h3>{carName}</h3>
        </div>

        <Swiper
          modules={[Navigation, Thumbs]}
          navigation
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          initialSlide={currentIndex}
          className="lightbox-main-swiper"
          onSlideChange={(swiper) => onSelect(swiper.activeIndex)}
        >
          {images.map((img, index) => (
            <SwiperSlide key={`${img}-${index}`}>
              <div className="lightbox-image-wrap">
                <img
                  src={img}
                  alt={`${carName} ${index + 1}`}
                  className="lightbox-main-image"
                  draggable="false"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {images.length > 1 && (
          <Swiper
            modules={[Thumbs]}
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            watchSlidesProgress
            breakpoints={{
              0: { slidesPerView: 3 },
              640: { slidesPerView: 4 },
              900: { slidesPerView: 5 },
            }}
            className="lightbox-thumbs-swiper"
          >
            {images.map((img, index) => (
              <SwiperSlide key={`thumb-${img}-${index}`}>
                <button
                  type="button"
                  className="lightbox-thumb"
                  onClick={() => onSelect(index)}
                >
                  <img src={img} alt={`thumb-${index + 1}`} draggable="false" />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
}

export default GalleryLightbox;