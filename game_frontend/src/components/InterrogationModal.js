import React, { useState } from "react";

/**
 * InterrogationModal displays cartoon chat with the selected suspect.
 * 
 * @param {boolean} open - Modal open
 * @param {object} suspect - Suspect object (name, mood, lies, truths, etc.)
 * @param {function} onClose - handler to close the modal
 * @param {object} assets - { suspectId: imageUrl }
 */
function InterrogationModal({ open, suspect, onClose, assets }) {
  // Fix: useState must always be called!
  const [chatIdx, setChatIdx] = useState(0);
  if (!open || !suspect) return null;

  const DIALOGUE = [
    {
      type: "truth",
      line: "I had nothing to do with this! I was in the library all night.",
    },
    {
      type: "lie",
      line: "I didn't speak to anyone all evening. Not even Mrs. Mustard.",
    },
    {
      type: "truth",
      line: "I did hear a large crash near the dining hall though...",
    },
    {
      type: "emotion",
      line: "*looks nervous*",
    },
    {
      type: "truth",
      line: "Have you checked the kitchen door? It was unlocked.",
    },
    {
      type: "lie",
      line: "I have no idea whose glove that is.",
    },
  ];
  // Shuffle and reduce dialogues based on suspect's actual lie/truth count
  const getDialogueFlow = () => {
    let pile = [...DIALOGUE];
    let flow = [];
    let truths = suspect.truths;
    let lies = suspect.lies;
    let emotionUsed = false;
    for (const msg of pile) {
      if (msg.type === "truth" && truths > 0) {
        flow.push({ ...msg, by: suspect.name });
        truths -= 1;
      }
      if (msg.type === "lie" && lies > 0) {
        flow.push({ ...msg, by: suspect.name });
        lies -= 1;
      }
      if (msg.type === "emotion" && !emotionUsed) {
        flow.push({ ...msg, by: suspect.name });
        emotionUsed = true;
      }
      if (flow.length >= suspect.truths + suspect.lies + 1) break;
    }
    flow.push({
      type: "system",
      line: "You may try to press them further or accuse!",
      by: "Detective",
    });
    return flow;
  };

  const dialogueFlow = getDialogueFlow();

  const currentMessage = dialogueFlow[chatIdx];

  function handleNext() {
    if (chatIdx < dialogueFlow.length - 1) {
      setChatIdx(chatIdx + 1);
    }
  }

  function resetModal() {
    setChatIdx(0);
    onClose();
  }

  // Mood emoji
  const MOOD_ICONS = {
    neutral: "😐",
    nervous: "😰",
    confident: "😎",
    angry: "😡",
  };
  const mood = MOOD_ICONS[suspect.mood] || "🙂";

  return (
    <div
      role="dialog"
      aria-label="Interrogation"
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(16,16,18, 0.31)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          minWidth: 370,
          maxWidth: 480,
          minHeight: 330,
          border: "5px solid #f8cf43",
          borderRadius: "18px",
          padding: "2em 2em 2.2em",
          position: "relative",
          boxShadow: "0 2px 22px #1e085e22"
        }}
      >
        <button
          aria-label="Close Interrogation"
          style={{
            position: "absolute",
            top: 14, right: 14,
            background: "#fff7e6",
            border: "2px solid #f21f07",
            borderRadius: 15,
            fontWeight: 900,
            fontSize: 18,
            color: "#d1171d",
            width: 38, height: 38,
            cursor: "pointer"
          }}
          onClick={resetModal}
        >
          ×
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 700 }}>
          <img
            src={assets[suspect.id]}
            alt={suspect.name}
            style={{
              width: 53, height: 53, borderRadius: "50%", border: "3px solid #eecdbf"
            }}
          />
          <span style={{ fontSize: "1.2em", color: "#cd5211c" }}>{suspect.name} {mood}</span>
        </div>
        <div style={{
          margin: "1.8em 0 1.1em 0",
          background: "#e5ecff",
          borderRadius: 14,
          padding: "18px 18px",
          fontFamily: "Chalkboard, Comic Sans MS, Arial",
          fontSize: "1.17em",
          color: "#0a0b0b",
          minHeight: 55,
          boxShadow: "0 1.5px 5px #1e088d19",
        }}>
          <b>{currentMessage.by}:</b><br />
          <span>{currentMessage.line}</span>
        </div>
        <div style={{
          display: "flex", justifyContent: "space-between",
          marginTop: 18
        }}>
          <button
            onClick={resetModal}
            style={{ background: "#ffe6e2", color: "#c62929", border: "none", borderRadius: 8, fontWeight: 700, fontSize: "1em", padding: "7px 18px" }}
          >Close</button>
          {chatIdx < dialogueFlow.length - 1 ? (
            <button
              onClick={handleNext}
              style={{ background: "#f8cf43", color: "#433", border: "none", borderRadius: 8, fontWeight: 700, fontSize: "1em", padding: "7px 18px" }}
            >Next</button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default InterrogationModal;
