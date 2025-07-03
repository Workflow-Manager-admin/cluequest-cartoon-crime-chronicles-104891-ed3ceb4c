import React, { useState } from "react";

/**
 * PuzzleModal: shows mini-game for unlocking a key clue.
 * 
 * @param {boolean} open - Visible if true.
 * @param {Object} puzzle - {type, clueId, ...}
 * @param {Function} onComplete - Called with {clueId} upon puzzle solve.
 * @param {Function} onClose - To close modal, cancels puzzle.
 */
function PuzzleModal({ open, puzzle, onComplete, onClose }) {
  if (!open || !puzzle) return null;

  // Example mini-game: pattern memory puzzle ("Simon says" style sequence)
  if (puzzle.type === "pattern-sequence") {
    return (
      <PatternSequencePuzzle
        clueId={puzzle.clueId}
        onComplete={onComplete}
        onClose={onClose}
        difficulty={puzzle.difficulty}
      />
    );
  }
  // Add more puzzle types here (slider, riddle, code crack, etc.)
  return (
    <div>
      <b>Puzzle type not implemented</b>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

// Example memory pattern sequence puzzle (player must repeat a given color sequence)
function PatternSequencePuzzle({ clueId, onComplete, onClose, difficulty = "easy" }) {
  // Sequence can become longer/harder based on difficulty
  const sequences = {
    easy: ["red", "blue", "yellow"],
    medium: ["red", "blue", "yellow", "red"],
    hard: ["blue", "yellow", "red", "blue", "yellow"],
  };
  const colors = ["red", "blue", "yellow"];
  const answer = sequences[difficulty] || sequences.easy;
  const [input, setInput] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [step, setStep] = useState(0);

  function handleColorClick(color) {
    setInput([...input, color]);
    if (answer[step] === color) {
      setStep(step + 1);
      if (step + 1 === answer.length) {
        setFeedback("Correct! Clue unlocked.");
        setTimeout(() => {
          setFeedback("");
          onComplete({ clueId });
        }, 950);
      }
    } else {
      setFeedback("Oops! Try again.");
      setTimeout(() => {
        setInput([]);
        setStep(0);
        setFeedback("");
      }, 1300);
    }
  }

  return (
    <div
      role="dialog"
      aria-label="Solve Puzzle"
      style={{
        position: "fixed",
        left: 0, top: 0, right: 0, bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(120,80,80, 0.19)",
        zIndex: 60,
      }}
    >
      <div
        style={{
          background: "#fff9e8",
          border: "5px solid #ffd93b",
          borderRadius: 16,
          minWidth: 310,
          padding: "2em 1em",
          boxShadow: "0 7px 28px #0002"
        }}
      >
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 20, right: 38, border: "none", background: "#fff4", fontWeight: "700", borderRadius: 12, fontSize: 19, width: 40, height: 40, cursor: "pointer" }}
        >
          ×
        </button>
        <h2 style={{ textAlign: "center", color: "#aa4c10" }}>
          Mini-Game: Memory Sequence!
        </h2>
        <p style={{ textAlign: "center" }}>
          Repeat the <b>color sequence</b> to unlock the clue.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
          {colors.map((col) => (
            <button
              key={col}
              onClick={() => handleColorClick(col)}
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: "none",
                background: col,
                boxShadow: "0 3px 6px #0002",
                cursor: "pointer",
                outline: "2px solid #222",
              }}
            />
          ))}
        </div>
        <div style={{ minHeight: 30, color: "#219c53", textAlign: "center", marginTop: 15 }}>
          {feedback}
        </div>
        <div style={{
          background: "#e8dfb0",
          borderRadius: 6,
          padding: 7,
          marginTop: 17,
          textAlign: "center",
          fontSize: "1em",
          color: "#9a6c23"
        }}>
          Pattern to repeat: {answer.map((c, i) =>
            <span style={{
              background: c,
              color: "#333",
              borderRadius: 10,
              padding: "1px 10px",
              marginRight: 4
            }} key={i}>{c}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default PuzzleModal;
