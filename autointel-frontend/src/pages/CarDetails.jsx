import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import ReactMarkdown from "react-markdown";
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

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${BACKEND_ORIGIN}${path}`;
  };

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
      return car.gallery;
    }
    if (car?.image) return [car.image];
    return [];
  }, [car]);

  const openLightbox = useCallback((index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const handlePrevImage = useCallback(() => {
    if (!galleryImages.length) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  }, [galleryImages]);

  const handleNextImage = useCallback(() => {
    if (!galleryImages.length) return;
    setCurrentImageIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  }, [galleryImages]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, closeLightbox, handlePrevImage, handleNextImage]);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(";").shift();
    }
    return "";
  };

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

      await getCsrf();
      const csrfToken = getCookie("csrftoken");

      const res = await axios.post(
        `${BACKEND_ORIGIN}/api/ai/garage/`,
        {
          question: finalQuestion,
          context_car_slug: car.slug,
        },
        {
          withCredentials: true,
          headers: csrfToken
            ? {
                "X-CSRFToken": csrfToken,
              }
            : {},
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

      const backendMessage =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "## Error\nSomething went wrong while contacting the AI assistant.";

      const errorMessage = {
        id: Date.now() + 2,
        role: "assistant",
        content: backendMessage,
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
      `${c.car_name} from ${c.company} sits in your garage as a machine built around presence, speed, and identity. With ${c.engine || "its powertrain"}, ${c.horsepower || "strong output"}, and a claimed top speed of ${c.top_speed || "high performance"}, it immediately positions itself as more than simple transport.`,
      `What makes this car interesting is not just the headline numbers, but the blend of mechanical character, design attitude, and the way it reflects the engineering priorities of ${c.company}. In this garage view, it should feel like a flagship experience rather than a plain specification sheet.`,
      `For enthusiasts, ${c.car_name} represents a combination of visual drama, performance intent, and a distinct ownership personality. Whether someone values prestige, power delivery, design appeal, or rarity, this machine carries a strong identity in the collection.`,
    ].join(" ");
  };

  const buildStory = (c) => {
    if (!c) return "";
    const base = c.story?.trim();
    const extra = [
      `${c.car_name} can be understood as a statement car in the lineup of ${c.company}. It exists to communicate a certain level of ambition, whether that ambition is extreme speed, luxury, engineering innovation, or brand image.`,
      `From an enthusiast perspective, the car matters because it is not only about raw numbers on paper. The real character comes from how its performance, proportions, cabin feel, and road presence combine into a complete experience.`,
      `That makes this car relevant not only for collectors or dreamers, but also for anyone studying how modern performance and premium automotive design are packaged together in a single product.`,
    ].join(" ");

    if (base && base.length > 140) {
      return `${base} ${extra}`;
    }
    return extra;
  };

  const buildDesignNotes = (c) => {
    if (!c) return "";
    const base = c.design_notes?.trim();
    const extra = [
      `The visual language of ${c.car_name} is built around stance, airflow, and emotional impact. Even when parked, the proportions are intended to imply motion, balance, and control.`,
      `Design here is not only cosmetic. Elements such as the body shape, the way the surfaces are sculpted, the cabin placement, and the overall silhouette all influence cooling, aerodynamic efficiency, and perceived aggression.`,
      `In a garage-style presentation, this makes the car feel like a machine with intent. Its shape is part branding, part engineering, and part theatre.`,
    ].join(" ");

    if (base && base.length > 120) {
      return `${base} ${extra}`;
    }
    return extra;
  };

  const buildHistory = (c) => {
    if (!c) return "";
    return [
      `${c.car_name} should be viewed in the context of ${c.company}'s broader automotive identity. Cars like this usually arrive as halo products, flagship statements, or category benchmarks that strengthen how the brand is perceived.`,
      `Its place in history is tied to the way it captures the design and engineering philosophy of its era. With ${c.engine || "its powertrain"} and ${c.horsepower || "serious output"}, it reflects the demand for stronger performance, sharper styling, and more emotionally engaging road cars.`,
      `In practical terms, this car becomes part of the brand narrative because it shows what the manufacturer wants enthusiasts to remember: speed, craftsmanship, technological confidence, and a recognizable visual signature.`,
    ].join(" ");
  };

  const buildEngineering = (c) => {
    if (!c) return "";
    return [
      `From a technical angle, ${c.car_name} is defined by ${c.engine || "its engine architecture"}, ${c.torque || "strong torque delivery"}, and a power figure of ${c.horsepower || "competitive output"}.`,
      `Those numbers suggest a machine engineered for confident acceleration, usable mid-range response, and strong top-end character. When paired with ${c.performance_0_100 || "its acceleration profile"}, the car reads as a performance-focused package rather than a comfort-first one.`,
      `For users comparing machines in the same segment, the interesting engineering question is not only how fast it is, but how it delivers that performance: aggressively, smoothly, dramatically, or with refined composure.`,
    ].join(" ");
  };

  const buildExtraDetails = (c) => {
    if (!c) return "";
    return [
      `${c.car_name} also stands out as an ownership proposition. Its ${c.fuel_type || "power source"}, ${c.seats || "seating layout"}, and overall segment positioning shape how practical or aspirational it feels in day-to-day use.`,
      `Some cars in this category are bought for daily road presence, some for weekend excitement, and some purely for their symbolic value. This one sits somewhere on that spectrum depending on what the driver values most: drama, comfort, exclusivity, or technical fascination.`,
      `Viewed inside your platform, this makes the car ideal for deeper AI-based discussion as well—because it has enough identity in performance, design, and brand story to support richer comparison and analysis.`,
    ].join(" ");
  };

  const buildFunFacts = (c) => {
    const facts = Array.isArray(c?.fun_facts) ? [...c.fun_facts] : [];
    const generatedFacts = [
      `${c?.car_name || "This car"} combines strong visual identity with a specification sheet that immediately positions it as an enthusiast-focused machine.`,
      `${c?.company || "The manufacturer"} uses cars like this to shape perception around performance, prestige, and engineering confidence.`,
      `${c?.horsepower || "Its output"} and ${c?.top_speed || "its speed potential"} make it one of the more memorable entries in the collection.`,
      `${c?.engine || "Its mechanical layout"} plays a major role in how the car is discussed by enthusiasts, especially when comparing feel and character.`,
      `${c?.car_name || "This machine"} is not just interesting for its numbers, but for the complete experience created by design, story, and road presence.`,
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
              src={getImageUrl(car.image || galleryImages[0] || "")}
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
                <span>0-100</span>
                <strong>{car.performance_0_100 || "N/A"}</strong>
              </div>

              <div className="garage-stat">
                <Fuel size={18} />
                <span>Fuel</span>
                <strong>{car.fuel_type || "N/A"}</strong>
              </div>

              <div className="garage-stat">
                <Cpu size={18} />
                <span>Torque</span>
                <strong>{car.torque || "N/A"}</strong>
              </div>

              <div className="garage-stat">
                <Factory size={18} />
                <span>Manufacturer</span>
                <strong>
                  {car.manufacturer_details?.manufacturer || car.company || "N/A"}
                </strong>
              </div>
            </div>

            <button
              type="button"
              className="garage-ai-btn"
              onClick={() => setShowAI(true)}
            >
              <Bot size={16} />
              Ask AI about this car
            </button>
          </div>
        </motion.section>

        <section className="garage-content-grid">
          <div className="garage-main-column">
            <motion.div
              className="garage-panel"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2>
                <Sparkles size={18} /> Overview
              </h2>
              <p>{overviewText}</p>
            </motion.div>

            <motion.div
              className="garage-panel"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2>
                <Trophy size={18} /> Story
              </h2>
              <p>{storyText}</p>
            </motion.div>

            <motion.div
              className="garage-panel"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2>
                <Layers size={18} /> Design Notes
              </h2>
              <p>{designText}</p>
            </motion.div>

            <motion.div
              className="garage-panel"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2>
                <Factory size={18} /> History & Legacy
              </h2>
              <p>{historyText}</p>
            </motion.div>

            <motion.div
              className="garage-panel"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2>
                <ShieldCheck size={18} /> Engineering Insight
              </h2>
              <p>{engineeringText}</p>
            </motion.div>

            <motion.div
              className="garage-panel"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2>
                <Cpu size={18} /> Extra Details
              </h2>
              <p>{extraText}</p>
            </motion.div>
          </div>

          <div className="garage-side-column">
            <motion.div
              className="garage-panel"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2>
                <Factory size={18} /> Key Specifications
              </h2>

              <div className="info-list">
                <div className="info-row">
                  <span>Brand</span>
                  <strong>{car.company || "N/A"}</strong>
                </div>
                <div className="info-row">
                  <span>Model</span>
                  <strong>{car.car_name || "N/A"}</strong>
                </div>
                <div className="info-row">
                  <span>Engine</span>
                  <strong>{car.engine || "N/A"}</strong>
                </div>
                <div className="info-row">
                  <span>Horsepower</span>
                  <strong>{car.horsepower || "N/A"}</strong>
                </div>
                <div className="info-row">
                  <span>Torque</span>
                  <strong>{car.torque || "N/A"}</strong>
                </div>
                <div className="info-row">
                  <span>Top Speed</span>
                  <strong>{car.top_speed || "N/A"}</strong>
                </div>
                <div className="info-row">
                  <span>0-100 km/h</span>
                  <strong>{car.performance_0_100 || "N/A"}</strong>
                </div>
                <div className="info-row">
                  <span>Fuel Type</span>
                  <strong>{car.fuel_type || "N/A"}</strong>
                </div>
                <div className="info-row">
                  <span>Seating</span>
                  <strong>{car.seats || "N/A"}</strong>
                </div>
                <div className="info-row">
                  <span>Price</span>
                  <strong>{car.price || "N/A"}</strong>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="garage-panel"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2>
                <Sparkles size={18} /> Fun Facts
              </h2>
              <ul className="fun-facts-list">
                {funFacts.map((fact, index) => (
                  <li key={index}>{fact}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>

        <motion.section
          className="garage-panel gallery-panel"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="gallery-header">
            <h2>
              <Layers size={18} /> Gallery
            </h2>
            <p>
              Explore the visual side of {car.car_name || "this car"} through its image
              gallery.
            </p>
          </div>

          <div className="garage-gallery">
            {galleryImages.length > 0 ? (
              galleryImages.map((img, index) => (
                <motion.button
                  type="button"
                  key={index}
                  className="garage-gallery-item"
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openLightbox(index)}
                >
                  <div className="garage-gallery-overlay"></div>
                  <img
                    src={getImageUrl(img)}
                    alt={`${car.car_name} ${index + 1}`}
                  />
                </motion.button>
              ))
            ) : (
              <div className="garage-no-gallery">No images available.</div>
            )}
          </div>
        </motion.section>
      </div>

      <AnimatePresence>
        {showAI && (
          <div className="garage-ai-overlay" onClick={() => setShowAI(false)}>
            <motion.div
              className="garage-ai-panel"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.24 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="garage-ai-header">
                <button
                  type="button"
                  className="garage-ai-back-btn"
                  onClick={() => setShowAI(false)}
                >
                  Back
                </button>

                <h3>
                  <Bot size={16} />
                  AI Garage Assistant
                </h3>

                <button
                  type="button"
                  className="garage-ai-close-btn"
                  onClick={() => setShowAI(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="garage-ai-chat">
                {chatMessages.length === 0 && !aiLoading ? (
                  <div className="garage-ai-empty">
                    <div className="garage-ai-empty-icon">
                      <Bot size={24} />
                    </div>
                    <h4>Ask anything about this car</h4>
                    <p>
                      Explore performance, reliability, engine character, design,
                      practicality, and more.
                    </p>
                  </div>
                ) : (
                  chatMessages.map((message) => (
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
                        {message.role === "user" ? (
                          <p className="garage-chat-user-text">{message.content}</p>
                        ) : (
                          <div className="garage-chat-markdown">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}

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
                  placeholder="Ask anything about this car."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />

                <button type="button" onClick={() => handleAskAI()} disabled={aiLoading}>
                  <Send size={16} />
                  {aiLoading ? "Thinking..." : "Send to AI"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lightboxOpen && galleryImages.length > 0 && (
          <GalleryLightbox
            images={galleryImages.map(getImageUrl)}
            currentIndex={currentImageIndex}
            onClose={closeLightbox}
            onPrev={handlePrevImage}
            onNext={handleNextImage}
            onSelect={setCurrentImageIndex}
            carName={car?.car_name}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default CarDetails;
