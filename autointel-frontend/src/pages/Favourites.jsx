import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Heart, ShieldCheck } from "lucide-react";
import { getFavourites } from "../services/favouriteApi";
import { getCars } from "../services/api";
import CarCard from "../components/CarCard";
import PremiumSectionHeader from "../components/PremiumSectionHeader";
import GlassCard from "../components/GlassCard";
import StatBadge from "../components/StatBadge";
import TyreLoader from "../components/TyreLoader";
import "./Favourites.css";

function Favourites() {
  const [favouriteCars, setFavouriteCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [favouritesRes, carsRes] = await Promise.all([
        getFavourites(),
        getCars(),
      ]);

      const favouritesData = Array.isArray(favouritesRes.data)
        ? favouritesRes.data
        : favouritesRes.data?.favourites || [];

      const favouriteSlugs = new Set(
        favouritesData
          .map((item) => item.car_slug || item.slug)
          .filter(Boolean)
      );

      const cars = Array.isArray(carsRes.data)
        ? carsRes.data
        : carsRes.data?.cars || [];

      const filteredCars = cars.filter((car) => favouriteSlugs.has(car.slug));

      setFavouriteCars(filteredCars);
    } catch (error) {
      console.error("Failed to load favourites:", error);
      setFavouriteCars([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, location.pathname]);

  useEffect(() => {
    const handleFocus = () => {
      if (location.pathname === "/favourites") {
        fetchData();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchData, location.pathname]);

  if (loading) {
    return (
      <div className="favourites-page">
        <div className="favourites-container">
          <PremiumSectionHeader
            kicker="Your Personal Garage"
            title="Loading Your Favourites..."
            subtitle="Fetching your saved dream machines."
          />
          <TyreLoader label="Loading your favourites..." />
        </div>
      </div>
    );
  }

  return (
    <div className="favourites-page">
      <div className="favourites-bg-orb favourites-orb-1"></div>
      <div className="favourites-bg-orb favourites-orb-2"></div>
      <div className="favourites-bg-orb favourites-orb-3"></div>

      <div className="favourites-container">
        <GlassCard
          className="favourites-hero-shell"
          padding="large"
          hover={false}
        >
          <PremiumSectionHeader
            kicker="Your Personal Garage"
            title="Saved Favourites"
            subtitle="A curated collection of the performance machines you love most."
          />

          <div className="favourites-stats">
            <StatBadge
              label="Total Saved"
              value={favouriteCars.length}
              icon={Heart}
            />
            <StatBadge
              label="Status"
              value="Synced"
              icon={ShieldCheck}
            />
          </div>
        </GlassCard>

        {favouriteCars.length === 0 ? (
          <GlassCard
            className="favourites-empty-state"
            padding="large"
            hover={false}
          >
            <div className="empty-icon">❤️</div>
            <h2>No Favourite Cars Yet</h2>
            <p>
              Start exploring the collection and save the cars that catch your
              eye. Your favourites will appear here.
            </p>
            <a href="/" className="favourites-home-btn">
              Explore Cars
            </a>
          </GlassCard>
        ) : (
          <section className="favourites-grid-section">
            <div className="favourites-grid">
              {favouriteCars.map((car) => (
                <CarCard key={car.slug} car={car} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Favourites;