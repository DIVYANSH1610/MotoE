import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Bot, Send, Sparkles } from "lucide-react";
import { getCsrf } from "../services/authApi";
import GlassCard from "./GlassCard";
import "./AskAboutCar.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const BACKEND_ORIGIN = API_BASE.replace("/api/cars", "");

function AskAboutCar({ car }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    `What makes ${car?.car_name} special?`,
    `Is ${car?.car_name} good for daily use?`,
    `How reliable is ${car?.car_name}?`,
    `What are the main strengths of ${car?.car_name}?`,
  ];

  const handleAsk = async (presetQuestion = null) => {
    const finalQuestion = (presetQuestion ?? question).trim();
    if (!finalQuestion) return;

    try {
      setLoading(true);
      setAnswer("");
      setQuestion(finalQuestion);

      const csrfToken = await getCsrf();

      const res = await axios.post(
        `${BACKEND_ORIGIN}/api/ai/garage/`,
        {
          question: finalQuestion,
          context_car_slug: car?.slug,
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      setAnswer(res.data.answer || "No response received.");
    } catch (err) {
      console.error("AI request failed:", err.response?.data || err);

      const backendMessage =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Something went wrong while generating the response.";

      if (err.response?.status === 401) {
        setAnswer("## Error\nPlease login first to use AI features.");
      } else if (err.response?.status === 403) {
        setAnswer(`## Error\n${backendMessage}`);
      } else {
        setAnswer(`## Error\n${backendMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="ask-about-car" hover={false}>
      <div className="ask-about-car-top">
        <div className="ask-about-car-title">
          <Bot size={20} />
          <h3>Ask AI about this car</h3>
        </div>
        <span className="ask-about-car-badge">Model-aware</span>
      </div>

      <p className="ask-about-car-subtitle">
        Ask questions specifically about <strong>{car?.car_name}</strong> and get
        AI responses grounded in the selected car context.
      </p>

      <textarea
        className="ask-about-car-textarea"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder={`Ask about ${car?.car_name}...`}
      />

      <div className="ask-about-car-actions">
        <button
          type="button"
          className="ask-about-car-button"
          onClick={() => handleAsk()}
          disabled={loading}
        >
          {loading ? (
            "Thinking..."
          ) : (
            <>
              <Send size={16} />
              Ask AI
            </>
          )}
        </button>
      </div>

      <div className="ask-about-car-prompts">
        <div className="ask-about-car-prompts-label">
          <Sparkles size={15} />
          Quick prompts
        </div>

        <div className="ask-about-car-chip-list">
          {quickPrompts.map((item, index) => (
            <button
              key={index}
              type="button"
              className="ask-about-car-chip"
              onClick={() => handleAsk(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {answer && (
        <div className="ask-about-car-answer">
          <ReactMarkdown
            components={{
              h2: ({ children }) => <h2 className="ask-md-h2">{children}</h2>,
              h3: ({ children }) => <h3 className="ask-md-h3">{children}</h3>,
              p: ({ children }) => <p className="ask-md-p">{children}</p>,
              ul: ({ children }) => <ul className="ask-md-ul">{children}</ul>,
              li: ({ children }) => <li className="ask-md-li">{children}</li>,
              strong: ({ children }) => (
                <strong className="ask-md-strong">{children}</strong>
              ),
            }}
          >
            {answer}
          </ReactMarkdown>
        </div>
      )}
    </GlassCard>
  );
}

export default AskAboutCar;
