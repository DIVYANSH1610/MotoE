import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import TyreLoader from "../components/TyreLoader";
import {
  Sparkles,
  Bot,
  Send,
  Gauge,
  Wrench,
  ShieldCheck,
  User,
  ChevronRight,
  Cpu,
} from "lucide-react";
import { getCsrf } from "../services/authApi";
import PremiumSectionHeader from "../components/PremiumSectionHeader";
import GlassCard from "../components/GlassCard";
import "./AIGarage.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const BACKEND_ORIGIN = API_BASE.replace("/api/cars", "");

function AIGarage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleAsk = async (presetQuestion = null) => {
    const finalQuestion = (presetQuestion ?? question).trim();
    if (!finalQuestion) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: finalQuestion,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const csrfToken = await getCsrf();

      const res = await axios.post(
        `${BACKEND_ORIGIN}/api/ai/garage/`,
        { question: finalQuestion },
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: res.data.answer || "No response received.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("AI request failed:", err.response?.data || err);

      let errorText =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "AI request failed.";

      if (err.response?.status === 401) {
        errorText = "Please login first.";
      } else if (err.response?.status === 403) {
        errorText = "CSRF/auth issue. Try refreshing and logging in again.";
      }

      const errorMessage = {
        id: Date.now() + 2,
        role: "assistant",
        content: `## Error\n${errorText}`,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const promptSuggestions = [
    "Tell me about Ferrari SF90 Stradale",
    "Which is better AWD or RWD?",
    "Explain turbocharged vs naturally aspirated engines",
    "What makes V12 engines special?",
    "Compare luxury cars and supercars",
    "How do tyre profiles affect handling?",
  ];

  return (
    <div className="ai-garage-page">
      <div className="ai-garage-bg ai-garage-bg-1"></div>
      <div className="ai-garage-bg ai-garage-bg-2"></div>
      <div className="ai-garage-bg ai-garage-bg-3"></div>

      <div className="ai-garage-container">
        <GlassCard className="ai-garage-hero-shell" padding="large" hover={false}>
          <div className="ai-garage-hero-grid">
            <div className="ai-garage-hero-left">
              <PremiumSectionHeader
                kicker="AI Powered Automotive Console"
                title="AI Garage Assistant"
                subtitle="Ask anything about cars, design, engines, tyres, reliability, technology, and performance. If it exists in your garage dataset, the AI uses that first. Otherwise, it falls back to broader automotive knowledge."
              />

              <div className="ai-garage-stats">
                <div className="ai-garage-stat">
                  <Gauge size={18} />
                  <div>
                    <strong>Performance Knowledge</strong>
                    <span>Specs, speed, and engineering</span>
                  </div>
                </div>

                <div className="ai-garage-stat">
                  <Wrench size={18} />
                  <div>
                    <strong>Technical Insight</strong>
                    <span>Engines, tyres, maintenance</span>
                  </div>
                </div>

                <div className="ai-garage-stat">
                  <ShieldCheck size={18} />
                  <div>
                    <strong>Smart Responses</strong>
                    <span>Dataset-aware + AI fallback</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="ai-garage-hero-right">
              <div className="ai-garage-hero-visual">
                <div className="ai-hero-badge">
                  <Bot size={18} />
                  Race Engineer Mode
                </div>

                <div className="ai-hero-core">
                  <div className="ai-hero-core-icon">
                    <Cpu size={34} />
                  </div>
                  <h3>High-Performance Automotive Intelligence</h3>
                  <p>
                    Compare machines, decode specs, understand driving feel,
                    evaluate engineering choices, and get richer enthusiast-focused answers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="ai-garage-layout">
          <GlassCard className="ai-garage-left-panel" hover={false}>
            <div className="ai-panel-top">
              <div className="ai-panel-title">
                <Bot size={20} />
                <h3>Ask the Garage</h3>
              </div>
              <span className="ai-panel-badge">Live AI</span>
            </div>

            <div className="ai-input-shell">
              <textarea
                className="ai-garage-textarea"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask something like: Tell me about Koenigsegg Jesko, compare AWD vs RWD, explain carbon ceramic brakes, or what makes Ferrari SF90 special..."
              />

              <div className="ai-garage-actions">
                <button
                  className="ai-garage-button"
                  onClick={() => handleAsk()}
                  disabled={loading}
                  type="button"
                >
                  {loading ? (
                    <>
                      <span className="ai-loader"></span>
                      Thinking...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Ask AI
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="ai-garage-suggestions-wrap">
              <div className="ai-suggestions-label">
                <Sparkles size={16} />
                Quick prompts
              </div>

              <div className="ai-garage-suggestions">
                {promptSuggestions.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleAsk(item)}
                    className="ai-prompt-chip"
                  >
                    <ChevronRight size={14} />
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="ai-garage-right-panel" hover={false}>
            <div className="ai-response-top">
              <div className="ai-panel-title">
                <Bot size={20} />
                <h3>Conversation</h3>
              </div>
              <span className="ai-thread-badge">{messages.length} Messages</span>
            </div>

            {messages.length === 0 && !loading && (
              <div className="ai-empty-state">
                <div className="ai-empty-icon">
                  <Bot size={34} />
                </div>
                <h4>No conversation yet</h4>
                <p>
                  Start a conversation about performance, reliability, tyres,
                  engineering, luxury features, or any car from your dataset.
                </p>
              </div>
            )}

            <div className="ai-chat-thread">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`ai-message ai-message--${message.role}`}
                >
                  <div className="ai-message-avatar">
                    {message.role === "user" ? <User size={18} /> : <Bot size={18} />}
                  </div>

                  <div className={`ai-message-bubble ai-message-bubble--${message.role}`}>
                    {message.role === "user" ? (
                      <p className="ai-user-text">{message.content}</p>
                    ) : (
                      <div className="ai-answer-markdown">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => <h1 className="ai-md-h1">{children}</h1>,
                            h2: ({ children }) => <h2 className="ai-md-h2">{children}</h2>,
                            h3: ({ children }) => <h3 className="ai-md-h3">{children}</h3>,
                            p: ({ children }) => <p className="ai-md-p">{children}</p>,
                            ul: ({ children }) => <ul className="ai-md-ul">{children}</ul>,
                            ol: ({ children }) => <ol className="ai-md-ol">{children}</ol>,
                            li: ({ children }) => <li className="ai-md-li">{children}</li>,
                            strong: ({ children }) => (
                              <strong className="ai-md-strong">{children}</strong>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="ai-md-blockquote">{children}</blockquote>
                            ),
                            code: ({ children }) => (
                              <code className="ai-md-code">{children}</code>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="ai-loader-panel">
                  <TyreLoader label="Generating automotive intelligence..." />
                </div>
              )}

              <div ref={chatEndRef}></div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default AIGarage;
