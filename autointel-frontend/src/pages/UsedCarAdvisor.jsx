import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  AlertTriangle,
  BadgeIndianRupee,
  CarFront,
  ShieldCheck,
  Gauge,
  FileSearch,
  Sparkles,
} from "lucide-react";
import PremiumSectionHeader from "../components/PremiumSectionHeader";
import TyreLoader from "../components/TyreLoader";
import GlassCard from "../components/GlassCard";
import { getUsedCarAdvice } from "../services/aiApi";
import "./UsedCarAdvisor.css";

function UsedCarAdvisor() {
  const [formData, setFormData] = useState({
    car_type: "sedan",
    brand: "",
    model: "",
    variant: "",
    year: "",
    fuel_type: "petrol",
    transmission: "manual",
    kilometers_driven: "",
    owner_count: 1,
    asking_price: "",
    service_history: "",
    accident_history: "none",
    tyre_condition: "good",
    insurance_status: "comprehensive",
    city: "",
    seats: 5,
    condition_notes: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setResult(null);

      const payload = {
        ...formData,
        year: formData.year ? Number(formData.year) : null,
        kilometers_driven: formData.kilometers_driven
          ? Number(formData.kilometers_driven)
          : 0,
        owner_count: formData.owner_count ? Number(formData.owner_count) : 1,
        asking_price: formData.asking_price ? Number(formData.asking_price) : 0,
        seats: formData.seats ? Number(formData.seats) : 5,
      };

      const res = await getUsedCarAdvice(payload);
      console.log("Used car advisor response:", res.data);
      setResult(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to generate used car advice.");
    } finally {
      setLoading(false);
    }
  };

  const hasStructuredResult =
    result &&
    (
      result.recommendation ||
      result.overall_score !== undefined ||
      result.scores ||
      result.fair_price_range ||
      result.not_worth_above ||
      result.inspection_checklist ||
      result.red_flags ||
      result.analysis
    );

  const plainAnswer = result?.answer || "";

  return (
    <div className="used-car-page">
      <div className="used-car-bg used-car-bg-1"></div>
      <div className="used-car-bg used-car-bg-2"></div>
      <div className="used-car-bg used-car-bg-3"></div>

      <div className="used-car-container">
        <GlassCard padding="large" hover={false} className="used-hero-shell">
          <div className="used-hero-grid">
            <div className="used-hero-left">
              <PremiumSectionHeader
                kicker="Smart Pre-Owned Advisor"
                title="Used Car Buying Advisor"
                subtitle="Enter the details of a used car and get a practical AI-backed verdict, price guidance, red flags, inspection priorities, and deeper buying confidence."
              />

              <div className="used-hero-stats">
                <div className="used-hero-stat">
                  <Gauge size={18} />
                  <div>
                    <strong>Condition Analysis</strong>
                    <span>Age, usage, and ownership risk</span>
                  </div>
                </div>

                <div className="used-hero-stat">
                  <BadgeIndianRupee size={18} />
                  <div>
                    <strong>Price Guidance</strong>
                    <span>Fair range and upper worth threshold</span>
                  </div>
                </div>

                <div className="used-hero-stat">
                  <FileSearch size={18} />
                  <div>
                    <strong>Inspection Focus</strong>
                    <span>Checklist and warning signs</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="used-hero-right">
              <div className="used-hero-visual">
                <div className="used-hero-badge">
                  <Sparkles size={16} />
                  AI Pre-Owned Scan
                </div>
                <div className="used-hero-card">
                  <CarFront size={36} />
                  <h3>Smarter Used Car Decisions</h3>
                  <p>
                    Get a clearer verdict before you negotiate, inspect, or commit
                    to the deal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="used-car-layout">
          <GlassCard hover={false} className="used-form-shell">
            <div className="used-panel-top">
              <div className="used-panel-title">
                <CarFront size={20} />
                <h3>Vehicle Input</h3>
              </div>
              <span className="used-panel-badge">AI Form</span>
            </div>

            <form className="used-car-form" onSubmit={handleSubmit}>
              <div className="used-form-grid">
                <input
                  placeholder="Brand"
                  value={formData.brand}
                  onChange={(e) => updateField("brand", e.target.value)}
                />
                <input
                  placeholder="Model"
                  value={formData.model}
                  onChange={(e) => updateField("model", e.target.value)}
                />
                <input
                  placeholder="Variant"
                  value={formData.variant}
                  onChange={(e) => updateField("variant", e.target.value)}
                />
                <input
                  placeholder="Year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => updateField("year", e.target.value)}
                />
                <input
                  placeholder="Kilometers Driven"
                  type="number"
                  value={formData.kilometers_driven}
                  onChange={(e) => updateField("kilometers_driven", e.target.value)}
                />
                <input
                  placeholder="Asking Price"
                  type="number"
                  value={formData.asking_price}
                  onChange={(e) => updateField("asking_price", e.target.value)}
                />
                <input
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                />

                <select
                  value={formData.car_type}
                  onChange={(e) => updateField("car_type", e.target.value)}
                >
                  <option value="hatchback">Hatchback</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="mpv">MPV</option>
                  <option value="pickup">Pickup</option>
                  <option value="sports">Sports</option>
                  <option value="other">Other</option>
                </select>

                <select
                  value={formData.fuel_type}
                  onChange={(e) => updateField("fuel_type", e.target.value)}
                >
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="electric">Electric</option>
                  <option value="cng">CNG</option>
                </select>

                <select
                  value={formData.transmission}
                  onChange={(e) => updateField("transmission", e.target.value)}
                >
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                  <option value="cvt">CVT</option>
                  <option value="dct">DCT</option>
                </select>

                <select
                  value={formData.owner_count}
                  onChange={(e) => updateField("owner_count", e.target.value)}
                >
                  <option value={1}>1st Owner</option>
                  <option value={2}>2nd Owner</option>
                  <option value={3}>3rd Owner</option>
                  <option value={4}>4+ Owners</option>
                </select>

                <select
                  value={formData.accident_history}
                  onChange={(e) => updateField("accident_history", e.target.value)}
                >
                  <option value="none">No Accident</option>
                  <option value="minor">Minor Accident</option>
                  <option value="major">Major Accident</option>
                  <option value="unknown">Unknown</option>
                </select>

                <select
                  value={formData.tyre_condition}
                  onChange={(e) => updateField("tyre_condition", e.target.value)}
                >
                  <option value="new">New</option>
                  <option value="good">Good</option>
                  <option value="worn">Worn</option>
                  <option value="needs replacement">Needs Replacement</option>
                </select>

                <select
                  value={formData.insurance_status}
                  onChange={(e) => updateField("insurance_status", e.target.value)}
                >
                  <option value="comprehensive">Comprehensive</option>
                  <option value="third-party">Third Party</option>
                  <option value="expired">Expired</option>
                </select>

                <input
                  placeholder="Seats"
                  type="number"
                  value={formData.seats}
                  onChange={(e) => updateField("seats", e.target.value)}
                />
              </div>

              <textarea
                placeholder="Service history details"
                value={formData.service_history}
                onChange={(e) => updateField("service_history", e.target.value)}
              />

              <textarea
                placeholder="Condition notes"
                value={formData.condition_notes}
                onChange={(e) => updateField("condition_notes", e.target.value)}
              />

              <button type="submit" className="used-car-submit" disabled={loading}>
                {loading ? "Analyzing..." : "Get AI Advice"}
              </button>
            </form>
          </GlassCard>

          <GlassCard hover={false} className="used-result-shell">
            <div className="used-panel-top">
              <div className="used-panel-title">
                <ShieldCheck size={20} />
                <h3>AI Report</h3>
              </div>
              <span className="used-panel-badge">Race Garage Theme</span>
            </div>

            {!result && !loading && (
              <div className="used-empty">
                <div className="used-empty-icon">
                  <CarFront size={34} />
                </div>
                <h3>No report yet</h3>
                <p>Fill the car details and generate your used car buying report.</p>
              </div>
            )}

            {loading && (
              <div className="used-loading-wrap">
                <TyreLoader label="Analyzing the used car..." />
              </div>
            )}

            {result && hasStructuredResult && (
              <div className="used-result">
                <div className="used-verdict-row">
                  <div
                    className={`used-verdict used-verdict--${
                      result?.recommendation || "unknown"
                    }`}
                  >
                    {(result?.recommendation || "unknown").toUpperCase()}
                  </div>
                  <div className="used-overall-score">
                    Overall Score: <strong>{result?.overall_score ?? "N/A"}/10</strong>
                  </div>
                </div>

                <div className="used-score-grid">
                  {Object.entries(result?.scores || {}).map(([key, value]) => (
                    <div key={key} className="used-score-card">
                      <span>{key.replaceAll("_", " ")}</span>
                      <strong>{value}/10</strong>
                    </div>
                  ))}
                </div>

                <div className="used-price-boxes">
                  <div className="used-price-box">
                    <BadgeIndianRupee size={18} />
                    <div>
                      <span>Fair Price Range</span>
                      <strong>
                        ₹{result?.fair_price_range?.low ?? "N/A"} - ₹
                        {result?.fair_price_range?.high ?? "N/A"}
                      </strong>
                    </div>
                  </div>

                  <div className="used-price-box">
                    <AlertTriangle size={18} />
                    <div>
                      <span>Not Worth Above</span>
                      <strong>₹{result?.not_worth_above ?? "N/A"}</strong>
                    </div>
                  </div>
                </div>

                <div className="used-list-block">
                  <h4>Inspection Checklist</h4>
                  {(result?.inspection_checklist || []).length > 0 ? (
                    <ul>
                      {result.inspection_checklist.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No inspection checklist available.</p>
                  )}
                </div>

                <div className="used-list-block">
                  <h4>Red Flags</h4>
                  {(result?.red_flags || []).length > 0 ? (
                    <ul>
                      {result.red_flags.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="used-no-redflags">
                      <ShieldCheck size={16} />
                      No major red flags detected in the current input.
                    </p>
                  )}
                </div>

                <div className="used-analysis">
                  <ReactMarkdown>
                    {result?.analysis || "No analysis available."}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {result && !hasStructuredResult && plainAnswer && (
              <div className="used-result">
                <div className="used-list-block">
                  <h4>AI Advice</h4>
                  <div className="used-analysis">
                    <ReactMarkdown>{plainAnswer}</ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default UsedCarAdvisor;
