import React, { useState, useEffect } from "react";
import "./App.css";
import "./index.css";
import CrimeScene from "./components/CrimeScene";
import ClueBoard from "./components/ClueBoard";
import PuzzleModal from "./components/PuzzleModal";
import SuspectList from "./components/SuspectList";
import InterrogationModal from "./components/InterrogationModal";
import ResolutionModal from "./components/ResolutionModal";
import freepikApi from "./services/freepikApi";

/**
 * Top-level color palette and UI theme settings.
 */
const COLOR_PALETTE = {
  accent: "#f5f5f5",
  primary: "#f21f07",
  secondary: "#0a0b0b",
  // Additional colors for cartoon vibrancy:
  highlight: "#ffd93b",
  outline: "#222222",
  danger: "#ff7897",
  success: "#26efab",
};

/**
 * Initial game state: can be replaced with external or dynamic content later.
 */
const INITIAL_CLUES = [
  {
    id: "footprint",
    label: "Muddy Footprint",
    location: { x: 210, y: 290 },
    found: false,
    isRedHerring: false,
    imageType: "vector",
    theme: "cartoon",
  },
  {
    id: "glove",
    label: "Lost Glove",
    location: { x: 420, y: 180 },
    found: false,
    isRedHerring: false,
    imageType: "vector",
    theme: "cartoon",
  },
  {
    id: "suspicious-note",
    label: "Suspicious Note",
    location: { x: 120, y: 90 },
    found: false,
    isRedHerring: true, // Red herring clue
    imageType: "vector",
    theme: "cartoon",
  },
  // ...add more clues
];
const INITIAL_SUSPECTS = [
  {
    id: "prof-peacock",
    name: "Professor Peacock",
    alibi: "Was in the library reading during the time of the crime.",
    lies: 1,
    truths: 2,
    mood: "neutral",
    cartoonProfileQuery: "cartoon professor bird peacock glasses portrait",
  },
  {
    id: "mrs-mustard",
    name: "Mrs. Mustard",
    alibi: "Preparing dinner alone in the kitchen.",
    lies: 2,
    truths: 1,
    mood: "nervous",
    cartoonProfileQuery: "cartoon woman chef yellow dress vintage",
  },
  {
    id: "colonel-scarlet",
    name: "Colonel Scarlet",
    alibi: "Tending garden, saw nothing suspicious.",
    lies: 0,
    truths: 3,
    mood: "confident",
    cartoonProfileQuery: "cartoon man military uniform red hair badge",
  },
  // ... add more suspects
];

