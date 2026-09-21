import { BUSINESS as B } from "./data";

// Keep the existing save key so current players retain their budgets and results.
export const SAVE_KEY = "tealab-game-v1";
export const BEFORE_GAME = ["landing", "story", "mission", "tutorial"];
export const AFTER_RESULT = ["result", "evaluation", "transition", "final"];
export const PHASES = [
  {
    id: "planning",
    label: "Anggaran",
    verb: "Rencanakan",
    concept: "Perencanaan",
  },
  {
    id: "event",
    label: "Kejadian",
    verb: "Hadapi perubahan",
    concept: "Ketidakpastian bisnis",
  },
  {
    id: "decision",
    label: "Keputusan",
    verb: "Alokasikan modal",
    concept: "Alokasi sumber daya",
  },
  {
    id: "result",
    label: "Hasil",
    verb: "Ukur kinerja",
    concept: "Realisasi bisnis",
  },
  {
    id: "evaluation",
    label: "Evaluasi",
    verb: "Pelajari selisih",
    concept: "Pengendalian & evaluasi",
  },
];
export const initialGame = () => ({
  stage: "landing",
  storyIndex: 0,
  cash: B.capital,
  history: [],
  plan: { target: 500, stock: 500, marketing: 250000 },
});
export function restoreGame() {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    const stages = [
      ...BEFORE_GAME,
      ...PHASES.map((p) => p.id),
      "transition",
      "final",
    ];
    if (
      !s ||
      !stages.includes(s.stage) ||
      !Array.isArray(s.history) ||
      s.history.length > 4 ||
      !Number.isFinite(s.cash) ||
      !s.plan
    )
      return initialGame();
    if (
      ["event", "decision"].includes(s.stage) &&
      (!s.event || !s.budget || !Number.isFinite(s.fluctuation))
    )
      return initialGame();
    if (AFTER_RESULT.includes(s.stage) && !s.history.length)
      return initialGame();
    return { ...s, storyIndex: Math.min(2, Math.max(0, s.storyIndex || 0)) };
  } catch {
    return initialGame();
  }
}
export function currentWeek(game) {
  return Math.min(
    4,
    Math.max(
      1,
      game.history.length + (AFTER_RESULT.includes(game.stage) ? 0 : 1),
    ),
  );
}
export function weeklyLesson({ actual: a, budget: b, event: e, accepted }) {
  if (a.waste > 0)
    return `Siapkan stok lebih dekat ke permintaan: ${a.waste} gelas tidak terjual, tetapi bahan tetap dibayar.`;
  if (a.missed > 0)
    return `Ada ${a.missed} gelas permintaan yang belum terlayani. Pertimbangkan stok tambahan tanpa mengabaikan risiko sisa stok.`;
  if (e.material)
    return "Sisakan ruang kas untuk kenaikan biaya bahan. Target penjualan saja tidak cukup untuk menjaga laba.";
  if (accepted && e.decision)
    return "Ukur tambahan pendapatan terhadap biaya promosi. Permintaan tambahan belum tentu menghasilkan laba tambahan.";
  if (e.expense)
    return "Biaya tak terduga mengurangi laba. Cadangan kas memberi bisnis ruang untuk tetap beroperasi.";
  if (a.profit < b.profit)
    return "Gunakan penjualan aktual sebagai acuan target berikutnya, lalu pertimbangkan kondisi pasar yang berubah.";
  return "Rencana dan kapasitas yang selaras membantu menjaga laba. Evaluasi lagi sebelum mengulang anggaran minggu ini.";
}

export function resultCause({ actual: a, budget: b, event: e, accepted }) {
  const reasons = [];
  if (a.sold < b.target)
    reasons.push(
      a.missed > 0
        ? `Stok ${b.stock} gelas membatasi penjualan di bawah target ${b.target} gelas.`
        : `Permintaan aktual ${a.demand} gelas berada di bawah target ${b.target} gelas.`,
    );
  if (a.sold > b.target)
    reasons.push(
      `Penjualan ${a.sold} gelas melampaui target ${b.target} gelas sehingga pendapatan lebih tinggi.`,
    );
  if (e.material)
    reasons.push(
      "Harga supplier naik 15%, sehingga bahan baku lebih mahal dari anggaran.",
    );
  if (e.expense)
    reasons.push(`Kejadian “${e.title}” menambahkan biaya di luar anggaran.`);
  if (accepted && e.decision)
    reasons.push(
      "Promosi yang kamu pilih menambah biaya pemasaran di luar anggaran awal.",
    );
  return reasons.length
    ? reasons.join(" ")
    : "Penjualan dan biaya sesuai dengan anggaran. Karena itu, laba aktual sama dengan rencana.";
}
