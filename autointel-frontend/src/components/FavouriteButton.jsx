import { useEffect, useState } from "react";
import {
  addFavourite,
  removeFavourite,
  getFavouriteStatus,
} from "../services/favouriteApi";

function FavouriteButton({ slug }) {
  const [isFavourited, setIsFavourited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavouriteStatus = async () => {
      try {
        const response = await getFavouriteStatus(slug);
        setIsFavourited(response.data.is_favourited);
      } catch (error) {
        console.error("Favourite status error:", error.response?.data || error);
        setIsFavourited(false);
      }
    };

    if (slug) {
      fetchFavouriteStatus();
    }
  }, [slug]);

  const handleToggleFavourite = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      if (isFavourited) {
        await removeFavourite(slug);
        setIsFavourited(false);
      } else {
        await addFavourite(slug);
        setIsFavourited(true);
      }

      window.dispatchEvent(new Event("favourites-updated"));
    } catch (error) {
      console.error("Favourite toggle failed:", error.response?.data || error);

      if (error.response?.status === 401) {
        alert("Please login first to use favourites.");
      } else if (error.response?.status === 403) {
        alert("Request blocked. CSRF/session permission issue on deployed server.");
      } else {
        alert("Something went wrong while updating favourites.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggleFavourite}
      disabled={loading}
      className="race-fav-btn"
      title={isFavourited ? "Remove from favourites" : "Add to favourites"}
    >
      {loading ? "..." : isFavourited ? "❤️" : "🤍"}
    </button>
  );
}

export default FavouriteButton;
