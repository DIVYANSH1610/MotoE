import { useState } from "react";

function FavouriteButton({ slug }) {
  const [isFavourited, setIsFavourited] = useState(false);

  const handleToggleFavourite = (e) => {
    e.stopPropagation();
    e.preventDefault();

    // temporary UI toggle only
    setIsFavourited((prev) => !prev);

    console.log("TEMP favourite toggle:", slug);
  };

  return (
    <button
      type="button"
      onClick={handleToggleFavourite}
      className="race-fav-btn"
      title={isFavourited ? "Remove from favourites" : "Add to favourites"}
    >
      {isFavourited ? "❤️" : "🤍"}
    </button>
  );
}

export default FavouriteButton;
