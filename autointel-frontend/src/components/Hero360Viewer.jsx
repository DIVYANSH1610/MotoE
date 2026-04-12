import { useEffect, useMemo, useRef, useState } from "react";
import "./Hero360Viewer.css";

// ✅ FIX 1: Fallback to the known Render URL if env var is missing
const BACKEND_URL = (
  import.meta.env.VITE_BACKEND_URL || "https://motoe.onrender.com"
).replace(/\/+$/, "");

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
  const [loadedFrames, setLoadedFrames] = useState(new Set());
  const [loadedCount, setLoadedCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  // ✅ FIX 2: Track failed frames so loader doesn't hang forever
  const [failedCount, setFailedCount] = useState(0);

  const dragStartX = useRef(0);
  const lastFrameRef = useRef(0);

  const PRELOAD_COUNT = Math.min(24, totalFrames);

  const frameUrls = useMemo(() => {
    return Array.from({ length: totalFrames }, (_, index) => {
      const frameNumber = padFrameNumber(index + 1);
      return `${BACKEND_URL}/media/frames/${filePrefix}${frameNumber}.${fileExtension}`;
    });
  }, [totalFrames, filePrefix, fileExtension]);

  // ✅ FIX 3: Preload first 24 frames, counting both successes AND failures
  useEffect(() => {
    if (!frameUrls.length) return;

    let cancelled = false;

    Array.from({ length: PRELOAD_COUNT }, (_, i) => i).forEach((index) => {
      const img = new Image();
      img.src = frameUrls[index];

      img.onload = () => {
        if (cancelled) return;
        setLoadedFrames((prev) => {
          if (prev.has(index)) return prev;
          const next = new Set(prev);
          next.add(index);
          setLoadedCount(next.size);
          return next;
        });
      };

      img.onerror = () => {
        if (cancelled) return;
        // Count failures so the loader doesn't hang if images are broken
        setFailedCount((prev) => prev + 1);
      };
    });

    return () => {
      cancelled = true;
    };
  }, [frameUrls, PRELOAD_COUNT]);

  // Auto-rotate
  useEffect(() => {
    if (!autoRotate || isDragging || totalFrames <= 1) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % totalFrames);
    }, 70);

    return () => clearInterval(interval);
  }, [autoRotate, isDragging, totalFrames]);

  // Lazy-load current frame on demand
  useEffect(() => {
    if (!frameUrls[currentFrame]) return;
    if (loadedFrames.has(currentFrame)) return;

    const img = new Image();
    img.src = frameUrls[currentFrame];
    img.onload = () => {
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

  // ✅ FIX 4: Loading is done when (successes + failures) >= PRELOAD_COUNT
  const isLoading = loadedCount + failedCount < PRELOAD_COUNT;
  const progressPercent = Math.round(
    ((loadedCount + failedCount) / PRELOAD_COUNT) * 100
  );

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
        {isLoading && (
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
        </div>
      </div>
    </div>
  );
}

export default Hero360Viewer;