import React from "react";

/**
 * ClueBoard/Notebook for viewing, connecting, and organizing clues.
 * 
 * @param {boolean} open - If true, the board is visible as a modal.
 * @param {Function} onClose - To close the modal.
 * @param {Array} clues - Array of clue objects.
 * @param {Array} evidenceBoard - Array of connections [{clueId, connections:[clueId,...]}]
 * @param {Function} onConnect - Function(clueIdA, clueIdB)
 * @param {Object} assets - { clueId: assetUrl }
 * @param {string} colorPrimary - Brand primary color for board accents.
 * @param {string} colorAccent - Brand accent color for backgrounds.
 */
function ClueBoard({
  open,
  onClose,
  clues,
  evidenceBoard,
  onConnect,
  assets,
  colorPrimary = "#f21f07",
  colorAccent = "#f5f5f5",
}) {
  if (!open) return null;

  // For demonstration, allow player to click and connect clues visually (list-based, drag-and-drop not implemented)
  const foundClues = clues.filter((c) => c.found);

  return (
    <div
      role="dialog"
      aria-label="Clue Notebook"
      tabIndex={-1}
      style={{
        position: "fixed",
        left: 0, top: 0, right: 0, bottom: 0,
        background: "rgba(25,23,21, 0.27)",
        zIndex: 45,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: colorAccent,
          minWidth: 370,
          minHeight: 380,
          maxWidth: 520,
          border: `6px solid ${colorPrimary}`,
          borderRadius: "20px",
          padding: "2em 2em 2.5em",
          position: "relative",
          boxShadow: "0 10px 40px #2224",
        }}
      >
        <button
          aria-label="Close Notebook"
          title="Close"
          style={{
            position: "absolute",
            top: 15,
            right: 15,
            background: "#fff",
            border: `2px solid ${colorPrimary}`,
            borderRadius: "100%",
            fontSize: "1.2em",
            cursor: "pointer",
            color: colorPrimary,
            zIndex: 3,
            width: 34,
            height: 34,
            fontWeight: 900,
          }}
          onClick={onClose}
        >
          ×
        </button>
        <h2
          style={{
            fontFamily: "Comic Sans MS, Chalkboard, Arial",
            color: colorPrimary,
            textAlign: "center",
            marginBottom: 22,
            textShadow: "1px 1px #fff7, 0 2px #cce8",
          }}
        >
          📝 Clue Notebook
        </h2>
        <div style={{
          display: "flex", flexWrap: "wrap", gap: "12px 10px", justifyContent: "center",
          minHeight: "128px"
        }}>
          {foundClues.length === 0 ? (
            <span style={{ color: "#888" }}>(Find clues at the scene...)</span>
          ) : (
            foundClues.map((clue) => (
              <div
                key={clue.id}
                style={{
                  border: `2px solid #bbb`,
                  borderRadius: 9,
                  background: "#fffdfa",
                  display: "inline-flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: 76,
                  padding: "3px 2px",
                  boxShadow: "0 2px 12px #ffe78e44",
                  position: "relative",
                  marginBottom: 5,
                }}
              >
                <img
                  src={assets[clue.id]}
                  alt={clue.label}
                  title={clue.label}
                  style={{
                    width: 41,
                    marginBottom: 2,
                  }}
                />
                <span style={{
                  fontWeight: 700,
                  fontSize: "0.91em",
                  color: "#543c2a",
                  textAlign: "center"
                }}>{clue.label}</span>
                <div
                  style={{
                    position: "absolute",
                    left: 5,
                    bottom: 0,
                    fontSize: 12,
                    color: clue.isRedHerring ? "#fa7166" : colorPrimary,
                  }}
                >
                  {clue.isRedHerring ? "🧂 Red Herring" : ""}
                </div>
              </div>
            ))
          )}
        </div>
        <hr style={{ margin: "1.5em 0", borderColor: colorPrimary, opacity: 0.3 }} />
        {/* Simple connection UI: select and connect two clues */}
        <div>
          <label htmlFor="clueA" style={{ fontWeight: 600, color: colorPrimary }}>
            Connect clues
          </label>
          <div style={{ display: "flex", gap: 10 }}>
            <select id="clueA" style={{ minWidth: 80 }} aria-label="First clue"
              defaultValue=""
              onChange={() => { }}
            >
              <option value="">First clue</option>
              {foundClues.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
            <select id="clueB" style={{ minWidth: 80 }} aria-label="Second clue"
              defaultValue=""
              onChange={() => { }}
            >
              <option value="">Second clue</option>
              {foundClues.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
            <button
              style={{
                background: colorPrimary,
                color: "#fff",
                padding: "4px 16px",
                borderRadius: 7,
                border: "none",
                fontWeight: 700,
                fontSize: "1rem"
              }}
              onClick={() => {
                // Find select box values and trigger connection event
                const a = document.getElementById("clueA");
                const b = document.getElementById("clueB");
                if (a && b && a.value && b.value && a.value !== b.value) {
                  onConnect(a.value, b.value);
                  // Reset values
                  a.selectedIndex = 0;
                  b.selectedIndex = 0;
                }
              }}
            >
              Link 🔗
            </button>
          </div>
          <div style={{ marginTop: 16 }}>
            <b>Connections:</b>
            {evidenceBoard && evidenceBoard.length > 0 ? (
              <ul>
                {evidenceBoard.map((conn, idx) => (
                  <li key={idx}>{conn.clueId} ⇄ {conn.connections.join(", ")}</li>
                ))}
              </ul>
            ) : <span style={{ color: "#888" }}>None yet</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClueBoard;
