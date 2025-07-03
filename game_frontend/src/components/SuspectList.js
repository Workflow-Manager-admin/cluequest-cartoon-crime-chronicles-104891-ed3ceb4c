import React from "react";

/**
 * Renders a list of suspects with cartoon profile, status, and actions.
 * 
 * @param {Array} suspects - Array of suspect objects.
 * @param {Object} assets - Mapping of suspect id to cartoon asset image url.
 * @param {Function} onInterrogate - Callback(suspectId) when interrogate is chosen.
 * @param {Function} onAccuse - Callback(suspectId) for accusation.
 */
function SuspectList({ suspects, assets, onInterrogate, onAccuse }) {
  return (
    <div>
      <h2 style={{
        fontFamily: "Comic Sans MS, Chalkboard, Arial",
        color: "#f21f07",
        textAlign: "center"
      }}>
        Suspects
      </h2>
      <ul style={{
        padding: 0, margin: 0, listStyle: "none"
      }}>
        {suspects.map((suspect) => (
          <li key={suspect.id} style={{
            display: "flex",
            alignItems: "center",
            background: "#ffe6e2",
            border: "2px solid #eecdbf",
            borderRadius: 13,
            marginBottom: 13,
            padding: "9px 13px 9px 8px",
            boxShadow: "0 3px 14px #fae29422"
          }}>
            <img
              src={assets[suspect.id]}
              alt={suspect.name}
              style={{
                width: 47, height: 47,
                borderRadius: "50%",
                border: "3px solid #f5b5b5",
                marginRight: 13,
                objectFit: "cover"
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{
                fontWeight: 800,
                color: "#0a0b0b",
                fontSize: "1.17em",
                lineHeight: 1.1
              }}>{suspect.name}</div>
              <div style={{
                fontSize: "0.91em",
                color: "#888",
              }}>{suspect.alibi}</div>
            </div>
            <button
              aria-label={`Interrogate ${suspect.name}`}
              style={{
                background: "#f8cf43",
                color: "#433",
                border: "none",
                borderRadius: 9,
                fontWeight: 700,
                marginRight: 9,
                padding: "4px 14px",
                boxShadow: "0 2px 6px #fffbe366",
                cursor: "pointer"
              }}
              onClick={() => onInterrogate(suspect.id)}
            >👁️ Interrogate</button>
            <button
              aria-label={`Accuse ${suspect.name}`}
              style={{
                background: "#fb363f",
                color: "#fff",
                border: "none",
                borderRadius: 9,
                fontWeight: 700,
                padding: "4px 12px",
                boxShadow: "0 1.5px 5px #e44f4f33",
                cursor: "pointer"
              }}
              onClick={() => onAccuse(suspect.id)}
            >⚡ Accuse</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SuspectList;
