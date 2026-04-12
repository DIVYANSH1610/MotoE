import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import "./Hero360Viewer.css";

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
  const [loadedFrames, setLoadedFrames]   = useState(new Set());
  const [loadedCount,  setLoadedCount]    = useState(0);
  const [failedCount,  setFailedCount]    = useState(0);
  const [isDragging,   setIsDragging]     = useState(false);

  // Use refs for drag state to avoid stale closures
  const isDraggingRef  = useRef(false);
  const dragStartX     = useRef(0);
  const lastFrameRef   = useRef(0);

  const PRELOAD_COUNT = Math.min(24, totalFrames);

  const frameUrls = useMemo(() => {
    return Array.from({ length: totalFrames }, (_, i) => {
      const n = padFrameNumber(i + 1);
      return `${BACKEND_URL}/media/frames/${filePrefix}${n}.${fileExtension}`;
    });
  }, [totalFrames, filePrefix, fileExtension]);

  // Preload first batch
  useEffect(() => {
    if (!frameUrls.length) return;
    let cancelled = false;
    for (let i = 0; i < PRELOAD_COUNT; i++) {
      const img = new Image();
      img.src = frameUrls[i];
      const idx = i;
      img.onload = () => {
        if (cancelled) return;
        setLoadedFrames(prev => {
          if (prev.has(idx)) return prev;
          const next = new Set(prev);
          next.add(idx);
          setLoadedCount(next.size);
          return next;
        });
      };
      img.onerror = () => { if (!cancelled) setFailedCount(p => p + 1); };
    }
    return () => { cancelled = true; };
  }, [frameUrls, PRELOAD_COUNT]);

  // Auto-rotate — only when not dragging
  useEffect(() => {
    if (!autoRotate || totalFrames <= 1) return;
    const id = setInterval(() => {
      if (!isDraggingRef.current) {
        setCurrentFrame(p => (p + 1) % totalFrames);
      }
    }, 70);
    return () => clearInterval(id);
  }, [autoRotate, totalFrames]);

  // Lazy-load current frame
  useEffect(() => {
    const url = frameUrls[currentFrame];
    if (!url || loadedFrames.has(currentFrame)) return;
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setLoadedFrames(prev => {
        if (prev.has(currentFrame)) return prev;
        const next = new Set(prev);
        next.add(currentFrame);
        setLoadedCount(next.size);
        return next;
      });
    };
  }, [currentFrame, frameUrls, loadedFrames]);

  // ── DRAG HANDLERS ────────────────────────────────
  // Using window-level listeners so drag works even if pointer
  // leaves the element — this was the root cause of the broken drag.

  const startDrag = useCallback((clientX) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartX.current  = clientX;
    lastFrameRef.current = currentFrame;
  }, [currentFrame]);

  const moveDrag = useCallback((clientX) => {
    if (!isDraggingRef.current) return;
    const delta = clientX - dragStartX.current;
    const offset = Math.floor(delta / 4);
    let next = (lastFrameRef.current + offset) % totalFrames;
    if (next < 0) next += totalFrames;
    setCurrentFrame(next);
  }, [totalFrames]);

  const endDrag = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
  }, []);

  // Attach window listeners so dragging outside the div still works
  useEffect(() => {
    const onMouseMove = (e) => moveDrag(e.clientX);
    const onMouseUp   = () => endDrag();
    const onTouchMove = (e) => moveDrag(e.touches[0].clientX);
    const onTouchEnd  = () => endDrag();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend",  onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend",  onTouchEnd);
    };
  }, [moveDrag, endDrag]);

  const isLoading      = loadedCount + failedCount < PRELOAD_COUNT;
  const progressPercent = Math.round(((loadedCount + failedCount) / PRELOAD_COUNT) * 100);

  return (
    <div className="hero-360-viewer">
      <div
        className={`hero-360-stage${isDragging ? " is-dragging" : ""}`}
        onMouseDown={(e) => startDrag(e.clientX)}
        onTouchStart={(e) => startDrag(e.touches[0].clientX)}
      >
        {isLoading && (
          <div className="hero-360-loader">
            <div className="hero-360-loader-ring" />
            <p>{progressPercent}%</p>
          </div>
        )}

        {frameUrls[currentFrame] && (
          <img
            src={frameUrls[currentFrame]}
            alt=""
            className="hero-360-image"
            draggable="false"
          />
        )}
      </div>
    </div>
  );
}

export default Hero360Viewer;