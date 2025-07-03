import React from "react";

/**
 * Renders the central illustrated cartoon crime scene with clickable clue areas.
 * 
 * @param {Object[]} clues - List of clue objects, with found status/location/image.
 * @param {Function} onClueClick - Called when a clue area is clicked (clueId).
 * @param {Object} clueAssets - id=>imageUrl from Freepik or placeholder.
 * @param {string} highlightColor - UI color for found clues.
 * @param {string} outlineColor - UI color for clue outlines.
 */
function CrimeScene({
  clues,
  onClueClick,
  clueAssets,
  highlightColor = "#ffd93b",
  outlineColor = "#222",
}) {
  // Simple cartoon-style room (background SVG mock), overlay with clue icons
  return (
    <div
      className="cartoon-crime-scene"
      style={{
        width: "93%",
        minHeight: 480,
        aspectRatio: "16/9",
        border: `5px solid ${outlineColor}`,
        borderRadius: "22px",
        margin: "auto",
        marginBottom: 18,
        background: "linear-gradient(0deg, #fcf0e6 60%, #e5eafc 100%)",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 5px 18px #0a0b0b22",
      }}
      aria-label="Crime Scene"
    >
      {/* Mocked cartoon-style floor, rug, table, etc. Replace with illustration asset if needed */}
      <svg width="100%" height="100%" style={{ position: "absolute", left: 0, top: 0 }}>
        {/* Floor */}
        <ellipse
          cx="49%" cy="84%"
          rx="41%" ry="14%"
          fill="#ebe6db"
          stroke={outlineColor}
          strokeWidth="2"
        />
        {/* Simple Rug */}
        <ellipse
          cx="44%" cy="86%"
          rx="18%" ry="6%"
          fill="#f5f5af"
          stroke="#b4ae56"
          strokeDasharray="5,5"
          strokeWidth="3"
        />
        {/* Table */}
        <rect x="35%" y="65%" width="28%" height="9%" rx="14%" fill="#efc47c" stroke="#ad8550" strokeWidth="4"/>
        {/* Window and wall */}
        <rect x="65%" y="6%" width="18%" height="23%" rx="18" fill="#aae7ff" stroke="#69cdeb" strokeWidth="5"/>
        <rect x="0" y="0" width="100%" height="65%" fill="#f8e5d9" />
        {/* Walls and art */}
        <rect x="53%" y="5%" width="5%" height="17%" rx="3" fill="#fffdfa" stroke="#bba9b3" strokeWidth="2"/>
      </svg>
      {/* Overlay cartoon clue hot-spots (clickable) */}
      {clues.map((clue) => (
        <button
          key={clue.id}
          onClick={() => onClueClick(clue.id)}
          aria-label={clue.label}
          style={{
            position: "absolute",
            left: clue.location.x,
            top: clue.location.y,
            transform: "translate(-50%,-55%)",
            border: clue.found
              ? `4px solid ${highlightColor}`
              : `3.5px dashed ${outlineColor}`,
            borderRadius: "50%",
            background: clue.found ? highlightColor : "rgba(250,250,250, 0.8)",
            boxShadow: clue.found
              ? "0 0 8px 3px #fd0"
              : "0 2px 5px #bbb7",
            padding: 0,
            width: 58,
            height: 58,
            zIndex: 5,
            cursor: clue.found
              ? "not-allowed"
              : "pointer",
            outline: clue.found ? `2px solid #26efab` : "none",
            opacity: clue.found ? 0.7 : 1,
            transition: "all 0.25s cubic-bezier(.39, .575, .565, 1)",
          }}
          disabled={clue.found}
        >
          <img
            src={clueAssets[clue.id]}
            alt={clue.label}
            style={{
              width: 36,
              height: 36,
              filter: clue.found ? "grayscale(65%) brightness(1.12)" : "",
              opacity: clue.found ? 0.76 : 1,
              pointerEvents: "none",
              marginTop: 8,
            }}
          />
          <span
            style={{
              display: "block",
              fontFamily: "Chalkboard, Comic Sans MS, Arial",
              fontSize: "0.87em",
              fontWeight: 700,
              color: "#403c39",
            }}
          >
            {clue.label}
          </span>
        </button>
      ))}
      {/* Decorative overlay, e.g., shadow or lamp or clock */}
      <div style={{ position: "absolute", left: 22, top: 22 }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/2939/2939060.png"
          alt="Lamp"
          style={{ width: "60px", opacity: 0.19 }}
        />
      </div>
    </div>
  );
}

export default CrimeScene;
