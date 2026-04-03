import "./StatBadge.css";

function StatBadge({ label, value, icon: Icon }) {
  return (
    <div className="stat-badge">
      {Icon && (
        <div className="stat-badge-icon">
          <Icon size={18} />
        </div>
      )}

      <div className="stat-badge-content">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

export default StatBadge;