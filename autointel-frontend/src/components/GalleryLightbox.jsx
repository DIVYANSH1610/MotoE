import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import "./GalleryLightbox.css";

function GalleryLightbox({
  images = [],
  currentIndex = 0,
  onClose,
  onPrev,
  onNext,
  onSelect,
  carName = "Car Gallery",
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose && onClose();
      if (e.key === "ArrowLeft") onPrev && onPrev();
      if (e.key === "ArrowRight") onNext && onNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  if (!images.length || !images[currentIndex]) return null;

  return (
    <div className="lightbox-backdrop" onClick={onClose}>
      <div className="lightbox-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="lightbox-close"
          onClick={onClose}
          aria-label="Close gallery"
        >
          <X size={22} />
        </button>

        {images.length > 1 && (
          <>
            <button
              type="button"
              className="lightbox-nav lightbox-nav-left"
              onClick={onPrev}
              aria-label="Previous image"
            >
              <ChevronLeft size={26} />
            </button>

            <button
              type="button"
              className="lightbox-nav lightbox-nav-right"
              onClick={onNext}
              aria-label="Next image"
            >
              <ChevronRight size={26} />
            </button>
          </>
        )}

        <div className="lightbox-image-wrap">
          <img
            src={images[currentIndex]}
            alt={`${carName} ${currentIndex + 1}`}
            className="lightbox-image"
            draggable={false}
          />
        </div>

        <div className="lightbox-footer">
          <div className="lightbox-topline">
            <div className="lightbox-counter">
              {currentIndex + 1} / {images.length}
            </div>
            <div className="lightbox-title">{carName}</div>
          </div>

          {images.length > 1 && (
            <div className="lightbox-thumbs">
              {images.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  className={`lightbox-thumb ${
                    index === currentIndex ? "active" : ""
                  }`}
                  onClick={() => onSelect && onSelect(index)}
                  aria-label={`View image ${index + 1}`}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GalleryLightbox;