import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import { useState } from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "./CarDetailsGallery.css";

function CarDetailsGallery({ images = [], carName = "Car" }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  if (!images.length) return null;

  return (
    <div className="car-details-gallery">
      <Swiper
        modules={[Navigation, Pagination, Thumbs]}
        navigation
        pagination={{ clickable: true }}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        className="car-details-main-swiper"
      >
        {images.map((img, index) => (
          <SwiperSlide key={`${img}-${index}`}>
            <div className="car-details-main-image-wrap">
              <img
                src={img}
                alt={`${carName} ${index + 1}`}
                className="car-details-main-image"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        modules={[Thumbs]}
        onSwiper={setThumbsSwiper}
        watchSlidesProgress
        spaceBetween={10}
        slidesPerView={4}
        breakpoints={{
          0: { slidesPerView: 3 },
          640: { slidesPerView: 4 },
          900: { slidesPerView: 5 },
        }}
        className="car-details-thumbs-swiper"
      >
        {images.map((img, index) => (
          <SwiperSlide key={`car-thumb-${img}-${index}`}>
            <button type="button" className="car-details-thumb">
              <img src={img} alt={`${carName} thumb ${index + 1}`} />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default CarDetailsGallery;