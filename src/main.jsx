import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  CalendarDays,
  HelpCircle,
  Leaf,
  RotateCcw,
  Wallet,
} from "lucide-react";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/inter/latin-800.css";
import { EVENTS } from "./data";
import { calculateActualResult, calculateBudget, rupiah as rp } from "./engine";
import {
  SAVE_KEY,
  BEFORE_GAME,
  PHASES,
  currentWeek,
  initialGame,
  restoreGame,
} from "./journey";
import { Landing, Mission, StoryIntro, Tutorial } from "./learning";
import {
  CompletedReport,
  DecisionScreen,
  Evaluation,
  EventReveal,
  PhaseProgress,
  Planning,
  Results,
  WeekTransition,
} from "./gameplay";
import { Modal } from "./shared";
import "./style.css";
import "./game.css";

const headings = {
  planning: [
    "Saatnya meracik rencana.",
    "Tentukan target, siapkan stok, dan alokasikan dana promosi.",
  ],
  event: [
    "Ada kabar dari kedai!",
    "Kenali kejadian minggu ini sebelum mengambil langkah berikutnya.",
  ],
  decision: [
    "Keputusan ada di tanganmu.",
    "Bandingkan manfaat dan biaya. Tidak ada pilihan yang selalu terbaik.",
  ],
  result: [
    "Hasil minggu",
    "Lihat kinerja aktual dari keputusan yang sudah kamu jalankan.",
  ],
  evaluation: [
    "Evaluasi minggu",
    "Cari penyebab selisih dan gunakan sebagai bekal perencanaan berikutnya.",
  ],
  transition: [
    "Satu minggu, banyak pelajaran.",
    "Tutup catatan minggu ini dan siapkan langkah selanjutnya.",
  ],
  final: [
    "Perjalananmu, dalam satu laporan.",
    "TEALAB · LAPORAN BISNIS 4 MINGGU",
  ],
};

function GameHeader({ game, week, onHelp, onRestart }) {
  const inGame = !BEFORE_GAME.includes(game.stage);
  const phase =
    PHASES.find((p) => p.id === game.stage)?.label ||
    (game.stage === "final" ? "Laporan akhir" : "Penutupan minggu");
  return (
    <header className="game-header">
      <div className="brand">
        <span className="logo">
          <Leaf size={23} />
        </span>
        <span>
          TEA TYCOON<small>Budget • Brew • Grow</small>
        </span>
      </div>
      {inGame && (
        <div className="hud-stats">
          <span>
            <CalendarDays size={17} />
            <b>Minggu {week} / 4</b>
          </span>
          <span>
            <Wallet size={17} />
            <b>{rp(game.cash)}</b>
          </span>
          <span className="hud-phase">
            <i />
            {phase}
          </span>
        </div>
      )}
      <div className="header-right">
        <button
          className="icon-button"
          aria-label="Buka panduan bermain"
          onClick={onHelp}
        >
          <HelpCircle size={21} />
        </button>
        {game.stage !== "landing" && (
          <button
            className="icon-button"
            aria-label="Mulai ulang"
            onClick={onRestart}
          >
            <RotateCcw size={19} />
          </button>
        )}
      </div>
    </header>
  );
}

