import { useState } from "react";
import { X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "./CarDetailsGallery.css";

function CarDetailsGallery({ images = [], carName = "Car" }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupIndex, setPopupIndex] = useState(0);

  if (!images.length) return null;

  const openPopup = (index) => {
    setPopupIndex(index);
    setPopupOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closePopup = () => {
    setPopupOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <>
      <div className="car-details-gallery">
        <Swiper
          modules={[Navigation, Pagination, Thumbs]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={12}
          slidesPerView={1}
          allowTouchMove={true}
          simulateTouch={true}
          grabCursor={true}
          touchRatio={1}
          resistanceRatio={0.85}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          className="car-details-main-swiper"
        >
          {images.map((img, index) => (
            <SwiperSlide key={`${img}-${index}`}>
              <div
                className="car-details-main-image-wrap"
                onClick={() => openPopup(index)}
              >
                <img
                  src={img}
                  alt={`${carName} ${index + 1}`}
                  className="car-details-main-image"
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
            watchSlidesProgress
            spaceBetween={10}
            slidesPerView={4}
            allowTouchMove={true}
            breakpoints={{
              0: { slidesPerView: 3 },
              640: { slidesPerView: 4 },
              900: { slidesPerView: 5 },
            }}
            className="car-details-thumbs-swiper"
          >
            {images.map((img, index) => (
              <SwiperSlide key={`car-thumb-${img}-${index}`}>
                <button
                  type="button"
                  className="car-details-thumb"
                  onClick={() => {
                    if (thumbsSwiper && !thumbsSwiper.destroyed) {
                      thumbsSwiper.slideTo(index);
                    }
                  }}
                >
                  <img
                    src={img}
                    alt={`${carName} thumb ${index + 1}`}
                    draggable="false"
                  />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {popupOpen && (
        <div className="car-popup-overlay" onClick={closePopup}>
          <button
            type="button"
            className="car-popup-close"
            onClick={closePopup}
          >
            <X size={22} />
          </button>

          <div
            className="car-popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              initialSlide={popupIndex}
              slidesPerView={1}
              className="car-popup-swiper"
            >
              {images.map((img, index) => (
                <SwiperSlide key={`popup-${img}-${index}`}>
                  <div className="car-popup-image-wrap">
                    <img
                      src={img}
                      alt={`${carName} popup ${index + 1}`}
                      className="car-popup-image"
                      draggable="false"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </>
  );
}

export default CarDetailsGallery;