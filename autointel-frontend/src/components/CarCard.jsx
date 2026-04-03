import { useNavigate } from "react-router-dom";
import { Gauge, Zap, Fuel, TimerReset } from "lucide-react";
import FavouriteButton from "./FavouriteButton";
import "./CarCard.css";

function CarCard({ car }) {
  const navigate = useNavigate();

  const goToDetails = () => {
    sessionStorage.setItem("homeScrollY", String(window.scrollY));
    sessionStorage.setItem("homeLastCarSlug", car.slug);
    navigate(`/cars/${car.slug}`);
  };

  const handleCardKeyDown = (e) => {
    if (
      e.target.closest("button") ||
      e.target.closest("a") ||
      e.target.closest('[data-stop-card-click="true"]')
    ) {
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToDetails();
    }
  };

  return (
    <div
      className="race-card"
      onClick={goToDetails}
      role="button"
      tabIndex={0}
      onKeyDown={handleCardKeyDown}
    >
      <div className="race-card__frame"></div>

      <div className="race-card__media">
        <div className="race-card__scanline"></div>
        <div className="race-card__glow"></div>

        <img
          src={car.image}
          alt={car.car_name}
          className="race-card__image"
        />

        <div className="race-card__overlay"></div>

        <div className="race-card__topbar">
          <div
            className="race-card__fav"
            data-stop-card-click="true"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <FavouriteButton slug={car.slug} />
          </div>

          <div className="race-card__brand-tag">{car.company}</div>
        </div>

        <div className="race-card__price-tag">{car.price}</div>
      </div>

      <div className="race-card__body">
        <div className="race-card__title-row">
          <div>
            <p className="race-card__label">Machine ID</p>
            <h2 className="race-card__title">{car.car_name}</h2>
          </div>
        </div>

        <p className="race-card__subtitle">
          Engineered for speed, control, presence, and pure driving intensity.
        </p>

        <div className="race-card__stats">
          <div className="race-stat">
            <div className="race-stat__icon">
              <Zap size={15} />
            </div>
            <div className="race-stat__content">
              <span>Power</span>
              <strong>{car.horsepower}</strong>
            </div>
          </div>

          <div className="race-stat">
            <div className="race-stat__icon">
              <Gauge size={15} />
            </div>
            <div className="race-stat__content">
              <span>Top Speed</span>
              <strong>{car.top_speed}</strong>
            </div>
          </div>

          <div className="race-stat">
            <div className="race-stat__icon">
              <TimerReset size={15} />
            </div>
            <div className="race-stat__content">
              <span>0-100</span>
              <strong>{car.performance_0_100}</strong>
            </div>
          </div>

          <div className="race-stat">
            <div className="race-stat__icon">
              <Fuel size={15} />
            </div>
            <div className="race-stat__content">
              <span>Fuel</span>
              <strong>{car.fuel_type}</strong>
            </div>
          </div>
        </div>

        <div className="race-card__footer">
          <button
            type="button"
            className="race-card__button"
            onClick={(e) => {
              e.stopPropagation();
              goToDetails();
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default CarCard;