function App() {
  const [game, setGame] = useState(restoreGame),
    [modal, setModal] = useState(null),
    [saveError, setSaveError] = useState(false);
  const content = useRef(null);
  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(game));
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  }, [game]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const title = content.current?.querySelector("h1");
    title?.setAttribute("tabindex", "-1");
    title?.focus({ preventScroll: true });
  }, [game.stage, game.storyIndex]);
  const week = currentWeek(game),
    before = BEFORE_GAME.includes(game.stage),
    last = game.history.at(-1);
  const budget = calculateBudget(game.plan, game.cash);
  const go = (stage) => setGame((g) => ({ ...g, stage }));
  function confirm() {
    setGame((g) => {
      if (g.stage !== "planning") return g;
      const locked = calculateBudget(g.plan, g.cash);
      if (!locked.valid) return g;
      return {
        ...g,
        stage: "event",
        budget: locked,
        event: EVENTS[Math.floor(Math.random() * EVENTS.length)],
        fluctuation: 0.9 + Math.random() * 0.2,
      };
    });
  }
  function resolve(accepted) {
    setGame((g) => {
      // Evaluation and back navigation never run the simulation or change cash.
      if (!["event", "decision"].includes(g.stage)) return g;
      if (
        accepted &&
        g.event.decision &&
        g.budget.expenses + g.event.cost > g.cash
      )
        return g;
      const actual = calculateActualResult(
        g.budget,
        g.event,
        accepted,
        g.cash,
        g.fluctuation,
      );
      return {
        ...g,
        stage: "result",
        cash: actual.endingCash,
        history: [
          ...g.history,
          { budget: g.budget, actual, event: g.event, accepted },
        ],
      };
    });
  }
  const title = headings[game.stage];
  return (
    <>
      <GameHeader
        game={game}
        week={week}
        onHelp={() => setModal("help")}
        onRestart={() => setModal("restart")}
      />
      {saveError && (
        <p className="notice" role="status">
          Penyimpanan tidak tersedia. Progres tetap bisa dimainkan selama
          halaman ini terbuka.
        </p>
      )}
      <main ref={content}>
        {game.stage === "landing" && (
          <Landing
            onStart={() => go("story")}
            onHelp={() => setModal("help")}
          />
        )}
        {game.stage === "story" && (
          <StoryIntro
            index={game.storyIndex || 0}
            onNext={() =>
              game.storyIndex === 2
                ? go("mission")
                : setGame((g) => ({
                    ...g,
                    storyIndex: (g.storyIndex || 0) + 1,
                  }))
            }
            onBack={() =>
              game.storyIndex === 0
                ? go("landing")
                : setGame((g) => ({ ...g, storyIndex: g.storyIndex - 1 }))
            }
          />
        )}
        {game.stage === "mission" && (
          <Mission onNext={() => go("tutorial")} onBack={() => go("story")} />
        )}
        {game.stage === "tutorial" && (
          <Tutorial onDone={() => go("planning")} />
        )}
        {!before && (
          <>
            <div className="game-top">
              <div>
                <div className="eyebrow">
                  {PHASES.find((p) => p.id === game.stage)?.concept ||
                    "CATATAN BISNIS · TEALAB"}
                </div>
                <h1>
                  {title[0]}
                  {["result", "evaluation"].includes(game.stage)
                    ? ` ${week}`
                    : ""}
                </h1>
                <p>{title[1]}</p>
              </div>
              <span className="manager-badge">
                <Leaf size={16} /> MANAJER TEALAB
              </span>
            </div>
            {game.stage !== "final" && (
              <PhaseProgress game={game} week={week} />
            )}
            {game.stage === "planning" && (
              <Planning
                key={week}
                game={game}
                budget={budget}
                onPlan={(key, value) =>
                  setGame((g) => ({ ...g, plan: { ...g.plan, [key]: value } }))
                }
                confirm={confirm}
              />
            )}
            {game.stage === "event" && (
              <EventReveal
                event={game.event}
                onNext={() =>
                  game.event.decision ? go("decision") : resolve(false)
                }
              />
            )}
            {game.stage === "decision" && (
              <DecisionScreen game={game} resolve={resolve} />
            )}
            {game.stage === "result" && (
              <Results entry={last} onNext={() => go("evaluation")} />
            )}
            {game.stage === "evaluation" && (
              <Evaluation
                entry={last}
                onNext={() => go("transition")}
                onBack={() => go("result")}
              />
            )}
            {game.stage === "transition" && (
              <WeekTransition
                entry={last}
                week={week}
                onNext={() => go(week === 4 ? "final" : "planning")}
              />
            )}
            {game.stage === "final" && (
              <CompletedReport
                history={game.history}
                restart={() => setModal("restart")}
              />
            )}
          </>
        )}
      </main>
      <footer>
        <span>
          <Leaf size={15} /> TEALAB · Diracik dengan rencana.
        </span>
        <span>
          AFL 1 — MK Budgeting <span className="footer-dot">•</span> Anggaran
          dan Fungsi Anggaran
        </span>
      </footer>
      {modal && (
        <Modal
          close={() => setModal(null)}
          title={modal === "help" ? "Cara bermain" : "Mulai perjalanan baru?"}
        >
          {modal === "help" ? (
            <Tutorial inModal onDone={() => setModal(null)} />
          ) : (
            <>
              <p>
                Semua anggaran dan riwayat permainan ini akan dihapus. Kamu akan
                mulai kembali dengan modal Rp15.000.000.
              </p>
              <div className="actions">
                <button className="secondary" onClick={() => setModal(null)}>
                  Batal
                </button>
                <button
                  className="primary"
                  onClick={() => {
                    setGame(initialGame());
                    setModal(null);
                  }}
                >
                  Ya, mulai ulang
                </button>
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
