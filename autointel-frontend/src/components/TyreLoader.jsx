import "./TyreLoader.css";

function TyreLoader({ label = "Loading garage...", size = "medium" }) {
  return (
    <div className={`tyre-loader-wrap tyre-loader-wrap--${size}`}>
      <div className={`tyre-loader tyre-loader--${size}`}>
        <div className="tyre-outer">
          <div className="tyre-inner">
            <div className="tyre-center"></div>
          </div>
        </div>
      </div>
      <p className="tyre-loader-label">{label}</p>
    </div>
  );
}

export default TyreLoader;