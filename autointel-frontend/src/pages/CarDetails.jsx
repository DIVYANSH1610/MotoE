import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Bot,
  Send,
  X,
  Zap,
  Gauge,
  Timer,
  Fuel,
  Layers,
  Sparkles,
  Factory,
  ShieldCheck,
  Trophy,
  Cpu,
  User,
} from "lucide-react";

import CarDetailsGallery from "../components/CarDetailsGallery";
import FavouriteButton from "../components/FavouriteButton";
import GalleryLightbox from "../components/GalleryLightbox";
import TyreLoader from "../components/TyreLoader";
import { getCsrf } from "../services/authApi";
import "./CarDetails.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const BACKEND_ORIGIN = API_BASE.replace("/api/cars", "");

function CarDetails() {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [showAI, setShowAI] = useState(false);
  const [question, setQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  const chatEndRef = useRef(null);

  const getImageUrl = useCallback((path) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;

    const cleanedPath = path.replace(/\\/g, "/");

    if (cleanedPath.startsWith("/")) return `${BACKEND_ORIGIN}${cleanedPath}`;
    if (cleanedPath.startsWith("media/")) return `${BACKEND_ORIGIN}/${cleanedPath}`;
    if (cleanedPath.startsWith("data/images/")) return `${BACKEND_ORIGIN}/${cleanedPath}`;

    return `${BACKEND_ORIGIN}/media/${cleanedPath}`;
  }, []);

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${API_BASE}/${slug}/`, {
        withCredentials: true,
      })
      .then((res) => {
        setCar(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch car details:", err);
        setCar(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (showAI || lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showAI, lightboxOpen]);

  useEffect(() => {
    if (showAI) {
      requestAnimationFrame(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [chatMessages, aiLoading, showAI]);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const galleryImages = useMemo(() => {
    if (Array.isArray(car?.gallery) && car.gallery.length > 0) {
      return car.gallery.map(getImageUrl);
    }
    if (car?.image) return [getImageUrl(car.image)];
    return [];
  }, [car, getImageUrl]);

  const openLightbox = useCallback((index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const handleAskAI = async (presetQuestion = "") => {
    const finalQuestion = (presetQuestion || question).trim();
    if (!finalQuestion || !car?.slug) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: finalQuestion,
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setQuestion("");

    try {
      setAiLoading(true);

      const csrfToken = await getCsrf();

      const res = await axios.post(
        `${BACKEND_ORIGIN}/api/ai/garage/`,
        {
          question: finalQuestion,
          context_car_slug: car.slug,
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      const assistantMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: res.data.answer || "No response received.",
      };

      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("AI request failed:", err.response?.data || err);

      let message =
        "Something went wrong while contacting the AI assistant.";

      const status = err.response?.status;
      const detail = err.response?.data?.detail;

      if (
        status === 401 ||
        detail === "Authentication credentials were not provided."
      ) {
        message = "Please login first to use the AI assistant on this device.";
      } else {
        message =
          err.response?.data?.error ||
          err.response?.data?.detail ||
          message;
      }

      const errorMessage = {
        id: Date.now() + 2,
        role: "assistant",
        content: message,
      };

      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setAiLoading(false);
    }
  };

  const quickPrompts = [
    `What makes ${car?.car_name || "this car"} special?`,
    `Is ${car?.car_name || "this car"} practical for daily use?`,
    `How reliable is ${car?.car_name || "this car"}?`,
    `Explain the engine character of ${car?.car_name || "this car"}.`,
  ];

  const buildOverview = (c) => {
    if (!c) return "";
    return [
      `${c.car_name} from ${c.company} sits in your garage as a machine built around presence, speed, and identity.`,
      `With ${c.engine || "its powertrain"}, ${c.horsepower || "strong output"}, and a claimed top speed of ${c.top_speed || "high performance"}, it positions itself as more than simple transport.`,
      `This machine combines performance, design attitude, and strong road presence into a richer enthusiast experience.`,
    ].join(" ");
  };

  const buildStory = (c) => {
    if (!c) return "";
    return [
      `${c.car_name} works as a statement car in the lineup of ${c.company}.`,
      `It communicates ambition through speed, design language, engineering confidence, and emotional road presence.`,
      `For enthusiasts, the appeal comes from the full experience, not just the headline numbers.`,
    ].join(" ");
  };

  const buildDesignNotes = (c) => {
    if (!c) return "";
    return [
      `The visual language of ${c.car_name} is built around stance, airflow, and emotional impact.`,
      `Its shape is not only cosmetic. Proportions, sculpted surfaces, and silhouette all contribute to cooling, aero behavior, and identity.`,
      `That gives the car a dramatic premium feel even when standing still.`,
    ].join(" ");
  };

  const buildHistory = (c) => {
    if (!c) return "";
    return [
      `${c.car_name} should be viewed in the broader context of ${c.company}'s brand identity.`,
      `Cars like this often serve as halo products or flagship statements that help define how the brand is remembered.`,
      `Its relevance comes from the way it captures the engineering priorities and design ambition of its era.`,
    ].join(" ");
  };

  const buildEngineering = (c) => {
    if (!c) return "";
    return [
      `From a technical angle, ${c.car_name} is defined by ${c.engine || "its engine layout"}, ${c.torque || "strong torque delivery"}, and a power figure of ${c.horsepower || "competitive output"}.`,
      `Its ${c.performance_0_100 || "acceleration profile"} suggests a car engineered for urgency, control, and drama.`,
      `The real engineering interest lies in how this performance is delivered on the road.`,
    ].join(" ");
  };

  const buildExtraDetails = (c) => {
    if (!c) return "";
    return [
      `${c.car_name} also stands out as an ownership proposition.`,
      `Its ${c.fuel_type || "power source"}, ${c.seats || "seating layout"}, and segment positioning shape whether it feels practical, aspirational, or both.`,
      `That makes it ideal for deeper comparison and AI-based discussion within MotoE Garage.`,
    ].join(" ");
  };

  const buildFunFacts = (c) => {
    const facts = Array.isArray(c?.fun_facts) ? c.fun_facts : [];
    const generatedFacts = [
      `${c?.car_name || "This car"} combines strong visual identity with enthusiast-focused performance.`,
      `${c?.company || "The manufacturer"} uses machines like this to shape perception around prestige and engineering confidence.`,
      `${c?.horsepower || "Its output"} and ${c?.top_speed || "its speed potential"} make it one of the more memorable entries in the collection.`,
      `${c?.engine || "Its mechanical layout"} plays a major role in how enthusiasts discuss its character.`,
      `${c?.car_name || "This machine"} is interesting not only for its numbers, but for its full design and ownership story.`,
    ];

    return [...facts, ...generatedFacts].slice(0, 6);
  };

  if (loading) {
    return (
      <div className="car-details-loading">
        <TyreLoader label="Loading car details..." size="large" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="car-details-loading">
        <div className="garage-no-gallery">Car not found.</div>
      </div>
    );
  }

  const overviewText = buildOverview(car);
  const storyText = buildStory(car);
  const designText = buildDesignNotes(car);
  const historyText = buildHistory(car);
  const engineeringText = buildEngineering(car);
  const extraText = buildExtraDetails(car);
  const funFacts = buildFunFacts(car);

  return (
    <div className="car-details-page">
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      <div className="car-details-wrapper">
        <button type="button" className="garage-back-btn" onClick={handleGoBack}>
          ← Back to Garage
        </button>

        <motion.section
          className="garage-hero-card"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="garage-hero-media">
            <div className="garage-hero-glow"></div>
            <img
              src={galleryImages[0] || ""}
              alt={car.car_name}
              className="garage-hero-image"
              onClick={() => openLightbox(0)}
            />
          </div>

          <div className="garage-hero-content">
            <div className="garage-top-row">
              <div className="garage-brand-block">
                <p className="garage-brand">{car.company || "Unknown Brand"}</p>
                <h1 className="garage-title-main">{car.car_name || "Unknown Car"}</h1>
              </div>

              <div className="garage-top-actions">
                <FavouriteButton slug={car.slug} />
              </div>
            </div>

            <p className="garage-subtitle">
              A racing-garage presentation of design, engineering, and machine character.
            </p>

            <div className="garage-meta-row">
              <span className="garage-price">{car.price || "N/A"}</span>
              <span className="garage-chip">{car.fuel_type || "Unknown Fuel"}</span>
              <span className="garage-chip">{car.seats || "N/A"} Seats</span>
              <span className="garage-chip">{car.engine || "N/A"} Engine</span>
            </div>

            <div className="garage-grid">
              <div className="garage-stat">
                <Zap size={18} />
                <span>Power</span>
                <strong>{car.horsepower || "N/A"}</strong>
              </div>

              <div className="garage-stat">
                <Gauge size={18} />
                <span>Top Speed</span>
                <strong>{car.top_speed || "N/A"}</strong>
              </div>

              <div className="garage-stat">
                <Timer size={18} />
                <span>0–100</span>
                <strong>{car.performance_0_100 || "N/A"}</strong>
              </div>

              <div className="garage-stat">
                <Fuel size={18} />
                <span>Fuel Type</span>
                <strong>{car.fuel_type || "N/A"}</strong>
              </div>

              <div className="garage-stat">
                <Layers size={18} />
                <span>Torque</span>
                <strong>{car.torque || "N/A"}</strong>
              </div>

              <div className="garage-stat">
                <Cpu size={18} />
                <span>Engine</span>
                <strong>{car.engine || "N/A"}</strong>
              </div>
            </div>

            <button
              type="button"
              className="garage-ai-btn"
              onClick={() => setShowAI(true)}
            >
              <Bot size={18} />
              Ask AI About This Car
            </button>
          </div>
        </motion.section>

        <div className="garage-content-grid">
          <div className="garage-main-column">
            <section className="garage-panel">
              <h2>
                <Sparkles size={18} />
                Overview
              </h2>
              <p>{overviewText}</p>
            </section>

            <section className="garage-panel">
              <h2>
                <Factory size={18} />
                Story
              </h2>
              <p>{storyText}</p>
            </section>

            <section className="garage-panel">
              <h2>
                <ShieldCheck size={18} />
                Design Notes
              </h2>
              <p>{designText}</p>
            </section>

            <section className="garage-panel gallery-panel">
              <div className="gallery-header">
                <h2>
                  <Layers size={18} />
                  Image Gallery
                </h2>
                <p>Swipe on mobile or use thumbnails to explore more angles.</p>
              </div>

              <CarDetailsGallery
                images={galleryImages}
                carName={car.car_name}
              />
            </section>
          </div>

          <div className="garage-side-column">
            <section className="garage-panel">
              <h2>
                <Trophy size={18} />
                Heritage
              </h2>
              <p>{historyText}</p>
            </section>

            <section className="garage-panel">
              <h2>
                <Cpu size={18} />
                Engineering
              </h2>
              <p>{engineeringText}</p>
            </section>

            <section className="garage-panel">
              <h2>
                <User size={18} />
                Ownership Perspective
              </h2>
              <p>{extraText}</p>
            </section>

            <section className="garage-panel">
              <h2>
                <Sparkles size={18} />
                Quick Facts
              </h2>
              <ul className="fun-facts-list">
                {funFacts.map((fact, index) => (
                  <li key={index}>{fact}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAI && (
          <motion.div
            className="garage-ai-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="garage-ai-modal"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.22 }}
            >
              <div className="garage-ai-topbar">
                <button
                  type="button"
                  className="garage-ai-back-btn"
                  onClick={() => setShowAI(false)}
                >
                  Back
                </button>

                <h3>AI Garage Assistant</h3>

                <button
                  type="button"
                  className="garage-ai-close-btn"
                  onClick={() => setShowAI(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="garage-ai-chat">
                {!chatMessages.length && !aiLoading && (
                  <div className="garage-ai-empty">
                    <div className="garage-ai-empty-icon">
                      <Bot size={22} />
                    </div>
                    <h4>Ask anything about {car.car_name}</h4>
                    <p>
                      Learn about reliability, engineering, practicality,
                      performance, and more.
                    </p>
                  </div>
                )}

                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`garage-chat-message ${
                      message.role === "user"
                        ? "garage-chat-message--user"
                        : "garage-chat-message--assistant"
                    }`}
                  >
                    <div className="garage-chat-avatar">
                      {message.role === "user" ? <User size={16} /> : <Bot size={16} />}
                    </div>

                    <div
                      className={`garage-chat-bubble ${
                        message.role === "user"
                          ? "garage-chat-bubble--user"
                          : "garage-chat-bubble--assistant"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}

                {aiLoading && (
                  <div className="garage-chat-message garage-chat-message--assistant">
                    <div className="garage-chat-avatar">
                      <Bot size={16} />
                    </div>
                    <div className="garage-chat-bubble garage-chat-bubble--assistant garage-chat-thinking">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef}></div>
              </div>

              <div className="garage-ai-quick-prompts">
                {quickPrompts.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    className="garage-ai-chip"
                    onClick={() => handleAskAI(item)}
                    disabled={aiLoading}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="garage-ai-inputbar">
                <textarea
                  placeholder="Ask anything about this car..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />

                <button type="button" onClick={() => handleAskAI()} disabled={aiLoading}>
                  <Send size={16} />
                  {aiLoading ? "Thinking..." : "Send to AI"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lightboxOpen && galleryImages.length > 0 && (
          <GalleryLightbox
            images={galleryImages}
            currentIndex={currentImageIndex}
            onClose={closeLightbox}
            onSelect={setCurrentImageIndex}
            carName={car?.car_name}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default CarDetails;