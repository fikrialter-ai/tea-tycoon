import React, { useEffect } from "react";
import {
  Leaf,
  ArrowRight,
  RotateCcw,
  X,
  Wallet,
  TrendingUp,
  Coffee,
  Package,
  Target,
  Trophy,
  BookOpen,
} from "lucide-react";
import { LESSONS } from "./data";
import {
  rupiah as rp,
  calculateVariance,
  calculateWeeklyScore,
  calculateFinalScore,
} from "./engine";
export function TeaShop() {
  return (
    <div
      className="shop-scene"
      aria-label="Ilustrasi kedai teh Tealab dengan meja bar, tanaman, dan minuman teh"
    >
      <div className="scene-orbit" />
      <span className="scene-spark s1">✳</span>
      <span className="scene-spark s2">✳</span>
      <div className="scene-label">
        <span className="live-dot" /> BISNIS IMPIANMU, DIMULAI DI SINI
      </div>
      <div className="shop">
        <div className="shop-sign">
          tealab<span>TEH SEGAR, IDE SEGAR</span>
        </div>
        <div className="awning">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="shop-interior">
          <div className="shelf">
            <span>✿</span>
            <span>▥</span>
            <span>▥</span>
          </div>
          <div className="shop-menu">
            MENU HARI INI
            <hr />
            MATCHA LATTE
            <br />
            JASMINE TEA
            <br />
            MILK TEA<small>diracik sepenuh hati ♡</small>
          </div>
          <div className="barista">
            <div className="hair" />
            <div className="face">‿</div>
            <div className="apron">
              <Leaf size={24} />
            </div>
          </div>
          <div className="tea-cup cup-one">
            <Leaf size={21} />
          </div>
          <div className="tea-cup cup-two">
            <Leaf size={21} />
          </div>
        </div>
        <div className="counter">
          <span>setiap gelas punya cerita.</span>
        </div>
        <div className="shop-base" />
      </div>
      <div className="plant">
        <span>❧</span>
        <div />
      </div>
      <div className="floating-note">
        <span className="icon-tile">
          <TrendingUp size={22} />
        </span>
        <div>
          <small>Racikan sukses</small>
          <b>Strategi + secangkir teh</b>
        </div>
      </div>
      <div className="open-sign">
        BUKA
        <br />
        <small>TEH NIKMAT • HARI HANGAT</small>
      </div>
      <div className="scene-caption">
        SEJAK 2026 <span>✦</span> AWAL CERITA BESARMU
      </div>
    </div>
  );
}
export function CashBalanceCard({ cash }) {
  return (
    <div className="cash-card">
      <Wallet size={23} />
      <div>
        <small>Saldo kas saat ini</small>
        <b>{rp(cash)}</b>
      </div>
    </div>
  );
}
export function BudgetInputCard({ title, icon: Icon, value, onChange, hint }) {
  return (
    <div className="input-block">
      <div className="input-heading">
        <label htmlFor={title}>
          <Icon size={18} /> {title}
        </label>
        <div className="number-field">
          <input
            id={title}
            type="number"
            min="250"
            max="800"
            step="1"
            value={value}
            onChange={(e) =>
              onChange(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
          <span>gelas</span>
        </div>
      </div>
      <p>{hint}</p>
      <input
        aria-label={`${title} slider`}
        className="slider"
        type="range"
        min="250"
        max="800"
        step="10"
        value={value || 250}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="range-labels">
        <span>250 gelas</span>
        <span>800 gelas</span>
      </div>
    </div>
  );
}
export function BudgetSummary({ budget: b, confirm }) {
  return (
    <aside className="budget-summary">
      <div className="eyebrow">ANGGARAN / RENCANA</div>
      <h2>Ringkasan anggaran</h2>
      <div className="summary-line">
        <span>Anggaran penjualan</span>
        <b>{rp(b.revenue)}</b>
      </div>
      <div className="summary-line">
        <span>Anggaran bahan baku</span>
        <b>{rp(b.material)}</b>
      </div>
      <div className="summary-line">
        <span>Biaya operasional tetap</span>
        <b>{rp(b.fixed)}</b>
      </div>
      <div className="summary-line">
        <span>Anggaran pemasaran</span>
        <b>{rp(b.marketing)}</b>
      </div>
      <div className="summary-total">
        <span>PROYEKSI MINGGU INI · ESTIMASI LABA</span>
        <strong>{rp(b.profit)}</strong>
        <small>
          Proyeksi kas akhir <b>{rp(b.endingCash)}</b>
        </small>
      </div>
      {b.target > b.stock && (
        <p className="budget-warning">
          Target melebihi stok: kapasitas saat ini tidak cukup untuk mencapai
          target penjualan.
        </p>
      )}
      {!b.valid && (
        <p className="budget-warning" role="alert">
          Gunakan 250–800 gelas (bilangan bulat) dan pastikan total biaya tidak
          melebihi kas.
        </p>
      )}
      <button
        className="light-button full"
        disabled={!b.valid}
        onClick={confirm}
      >
        Jalankan bisnis minggu ini <ArrowRight size={18} />
      </button>
      <p className="summary-foot">
        Rencana dikunci. Berikutnya: kejadian bisnis minggu ini.
      </p>
    </aside>
  );
}
export function ActualResultCard({ label, value, positive }) {
  return (
    <div className={`stat-card ${positive ? "highlight" : ""}`}>
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}
const names = {
  revenue: "Penjualan",
  material: "Bahan baku",
  marketing: "Pemasaran",
  fixed: "Biaya tetap / tambahan",
  profit: "Laba",
};
export function VarianceTable({ budget, actual }) {
  return (
    <section className="card">
      <h2>Anggaran vs realisasi</h2>
      <p>
        Selisih = realisasi − anggaran. Biaya yang lebih rendah menguntungkan.
      </p>
      <p className="table-hint">
        Geser tabel ke samping untuk melihat seluruh kolom.
      </p>
      <div
        className="table-scroll"
        tabIndex={0}
        role="region"
        aria-label="Tabel anggaran dan realisasi"
      >
        <table>
          <thead>
            <tr>
              <th>Kategori</th>
              <th>Anggaran</th>
              <th>Realisasi</th>
              <th>Selisih</th>
            </tr>
          </thead>
          <tbody>
            {calculateVariance(budget, actual).map((r) => (
              <tr key={r.key}>
                <th>{names[r.key]}</th>
                <td>{rp(r.budget)}</td>
                <td>{rp(r.actual)}</td>
                <td
                  className={
                    r.delta === 0
                      ? "neutral"
                      : r.favorable
                        ? "favorable"
                        : "unfavorable"
                  }
                >
                  {r.delta > 0 ? "+" : ""}
                  {rp(r.delta)}
                  <small>
                    {r.delta === 0
                      ? "Sesuai rencana"
                      : r.favorable
                        ? "Menguntungkan"
                        : "Tidak menguntungkan"}
                  </small>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
export function VarianceAnalysis({
  entry: { budget: b, actual: a, event: e, accepted },
}) {
  return (
    <section className="analysis card">
      <div className="section-title">
        <span className="icon-tile">
          <BookOpen size={21} />
        </span>
        <h2>Kenapa hasilnya berbeda?</h2>
      </div>
      <p>
        Laba aktual{" "}
        {a.profit === b.profit
          ? "sesuai"
          : a.profit > b.profit
            ? "melampaui"
            : "di bawah"}{" "}
        anggaran sebesar <b>{rp(Math.abs(a.profit - b.profit))}</b>.{" "}
        {a.profit === b.profit
          ? "Tidak ada selisih laba."
          : a.profit > b.profit
            ? "Selisih ini menguntungkan."
            : "Selisih ini tidak menguntungkan."}
      </p>
      <p>
        Pasar berfluktuasi {((a.fluctuation - 1) * 100).toFixed(1)}%. Setelah
        pemasaran dan kejadian “{e.title}”
        {e.decision ? (accepted ? " yang diambil" : " yang dilewatkan") : ""},
        permintaan mencapai <b>{a.demand} gelas</b>; terjual{" "}
        <b>{a.sold} gelas</b>.
      </p>
      {a.missed > 0 && (
        <p>
          Stok membatasi penjualan: {a.missed} gelas permintaan belum terpenuhi.
          Pertimbangkan kapasitas tambahan jika permintaan ini berkelanjutan.
        </p>
      )}
      {a.waste > 0 && (
        <p>
          {a.waste} gelas tidak terjual tetapi tetap dikenakan biaya bahan.
          Sesuaikan stok untuk mengurangi pemborosan.
        </p>
      )}
      {e.material && (
        <p>
          Kenaikan harga supplier membuat biaya bahan meningkat 15% dari
          anggaran.
        </p>
      )}
      {e.expense > 0 && (
        <p>
          Biaya tak terduga {rp(e.expense)} menambah pengeluaran minggu ini.
        </p>
      )}
      {accepted && e.decision && (
        <p>
          Keputusan promosi menambah biaya pemasaran {rp(e.cost)}. Evaluasi
          apakah tambahan penjualan menutup biaya tersebut.
        </p>
      )}
      <div className="tip">
        <Target size={20} />
        <span>
          Akurasi anggaran {calculateWeeklyScore(b, a).accuracy.toFixed(1)}% ·
          Efisiensi stok {calculateWeeklyScore(b, a).efficiency.toFixed(1)}%
        </span>
      </div>
    </section>
  );
}
export function FinalReport({ history, restart }) {
  const s = calculateFinalScore(history);
  return (
    <>
      <div className="report-grid">
        <section className="score-card">
          <Trophy size={43} />
          <div className="eyebrow">TEALAB · SKOR BISNIS</div>
          <div className="score">
            {s.score}
            <span>/ 100</span>
          </div>
          <h2>{s.label}</h2>
          <p>Bisnis bertumbuh dari keputusan yang terus diperbaiki.</p>
        </section>
        <section className="card">
          <div className="eyebrow">TEALAB</div>
          <h2>Laporan akhir bisnis</h2>
          <div className="report-stats">
            {[
              ["Total pendapatan", rp(s.revenue)],
              ["Total pengeluaran", rp(s.expenses)],
              ["Laba bersih", rp(s.profit)],
              ["Kas akhir", rp(s.endingCash)],
              ["Rata-rata akurasi anggaran", `${s.accuracy.toFixed(1)}%`],
              ["Efisiensi persediaan", `${s.efficiency.toFixed(1)}%`],
            ].map(([label, value]) => (
              <ActualResultCard key={label} label={label} value={value} />
            ))}
          </div>
        </section>
      </div>
      <section className="card score-details">
        <h2>Bagaimana skormu dihitung?</h2>
        {[
          ["Profitabilitas", 40, s.profitability],
          ["Akurasi anggaran", 30, s.accuracy],
          ["Pengelolaan kas", 20, s.cash],
          ["Efisiensi operasional", 10, s.efficiency],
        ].map(([label, weight, value]) => (
          <div className="score-line" key={label}>
            <span>
              {label} <small>Bobot {weight}%</small>
            </span>
            <progress aria-label={label} max="100" value={value} />
            <b>{value.toFixed(0)}/100</b>
          </div>
        ))}
        <p>
          Profitabilitas: laba bersih ÷ target empat minggu Rp10.000.000,
          dibatasi 0–100%. Akurasi per minggu: 1 − |laba aktual − laba anggaran|
          ÷ nilai terbesar antara |laba anggaran| dan Rp1.250.000, dibatasi
          0–100%. Pengelolaan kas: proporsi minggu dengan kas akhir positif.
          Efisiensi: total gelas terjual ÷ total stok.
        </p>
      </section>
      <section className="learning">
        <div className="eyebrow">LEBIH DARI SEKADAR JUALAN TEH</div>
        <h2>Apa yang kamu pelajari?</h2>
        <div className="lesson-grid">
          {LESSONS.map(([title, description], i) => (
            <div key={title}>
              <span>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="next-row">
        <span>Rencana baru, peluang baru.</span>
        <button className="primary" onClick={restart}>
          <RotateCcw size={18} /> Main lagi
        </button>
      </div>
    </>
  );
}
export function Modal({ title, children, close }) {
  const ref = React.useRef(null);
  useEffect(() => {
    const prior = document.activeElement;
    ref.current?.focus();
    function onKey(e) {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const nodes = ref.current.querySelectorAll("button");
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      prior?.focus();
    };
  }, []);
  return (
    <div className="modal-backdrop" onClick={close}>
      <section
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="modal card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="close-button icon-button"
          aria-label="Tutup"
          onClick={close}
        >
          <X />
        </button>
        <h2 id="modal-title">{title}</h2>
        {children}
      </section>
    </div>
  );
}
