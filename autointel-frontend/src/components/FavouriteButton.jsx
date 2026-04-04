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
        setIsFavourited(
          response.data?.is_favourited ??
            response.data?.is_favorited ??
            false
        );
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

    if (loading || !slug) return;

    try {
      setLoading(true);

      console.log("NEW FavouriteButton clicked:", slug);

      if (isFavourited) {
        const response = await removeFavourite(slug);
        console.log("Remove favourite success:", response.data);
        setIsFavourited(false);
      } else {
        const response = await addFavourite(slug);
        console.log("Add favourite success:", response.data);
        setIsFavourited(true);
      }

      window.dispatchEvent(new Event("favourites-updated"));
    } catch (error) {
      console.error("Favourite toggle failed FULL:", error);
      console.error("Favourite toggle failed RESPONSE:", error.response?.data);
      console.error("Favourite toggle failed STATUS:", error.response?.status);

      const detail =
        error.response?.data?.detail ||
        error.response?.data?.error ||
        error.message ||
        "Something went wrong while updating favourites.";

      alert(detail);
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
