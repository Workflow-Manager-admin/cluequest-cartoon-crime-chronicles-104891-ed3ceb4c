import React from "react";

/**
 * ResolutionModal: outcome after accusation, branching ending/reveal
 * 
 * @param {boolean} open - Modal visible if true.
 * @param {Array} suspects - Array of suspects data.
 * @param {string} accusation - Suspect id accused.
 * @param {Array} clues - Array of all clues (to inform ending).
 * @param {Function} onClose - Handler to close/reset.
 * @param {string} colorPrimary - Game primary brand color.
 */
function ResolutionModal({
  open,
  suspects,
  accusation,
  clues,
  onClose,
  colorPrimary = "#f21f07",
}) {
  if (!open) return null;

  // Decision logic: for demo, Colonel Scarlet = culprit
  const CULPRIT = "colonel-scarlet";
  const accusedSuspect = suspects.find((s) => s.id === accusation);

  // Branching ending: red herring found, correct/incorrect, clues count
  const foundClues = clues.filter((c) => c.found);
  const foundRedHerrings = foundClues.filter((c) => c.isRedHerring);

  let endingType = "bad";
  let endingMessage = "";
  if (accusation === CULPRIT && foundClues.length >= 2 && foundRedHerrings.length < 2) {
    endingType = "win";
    endingMessage = "Congratulations! Your deductions were spot on. You discovered the right clues and unmasked the real culprit!";
  } else if (accusation === CULPRIT) {
    endingType = "alternate";
    endingMessage = "You caught the culprit, but you fell for some red herrings along the way. The culprit confesses, but you'll wonder what clues you missed…";
  } else {
    endingType = "lose";
    endingMessage = "Oops! That was not the correct culprit. The mystery continues. Try again and watch out for misdirections!";
  }

  const ENDING_ART = {
    win: "https://cdn-icons-png.flaticon.com/512/2203/2203123.png", // medal
    lose: "https://cdn-icons-png.flaticon.com/128/634/634011.png",   // frown
    alternate: "https://cdn-icons-png.flaticon.com/128/551/551849.png", // lamp/question
  };

  return (
    <div
      role="dialog"
      aria-label="Game Over"
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(25,23,21, 0.62)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1001
      }}
    >
      <div
        style={{
          background: "#fffdfa",
          maxWidth: 500,
          minWidth: 370,
          margin: "auto",
          minHeight: 350,
          border: `7px solid ${colorPrimary}`,
          borderRadius: 23,
          padding: "2.1em 2em 2.5em",
          boxShadow: "0 9px 38px #0a0b0b38",
          textAlign: "center",
          fontFamily: "Comic Sans MS, Chalkboard, Arial",
        }}
      >
        <img
          src={ENDING_ART[endingType]}
          alt={endingType}
          style={{ width: 68, marginBottom: 9 }}
        />
        <h2 style={{
          color: colorPrimary,
          margin: "10px 0 22px 0"
        }}>
          {endingType === "win"
            ? "Case Closed!"
            : endingType === "alternate"
              ? "Victory? (But...)"
              : "Case Not Solved"}
        </h2>
        <p style={{
          color: "#433",
          fontSize: "1.1em",
        }}>
          {endingMessage}
        </p>
        <div style={{
          marginTop: 32,
          display: "flex", gap: 18,
          justifyContent: "center"
        }}>
          <button
            style={{
              background: "#fde69a",
              color: colorPrimary,
              border: `2px solid ${colorPrimary}`,
              padding: "7px 18px",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer"
            }}
            onClick={onClose}
          >
            Play Again
          </button>
          <a
            href="https://www.freepik.com/"
            style={{
              background: "#f21f07",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 14px",
              fontWeight: 700,
              textDecoration: "none",
              display: "inline-block",
              fontSize: "1rem",
            }}
            target="_blank"
            rel="noopener noreferrer"
          >Credits / Freepik</a>
        </div>
      </div>
    </div>
  );
}

export default ResolutionModal;
