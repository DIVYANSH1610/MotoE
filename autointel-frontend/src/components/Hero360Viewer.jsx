import { useEffect, useMemo, useRef, useState } from "react";
import "./Hero360Viewer.css";

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");

function padFrameNumber(num) {
  return String(num).padStart(3, "0");
}

function Hero360Viewer({
  totalFrames = 240,
  filePrefix = "ezgif-frame-",
  fileExtension = "jpg",
  autoRotate = true,
}) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartX = useRef(0);
  const lastFrameRef = useRef(0);

  const frameUrls = useMemo(() => {
    return Array.from({ length: totalFrames }, (_, index) => {
      const frameNumber = padFrameNumber(index + 1);
      return `${BACKEND_URL}/media/frames/${filePrefix}${frameNumber}.${fileExtension}`;
    });
  }, [totalFrames, filePrefix, fileExtension]);

  useEffect(() => {
    let cancelled = false;
    let count = 0;

    frameUrls.forEach((src) => {
      const img = new Image();
      img.src = src;

      const markLoaded = () => {
        if (cancelled) return;
        count += 1;
        setLoadedCount(count);
      };

      img.onload = markLoaded;
      img.onerror = markLoaded;
    });

    return () => {
      cancelled = true;
    };
  }, [frameUrls]);

  useEffect(() => {
    if (!autoRotate || isDragging || totalFrames <= 1) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % totalFrames);
    }, 50);

    return () => clearInterval(interval);
  }, [autoRotate, isDragging, totalFrames]);

  const updateFrameFromDrag = (clientX) => {
    const deltaX = clientX - dragStartX.current;
    const sensitivity = 4;
    const frameOffset = Math.floor(deltaX / sensitivity);

    let nextFrame = (lastFrameRef.current + frameOffset) % totalFrames;
    if (nextFrame < 0) nextFrame += totalFrames;

    setCurrentFrame(nextFrame);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    lastFrameRef.current = currentFrame;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    updateFrameFromDrag(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    dragStartX.current = e.touches[0].clientX;
    lastFrameRef.current = currentFrame;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    updateFrameFromDrag(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const progressPercent = totalFrames
    ? Math.round((loadedCount / totalFrames) * 100)
    : 0;

  return (
    <div className="hero-360-viewer">
      <div
        className="hero-360-stage"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {loadedCount < totalFrames && (
          <div className="hero-360-loader">
            <div className="hero-360-loader-ring"></div>
            <p>Loading hero view... {progressPercent}%</p>
          </div>
        )}

        <img
          src={frameUrls[currentFrame]}
          alt={`Hero frame ${currentFrame + 1}`}
          className="hero-360-image"
          draggable="false"
        />

        <div className="hero-360-overlay">
          <span className="hero-360-badge">240-Frame Showcase</span>
          <span className="hero-360-hint">Drag to rotate</span>
        </div>
      </div>
    </div>
  );
}

export default Hero360Viewer;