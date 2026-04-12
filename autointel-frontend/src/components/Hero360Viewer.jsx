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
  const [loadedFrames, setLoadedFrames] = useState(new Set([0]));
  const [loadedCount, setLoadedCount] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartX = useRef(0);
  const lastFrameRef = useRef(0);

  const frameUrls = useMemo(() => {
    if (!BACKEND_URL) return [];

    return Array.from({ length: totalFrames }, (_, index) => {
      const frameNumber = padFrameNumber(index + 1);
      return `${BACKEND_URL}/media/frames/${filePrefix}${frameNumber}.${fileExtension}`;
    });
  }, [totalFrames, filePrefix, fileExtension]);

  useEffect(() => {
    if (!frameUrls.length) return;

    let cancelled = false;
    const preloadIndexes = [];

    for (let i = 0; i < Math.min(24, frameUrls.length); i += 1) {
      preloadIndexes.push(i);
    }

    preloadIndexes.forEach((index) => {
      const img = new Image();
      img.src = frameUrls[index];
      img.onload = img.onerror = () => {
        if (cancelled) return;
        setLoadedFrames((prev) => {
          if (prev.has(index)) return prev;
          const next = new Set(prev);
          next.add(index);
          setLoadedCount(next.size);
          return next;
        });
      };
    });

    return () => {
      cancelled = true;
    };
  }, [frameUrls]);

  useEffect(() => {
    if (!autoRotate || isDragging || totalFrames <= 1) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % totalFrames);
    }, 70);

    return () => clearInterval(interval);
  }, [autoRotate, isDragging, totalFrames]);

  useEffect(() => {
    if (!frameUrls[currentFrame]) return;
    if (loadedFrames.has(currentFrame)) return;

    const img = new Image();
    img.src = frameUrls[currentFrame];
    img.onload = img.onerror = () => {
      setLoadedFrames((prev) => {
        if (prev.has(currentFrame)) return prev;
        const next = new Set(prev);
        next.add(currentFrame);
        setLoadedCount(next.size);
        return next;
      });
    };
  }, [currentFrame, frameUrls, loadedFrames]);

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

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const handleTouchStart = (e) => {
    setIsDragging(true);
    dragStartX.current = e.touches[0].clientX;
    lastFrameRef.current = currentFrame;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    updateFrameFromDrag(e.touches[0].clientX);
  };

  const handleTouchEnd = () => setIsDragging(false);

  const progressPercent = totalFrames
    ? Math.round((loadedCount / totalFrames) * 100)
    : 0;

  if (!BACKEND_URL) {
    return (
      <div className="hero-360-viewer">
        <div className="hero-360-stage">
          <div className="hero-360-loader">
            <p>Backend image URL missing. Check VITE_BACKEND_URL.</p>
          </div>
        </div>
      </div>
    );
  }

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
        {loadedCount < Math.min(totalFrames, 24) && (
          <div className="hero-360-loader">
            <div className="hero-360-loader-ring"></div>
            <p>Loading hero view... {progressPercent}%</p>
          </div>
        )}

        {frameUrls[currentFrame] && (
          <img
            src={frameUrls[currentFrame]}
            alt={`Hero frame ${currentFrame + 1}`}
            className="hero-360-image"
            draggable="false"
          />
        )}

        <div className="hero-360-overlay">
          <span className="hero-360-badge">240-Frame Showcase</span>
          <span className="hero-360-hint">Drag to rotate</span>
        </div>
      </div>
    </div>
  );
}

export default Hero360Viewer;