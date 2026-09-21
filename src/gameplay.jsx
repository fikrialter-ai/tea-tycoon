import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  CloudRain,
  Coffee,
  Coins,
  Heart,
  Leaf,
  Megaphone,
  Package,
  Sparkles,
  Store,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Wallet,
  Wrench,
  Zap,
} from "lucide-react";
import { BUSINESS as B, MARKETING } from "./data";
import { rupiah as rp, calculateWeeklyScore } from "./engine";
import { PHASES, weeklyLesson, resultCause } from "./journey";
import {
  BudgetInputCard,
  BudgetSummary,
  VarianceTable,
  VarianceAnalysis,
  FinalReport,
} from "./shared";
import { BudgetCycle, Teala, TeaTip } from "./learning";

const icons = {
  spark: Sparkles,
  rain: CloudRain,
  box: Package,
  heart: Heart,
  bolt: Zap,
  tool: Wrench,
};

export function PhaseProgress({ game, week }) {
  const phaseIndex =
    game.stage === "transition"
      ? 5
      : PHASES.findIndex((p) => p.id === game.stage);
  return (
    <section className="journey-panel" aria-label={`Perjalanan minggu ${week}`}>
      <div className="week-track">
        <span>
          <CalendarDays size={17} /> PERJALANAN KEDAI
        </span>
        <ol>
          {[1, 2, 3, 4].map((n) => (
            <li
              key={n}
              className={n === week ? "active" : n < week ? "done" : ""}
              aria-current={n === week ? "step" : undefined}
            >
              {n < week ? <Check size={14} /> : <span>{n}</span>}
              <b>Minggu {n}</b>
            </li>
          ))}
        </ol>
      </div>
      <ol className="phase-track">
        {PHASES.map((phase, i) => {
          const skipped =
            phase.id === "decision" && phaseIndex > 2 && !game.event?.decision;
          return (
            <li
              key={phase.id}
              className={`${phaseIndex === i ? "active" : ""} ${phaseIndex > i ? "done" : ""}`}
              aria-current={phaseIndex === i ? "step" : undefined}
            >
              <span>{phaseIndex > i ? <Check size={16} /> : i + 1}</span>
              <div>
                <b>{phase.label}</b>
                <small>
                  {skipped
                    ? "Tanpa pilihan tambahan"
                    : phaseIndex === i
                      ? "Kamu di sini"
                      : phase.verb}
                </small>
              </div>
            </li>
          );
        })}
      </ol>
      {game.history.length > 0 && (
        <details className="in-game-history">
          <summary>
            Catatan minggu yang sudah berjalan ({game.history.length})
          </summary>
          <div>
            {game.history.map((h, i) => (
              <article key={i}>
                <b>Minggu {i + 1}</b>
                <dl>
                  <div>
                    <dt>Pendapatan</dt>
                    <dd>{rp(h.actual.revenue)}</dd>
                  </div>
                  <div>
                    <dt>Laba</dt>
                    <dd>{rp(h.actual.profit)}</dd>
                  </div>
                  <div>
                    <dt>Selisih laba</dt>
                    <dd>{rp(h.actual.profit - h.budget.profit)}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </details>
      )}
    </section>
  );
}

export function Planning({ game, budget, onPlan, confirm }) {
  const [guide, setGuide] = useState(true);
  const previous = game.history.at(-1);
  return (
    <>
      {guide && game.history.length === 0 && (
        <Teala dismiss={() => setGuide(false)}>
          Sebelum kedai dibuka, kita buat anggaran dulu. Geser target dan stok,
          lalu lihat bagaimana rencana labamu berubah.
        </Teala>
      )}
      <section className="budget-context">
        <div>
          <span className="eyebrow">PERENCANAAN & KOORDINASI</span>
          <h2>Kenapa kamu membuat anggaran?</h2>
          <p>
            Anggaran membantu merencanakan pendapatan dan biaya sebelum bisnis
            berjalan.
          </p>
        </div>
        <div className="concept-chain">
          <span>
            <Target />
            Target penjualan
          </span>
          <ArrowRight />
          <span>
            <Package />
            Kebutuhan sumber daya
          </span>
          <ArrowRight />
          <span>
            <TrendingUp />
            Estimasi laba
          </span>
        </div>
      </section>
      {previous && (
        <aside className="previous-week">
          <BookOpen size={22} />
          <div>
            <b>Bekal dari minggu {game.history.length}</b>
            <p>{weeklyLesson(previous)}</p>
            <small>
              Laba {rp(previous.actual.profit)} · Selisih{" "}
              {rp(previous.actual.profit - previous.budget.profit)} · Sisa stok{" "}
              {previous.actual.waste} gelas
            </small>
          </div>
        </aside>
      )}
      <div className="planning-grid">
        <section className="card plan-controls">
          <div className="section-title">
            <span className="icon-tile">
              <Coffee size={23} />
            </span>
            <div>
              <h2>Rencana bisnismu</h2>
              <p>Racik target, persediaan, dan promosi.</p>
            </div>
          </div>
          <div className="budget-control">
            <span className="concept-tag">Anggaran penjualan</span>
            <BudgetInputCard
              title="Target penjualan"
              icon={Target}
              value={game.plan.target}
              onChange={(v) => onPlan("target", v)}
              hint="Berapa gelas yang kamu perkirakan dapat terjual? Target adalah perkiraan, bukan jaminan penjualan."
            />
          </div>
          <div className="budget-control">
            <span className="concept-tag">Anggaran bahan baku</span>
            <BudgetInputCard
              title="Stok / kapasitas produksi"
              icon={Package}
              value={game.plan.stock}
              onChange={(v) => onPlan("stock", v)}
              hint="Berapa gelas yang akan kamu siapkan? Seluruh stok dikenakan biaya bahan, termasuk yang tidak terjual."
            />
          </div>
          <div className="budget-control marketing-control">
            <span className="concept-tag">Anggaran pemasaran</span>
            <div className="input-block">
              <h3>
                <Megaphone size={18} /> Dana promosi
              </h3>
              <p>
                Berapa dana yang ingin dialokasikan untuk menarik pelanggan?
              </p>
              <div
                className="marketing-options"
                role="group"
                aria-label="Pilih anggaran pemasaran"
              >
                {MARKETING.map((v, i) => (
                  <button
                    key={v}
                    aria-pressed={game.plan.marketing === v}
                    className={game.plan.marketing === v ? "selected" : ""}
                    onClick={() => onPlan("marketing", v)}
                  >
                    {v === 0 ? "Rp0" : `${v / 1000} rb`}
                    <small>+{i * 5}% permintaan</small>
                    {game.plan.marketing === v && <Check size={13} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="market-note">
            <Users size={22} />
            <p>
              Pasar normal <b>±500 gelas/minggu</b>, berfluktuasi ±10%. Promosi
              dan kejadian akan memengaruhi permintaan.
            </p>
          </div>
        </section>
        <BudgetSummary budget={budget} confirm={confirm} />
      </div>
      <div className="assumptions">
        <span>
          <Coffee size={18} /> Harga jual <b>{rp(B.price)}/gelas</b>
        </span>
        <span>
          <Package size={18} /> Bahan <b>{rp(B.material)}/gelas</b>
        </span>
        <span>
          <Store size={18} /> Biaya tetap <b>{rp(B.fixed)}/minggu</b>
        </span>
      </div>
      <TeaTip>
        Target penjualan terlalu tinggi membuat rencana laba terlihat bagus,
        tetapi memperbesar risiko selisih dengan hasil aktual.
      </TeaTip>
      <BudgetCycle active={0} />
    </>
  );
}

export function EventReveal({ event, onNext }) {
  const Icon = icons[event.icon];
  return (
    <div className="focused-stage">
      <section className={`event-card card event-${event.id}`}>
        <span className="eyebrow">KABAR DARI KEDAI · KEJADIAN BISNIS</span>
        <div className="event-art">
          <span className="event-orbit" />
          <Leaf className="art-leaf" size={28} />
          <div className="event-icon">
            <Icon size={54} />
          </div>
          <Sparkles className="art-spark" size={23} />
        </div>
        <h2>{event.title}</h2>
        <p>{event.description}</p>
        <div className="impact-card">
          <small>
            {event.decision ? "KESEMPATAN MINGGU INI" : "DAMPAK PADA BISNIS"}
          </small>
          <b>{event.effect}</b>
        </div>
        <p className="event-next">
          {event.decision
            ? "Ada pilihan yang perlu kamu pertimbangkan sebelum kedai beroperasi."
            : "Kejadian ini berlaku otomatis. Lanjutkan untuk melihat kinerja kedai."}
        </p>
        <button className="primary full" onClick={onNext}>
          Hadapi kejadian
          <ArrowRight size={18} />
        </button>
      </section>
      <TeaTip>
        Anggaran tidak selalu sama dengan realisasi karena kondisi bisnis dapat
        berubah.
      </TeaTip>
    </div>
  );
}

export function DecisionScreen({ game, resolve }) {
  const e = game.event,
    affordable = game.cash >= game.budget.expenses + e.cost;
  const title = e.id === "festival" ? "Ikut festival" : "Ambil tawaran";
  return (
    <section className="decision-screen">
      <div className="decision-heading">
        <span className="eyebrow">
          ALOKASI SUMBER DAYA · TIMBANG MANFAAT & BIAYA
        </span>
        <h2>{e.title}</h2>
        <p>{e.description}</p>
      </div>
      <div className="decision-context">
        <span>
          <Wallet size={18} /> Kas setelah alokasi anggaran{" "}
          <b>{rp(game.cash - game.budget.expenses)}</b>
        </span>
        <span>
          <Package size={18} /> Stok tersedia <b>{game.budget.stock} gelas</b>
        </span>
      </div>
      <div className="decision-options">
        <article className="card decision-option">
          <span className="eyebrow">OPSI A · AMBIL KESEMPATAN</span>
          <span className="icon-tile">
            <Megaphone size={28} />
          </span>
          <h3>{title}</h3>
          <dl>
            <div>
              <dt>Tambahan biaya promosi</dt>
              <dd>−{rp(e.cost)}</dd>
            </div>
            <div>
              <dt>Potensi permintaan</dt>
              <dd>+{Math.round((e.demand - 1) * 100)}%</dd>
            </div>
          </dl>
          <p>
            Tambah jangkauan pelanggan. Pastikan stok dan kas mendukung
            keputusanmu.
          </p>
          <button
            className="primary full"
            disabled={!affordable}
            onClick={() => resolve(true)}
            aria-label={`Pilih ${title.toLowerCase()}`}
          >
            Pilih ini <ArrowRight size={18} />
          </button>
          {!affordable && (
            <p role="status" className="decision-warning">
              Sisa kas tidak cukup untuk biaya kesempatan ini.
            </p>
          )}
        </article>
        <article className="card decision-option">
          <span className="eyebrow">OPSI B · PERTAHANKAN RENCANA</span>
          <span className="icon-tile">
            <Wallet size={28} />
          </span>
          <h3>{e.id === "festival" ? "Tidak ikut" : "Lewatkan tawaran"}</h3>
          <dl>
            <div>
              <dt>Tambahan biaya</dt>
              <dd>{rp(0)}</dd>
            </div>
            <div>
              <dt>Tambahan permintaan</dt>
              <dd>Tanpa bonus</dd>
            </div>
          </dl>
          <p>
            Pertahankan kas dan jalankan kedai dengan anggaran yang sudah
            disusun.
          </p>
          <button
            className="secondary full"
            onClick={() => resolve(false)}
            aria-label="Pilih lewatkan kesempatan"
          >
            Pilih ini <ArrowRight size={18} />
          </button>
        </article>
      </div>
      <TeaTip>
        Permintaan tambahan belum tentu menjadi penjualan. Gelas terjual tetap
        dibatasi jumlah stok yang disiapkan.
      </TeaTip>
    </section>
  );
}

function CountValue({ value, money = false, suffix = "" }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    let frame, start;
    const tick = (time) => {
      start ??= time;
      const t = Math.min(1, (time - start) / 320);
      setDisplay(Math.round(value * (1 - (1 - t) ** 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return (
    <>
      <span aria-hidden="true">
        {money ? rp(display) : display}
        {suffix}
      </span>
      <span className="sr-only">
        {money ? rp(value) : value}
        {suffix}
      </span>
    </>
  );
}

export function ProfitComparison({ entry }) {
  const { budget: b, actual: a } = entry,
    delta = a.profit - b.profit;
  return (
    <section className="profit-comparison card">
      <div className="eyebrow">APAKAH SESUAI RENCANA?</div>
      <h2>Rencana bertemu realita.</h2>
      <div className="comparison-values">
        <div>
          <small>Laba anggaran</small>
          <strong>{rp(b.profit)}</strong>
        </div>
        <span className="versus">vs</span>
        <div>
          <small>Laba aktual</small>
          <strong>{rp(a.profit)}</strong>
        </div>
        <div
          className={`variance-value ${delta === 0 ? "neutral" : delta > 0 ? "favorable" : "unfavorable"}`}
        >
          <small>Selisih laba (variance)</small>
          <strong>
            {delta > 0 ? "+" : ""}
            {rp(delta)}
          </strong>
        </div>
      </div>
      <p
        className={
          delta === 0 ? "neutral" : delta > 0 ? "favorable" : "unfavorable"
        }
      >
        <b>
          {delta === 0
            ? "Sesuai anggaran"
            : delta > 0
              ? "Selisih menguntungkan"
              : "Selisih tidak menguntungkan"}
        </b>{" "}
        · Laba aktual{" "}
        {delta === 0
          ? "sama dengan"
          : delta > 0
            ? "lebih tinggi dari"
            : "lebih rendah dari"}{" "}
        anggaran.
      </p>
    </section>
  );
}

export function Results({ entry, onNext }) {
  const a = entry.actual;
  return (
    <>
      <div className="result-banner">
        <span className="icon-tile">
          <Store size={30} />
        </span>
        <div>
          <span className="eyebrow">KEDAI SELESAI BEROPERASI</span>
          <h2>Inilah hasil racikan keputusanmu.</h2>
          <p>
            {a.sold} gelas terjual dari {a.stock} gelas yang disiapkan. Sekarang
            ukur hasil bisnisnya.
          </p>
        </div>
      </div>
      <div className="stats-grid result-stats">
        {[
          [Coffee, "Gelas terjual", a.sold, false],
          [Coins, "Pendapatan aktual", a.revenue, true],
          [Package, "Total biaya", a.expenses, true],
          [TrendingUp, "Laba aktual", a.profit, true],
          [Wallet, "Kas akhir", a.endingCash, true],
        ].map(([Icon, label, value, money]) => (
          <div
            className={`stat-card ${label === "Laba aktual" ? "highlight" : ""}`}
            key={label}
          >
            <Icon size={20} />
            <small>{label}</small>
            <strong>
              <CountValue
                value={value}
                money={money}
                suffix={money ? "" : " gelas"}
              />
            </strong>
          </div>
        ))}
      </div>
      <ProfitComparison entry={entry} />
      <section className="result-cause card">
        <h2>Kenapa?</h2>
        <p>{resultCause(entry)}</p>
      </section>
      <div className="weekly-insight">
        <BookOpen size={23} />
        <div>
          <b>Pelajaran minggu ini</b>
          <p>{weeklyLesson(entry)}</p>
        </div>
      </div>
      <TeaTip>
        Hasil aktual sudah tercatat. Berikutnya, cari penyebab selisih sebelum
        menyusun rencana baru.
      </TeaTip>
      <div className="next-row">
        <span>Langkah berikutnya: evaluasi anggaran dan realisasi.</span>
        <button className="primary" onClick={onNext}>
          Evaluasi anggaran
          <ArrowRight size={18} />
        </button>
      </div>
    </>
  );
}

export function Evaluation({ entry, onNext, onBack }) {
  return (
    <>
      <ProfitComparison entry={entry} />
      <TeaTip>
        Variance adalah realisasi dikurangi anggaran. Pendapatan lebih tinggi
        atau biaya lebih rendah berarti selisih yang menguntungkan.
      </TeaTip>
      <VarianceTable budget={entry.budget} actual={entry.actual} />
      <VarianceAnalysis entry={entry} />
      <div className="weekly-insight">
        <BookOpen size={23} />
        <div>
          <b>Pelajaran minggu ini</b>
          <p>{weeklyLesson(entry)}</p>
        </div>
      </div>
      <BudgetCycle active={3} />
      <div className="next-row">
        <button className="secondary" onClick={onBack}>
          <ArrowLeft size={17} /> Kembali ke hasil
        </button>
        <button className="primary" onClick={onNext}>
          Selesaikan minggu ini
          <Check size={18} />
        </button>
      </div>
    </>
  );
}

export function WeekTransition({ entry, week, onNext }) {
  const a = entry.actual,
    score = calculateWeeklyScore(entry.budget, a);
  return (
    <section className="transition-screen card">
      <div className="completion-seal">
        <Check size={38} />
      </div>
      <span className="eyebrow">SATU LANGKAH LEBIH MAHIR</span>
      <h2>Minggu {week} selesai!</h2>
      <p>Gunakan hasil minggu ini untuk membuat keputusan lebih baik.</p>
      <div className="transition-stats">
        <div>
          <small>Laba minggu ini</small>
          <b>{rp(a.profit)}</b>
        </div>
        <div>
          <small>Kas akhir</small>
          <b>{rp(a.endingCash)}</b>
        </div>
        <div>
          <small>Akurasi anggaran</small>
          <b>{score.accuracy.toFixed(1)}%</b>
        </div>
      </div>
      <TeaTip>{weeklyLesson(entry)}</TeaTip>
      <BudgetCycle active={4} />
      <button className="primary full" onClick={onNext}>
        {week === 4 ? "Lihat laporan akhir" : `Lanjut ke minggu ${week + 1}`}
        <ArrowRight size={18} />
      </button>
    </section>
  );
}

export function CompletedReport({ history, restart }) {
  const [summary, setSummary] = useState(false);
  return (
    <>
      <div className="completed-banner">
        <Trophy size={28} />
        <div>
          <b>PERJALANAN SELESAI</b>
          <span>
            4 minggu menjadi manajer Tealab. Setiap keputusan membawa pelajaran.
          </span>
        </div>
        <span className="completion-stars" aria-hidden="true">
          ✦ ✦ ✦
        </span>
      </div>
      <FinalReport history={history} restart={restart} />
      <button
        className="secondary full summary-toggle"
        aria-expanded={summary}
        aria-controls="history-summary"
        onClick={() => setSummary(!summary)}
      >
        <BookOpen size={18} />
        {summary ? "Tutup ringkasan" : "Lihat ringkasan"}
      </button>
      {summary && (
        <section className="card history-summary" id="history-summary">
          <h2>Ringkasan perjalanan 4 minggu</h2>
          <p>Bandingkan keputusan dan hasil setiap minggu.</p>
          <div className="history-grid">
            {history.map((h, i) => (
              <article key={i}>
                <span className="eyebrow">MINGGU {i + 1}</span>
                <h3>{h.event.title}</h3>
                <p>
                  {h.event.decision
                    ? h.accepted
                      ? "Kesempatan diambil"
                      : "Kesempatan dilewatkan"
                    : "Dampak kejadian berlaku otomatis"}
                </p>
                <dl>
                  {[
                    ["Pendapatan", rp(h.actual.revenue)],
                    ["Laba", rp(h.actual.profit)],
                    ["Selisih laba", rp(h.actual.profit - h.budget.profit)],
                    [
                      "Akurasi",
                      `${calculateWeeklyScore(h.budget, h.actual).accuracy.toFixed(1)}%`,
                    ],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