function App() {
  // Theme
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Game state
  const [clues, setClues] = useState(INITIAL_CLUES);
  const [suspects, setSuspects] = useState(INITIAL_SUSPECTS);
  const [evidenceBoard, setEvidenceBoard] = useState([]); // {clueId, connections:[clueId,...]}
  const [selectedPuzzle, setSelectedPuzzle] = useState(null); // If a puzzle/mini-game is triggered
  const [showPuzzleModal, setShowPuzzleModal] = useState(false);

  const [selectedSuspect, setSelectedSuspect] = useState(null); // For interrogation
  const [showInterrogation, setShowInterrogation] = useState(false);

  // Notebook (player can connect clues or drag-and-drop)
  const [clueNotebookOpen, setClueNotebookOpen] = useState(false);

  // End-of-game
  const [showResolution, setShowResolution] = useState(false);
  const [accusation, setAccusation] = useState(null);

  // Freepik asset cache: avoids unnecessary re-fetches
  const [freepikCache, setFreepikCache] = useState({});

  // Rules: win/lose logic; once a correct accusation is made or upon puzzle resolution.
  const [gameStatus, setGameStatus] = useState("playing"); // playing | accused | win | lose

  // PUBLIC_INTERFACE
  /** Open the clue notebook / board. */
  function handleNotebookOpen() {
    setClueNotebookOpen(true);
  }

  // PUBLIC_INTERFACE
  /** Close the clue notebook */
  function handleNotebookClose() {
    setClueNotebookOpen(false);
  }

  // PUBLIC_INTERFACE
  /** Called when a clue in the scene is clicked */
  async function handleClueClick(clueId) {
    // Unlock a puzzle if that clue is puzzle-gated, or reveal and add to board
    const clue = clues.find((c) => c.id === clueId);
    if (!clue) return;
    if (!clue.found) {
      if (clue.id === "glove") {
        // Example: For demonstration, the "glove" triggers a mini-puzzle
        setSelectedPuzzle({ clueId: clue.id, type: "pattern-sequence", difficulty: "easy" });
        setShowPuzzleModal(true);
      } else {
        discoverClue(clueId);
      }
    }
  }

  // PUBLIC_INTERFACE
  /** Called when a puzzle is solved; unlocks associated clue */
  function handlePuzzleComplete(result) {
    setShowPuzzleModal(false);
    if (result && result.clueId) {
      discoverClue(result.clueId);
    }
  }

  // INTERNAL: Mark a clue as found/unlocks and play a short animation
  async function discoverClue(clueId) {
    setClues((prev) =>
      prev.map((clue) =>
        clue.id === clueId ? { ...clue, found: true, foundAt: Date.now() } : clue
      )
    );
    // Optionally play animation, sound, etc.
  }

  // PUBLIC_INTERFACE
  /** Connect (relate) two clues on the notebook/board */
  function handleConnectClues(clueIdA, clueIdB) {
    // Add a new connection or update connections
    setEvidenceBoard((prev) => {
      const exists = prev.find(
        (conn) =>
          (conn.clueId === clueIdA && conn.connections.includes(clueIdB)) ||
          (conn.clueId === clueIdB && conn.connections.includes(clueIdA))
      );
      if (exists) return prev;
      // New connection
      return [
        ...prev,
        { clueId: clueIdA, connections: [clueIdB] },
      ];
    });
  }

  // PUBLIC_INTERFACE
  /** Start interrogation for a selected suspect */
  function handleInterrogateSuspect(suspectId) {
    setSelectedSuspect(suspectId);
    setShowInterrogation(true);
  }

  // PUBLIC_INTERFACE
  /** Called when interrogation modal is closed */
  function handleInterrogationClose() {
    setShowInterrogation(false);
    setSelectedSuspect(null);
  }

  // PUBLIC_INTERFACE
  /** Called when player accuses a suspect; triggers resolution modal */
  function handleAccuse(suspectId) {
    setAccusation(suspectId);
    setShowResolution(true);
    setGameStatus("accused");
  }

  // PUBLIC_INTERFACE
  /** Called from ResolutionModal to either restart or finish the game */
  function handleResolutionClose() {
    setShowResolution(false);
    setAccusation(null);
    setGameStatus("playing");
    // Could also implement restarting state, etc.
  }

  // Fetch Freepik cartoon/illustration assets for clues and suspects
  useEffect(() => {
    async function fetchAllAssets() {
      for (const clue of clues) {
        if (!freepikCache[clue.id]) {
          try {
            const resp = await freepikApi.searchImages(
              `${clue.label} ${clue.theme} ${clue.imageType}`,
              {
                limit: 1,
                order: "relevance",
              }
            );
            if (resp && resp.data && resp.data.length > 0) {
              setFreepikCache((prev) => ({
                ...prev,
                [clue.id]: resp.data[0].media.url,
              }));
            }
          } catch (e) {
            // Use a placeholder asset if Freepik call fails
            setFreepikCache((prev) => ({
              ...prev,
              [clue.id]:
                "https://cdn-icons-png.flaticon.com/512/1297/1297007.png", // detective clue icon
            }));
          }
        }
      }
      for (const suspect of suspects) {
        if (!freepikCache[suspect.id]) {
          try {
            const resp = await freepikApi.searchImages(
              suspect.cartoonProfileQuery + " avatar portrait",
              {
                limit: 1,
                order: "relevance",
              }
            );
            if (resp && resp.data && resp.data.length > 0) {
              setFreepikCache((prev) => ({
                ...prev,
                [suspect.id]: resp.data[0].media.url,
              }));
            }
          } catch (e) {
            setFreepikCache((prev) => ({
              ...prev,
              [suspect.id]: "https://cdn-icons-png.flaticon.com/128/706/706830.png", // default cartoon face
            }));
          }
        }
      }
    }
    // Only fetch if not already in cache (avoid infinite loop)
    fetchAllAssets();
    // eslint-disable-next-line
  }, [clues, suspects]);

  // Simple cartoonish navbar
  function Navbar() {
    return (
      <nav
        style={{
          background: COLOR_PALETTE.primary,
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.5rem 1.5rem",
          boxShadow: "0 6px 12px rgba(50,0,0,0.06)",
          borderRadius: "0 0 20px 20px",
          fontFamily: "Comic Sans MS, Chalkboard, cursive",
          fontWeight: 800,
          letterSpacing: 2,
        }}
      >
        <span style={{ fontSize: "1.5rem" }}>🕵️‍♂️ Cartoon Crime Chronicles</span>
        <div>
          <button
            className="theme-toggle"
            onClick={() =>
              setTheme((t) => (t === "light" ? "dark" : "light"))
            }
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            style={{
              background: COLOR_PALETTE.accent,
              color: COLOR_PALETTE.secondary,
              border: `2.5px solid ${COLOR_PALETTE.outline}`,
              fontWeight: 700,
              fontSize: "1rem",
              borderRadius: "10px",
              marginLeft: 12,
            }}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </nav>
    );
  }

  // Main layout: cartoon scene (center), notebook and suspect panel (side)
  return (
    <div className="App" style={{ background: COLOR_PALETTE.accent }}>
      <Navbar />
      <main
        style={{
          display: "flex",
          flexDirection: "row",
          minHeight: "75vh",
          marginTop: "1.5em",
          padding: "0 1vw",
          fontFamily: "Comic Sans MS, Chalkboard, Arial, system-ui",
        }}
      >
        {/* Main Crime Scene (takes 60% width) */}
        <section
          style={{
            flex: "3 1 0",
            minWidth: 0,
            maxWidth: "62vw",
            marginRight: "2vw",
          }}
        >
          <CrimeScene
            clues={clues}
            onClueClick={handleClueClick}
            clueAssets={freepikCache}
            highlightColor={COLOR_PALETTE.highlight}
            outlineColor={COLOR_PALETTE.outline}
          />
        </section>
        {/* Right panel: notebook and suspects */}
        <section
          style={{
            flex: "2 1 0",
            minWidth: "270px",
            maxWidth: "420px",
            background: COLOR_PALETTE.accent,
            border: `3px solid ${COLOR_PALETTE.primary}`,
            borderRadius: "18px",
            padding: "1em 0.3em",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <button
              onClick={handleNotebookOpen}
              style={{
                background: COLOR_PALETTE.primary,
                color: "#fff",
                border: "none",
                borderRadius: "999px",
                fontSize: "1.1rem",
                padding: "6px 28px",
                marginBottom: 7,
                fontWeight: 700,
                boxShadow: "1px 2px 2px rgba(0,0,0,0.02)",
                outline: `2px solid ${COLOR_PALETTE.outline}`,
                cursor: "pointer",
              }}
            >
              📝 Open Clue Notebook
            </button>
          </div>
          <div style={{ flex: 1 }}>
            <SuspectList
              suspects={suspects}
              assets={freepikCache}
              onInterrogate={handleInterrogateSuspect}
              onAccuse={handleAccuse}
            />
          </div>
        </section>
      </main>
      {/* Notebook/Clue Board Modal */}
      <ClueBoard
        open={clueNotebookOpen}
        onClose={handleNotebookClose}
        clues={clues}
        evidenceBoard={evidenceBoard}
        onConnect={handleConnectClues}
        assets={freepikCache}
        colorPrimary={COLOR_PALETTE.primary}
        colorAccent={COLOR_PALETTE.accent}
      />
      {/* Puzzle Modal (visible only if a puzzle is triggered) */}
      <PuzzleModal
        open={showPuzzleModal}
        puzzle={selectedPuzzle}
        onComplete={handlePuzzleComplete}
        onClose={() => setShowPuzzleModal(false)}
      />
      {/* Interrogation Modal (when chosen suspect) */}
      <InterrogationModal
        open={showInterrogation}
        suspect={suspects.find((s) => s.id === selectedSuspect)}
        onClose={handleInterrogationClose}
        assets={freepikCache}
      />
      {/* Resolution / Ending (when accused) */}
      <ResolutionModal
        open={showResolution}
        suspects={suspects}
        accusation={accusation}
        clues={clues}
        onClose={handleResolutionClose}
        colorPrimary={COLOR_PALETTE.primary}
      />
      {/* Game Footer */}
      <footer
        style={{
          background: COLOR_PALETTE.secondary,
          color: "#fff",
          padding: "8px 0",
          fontFamily: "Comic Sans MS, Chalkboard, cursive",
          fontWeight: 600,
        }}
      >
        <span>
          <b>ClueQuest:</b> Cartoon Crime Chronicles &copy; 2024
        </span>
      </footer>
    </div>
  );
}

export default App;
