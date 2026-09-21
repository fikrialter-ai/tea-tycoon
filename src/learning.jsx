import React from "react";
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Check,
  Coffee,
  Coins,
  Leaf,
  Lightbulb,
  Package,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { TeaShop } from "./shared";

export function TeaTip({ children }) {
  return (
    <aside className="tea-tip">
      <Lightbulb size={20} />
      <div>
        <b>TEA TIP</b>
        <p>{children}</p>
      </div>
    </aside>
  );
}

export function Teala({ children, dismiss }) {
  return (
    <aside className="teala-dialogue">
      <div
        className="teala-avatar"
        role="img"
        aria-label="Teala, asisten bisnis Tealab"
      >
        <div className="teala-hair" />
        <div className="teala-face">
          <i />
          <i />
          <span>⌣</span>
        </div>
        <div className="teala-apron">
          <Leaf size={17} />
        </div>
      </div>
      <div>
        <b>
          TEALA <small>Asisten bisnis Tealab</small>
        </b>
        <p>{children}</p>
      </div>
      {dismiss && (
        <button
          className="icon-button"
          aria-label="Sembunyikan tips Teala"
          onClick={dismiss}
        >
          <X size={17} />
        </button>
      )}
    </aside>
  );
}

const cycle = [
  ["Rencanakan", "Susun anggaran"],
  ["Jalankan", "Operasikan kedai"],
  ["Ukur", "Lihat hasil aktual"],
  ["Evaluasi", "Analisis selisih"],
  ["Perbaiki", "Anggaran berikutnya"],
];
export function BudgetCycle({ active = -1 }) {
  return (
    <section className="budget-cycle" aria-label="Siklus budgeting">
      <div className="eyebrow">SIKLUS BUDGETING</div>
      <ol>
        {cycle.map(([title, text], i) => (
          <li
            key={title}
            className={i === active ? "active" : ""}
            aria-current={i === active ? "step" : undefined}
          >
            <span className="cycle-dot">{i + 1}</span>
            <div>
              <b>{title}</b>
              <small>{text}</small>
            </div>
            {i < 4 && <ArrowRight size={15} />}
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Landing({ onStart, onHelp }) {
  return (
    <>
      <div className="landing-grid">
        <section className="hero">
          <div className="eyebrow">
            <span className="live-dot" /> GAME SIMULASI BISNIS · 5–10 MENIT
          </div>
          <h1>
            Kedai tehmu.
            <br />
            Rencana besarmu.
          </h1>
          <div className="hero-subtitle">
            TEA TYCOON <span>Budget • Brew • Grow</span>
          </div>
          <p>
            Kamu adalah <b>manajer baru Tealab.</b> Kelola modal Rp15 juta
            selama 4 minggu: susun anggaran, hadapi kejutan, lalu pelajari
            hasilnya.
          </p>
          <div className="hero-mission">
            <Target size={21} />
            <p>
              <b>Misi: kas terjaga, anggaran realistis, laba bertumbuh.</b> Raih
              skor terbaik dari keputusanmu, bukan hanya penjualan tertinggi.
            </p>
          </div>
          <div className="actions">
            <button className="primary" onClick={onStart}>
              Mulai cerita <ArrowRight size={18} />
            </button>
            <button className="secondary" onClick={onHelp}>
              <BookOpen size={18} /> Cara bermain
            </button>
          </div>
          <div className="hero-facts">
            <span>
              <b>4 minggu</b> perjalanan bisnismu
            </span>
            <span>
              <b>Rp15 juta</b> modal untuk dikelola
            </span>
            <span>
              <b>100 poin</b> skor bisnis maksimal
            </span>
          </div>
        </section>
        <TeaShop />
      </div>
      <section className="landing-bottom">
        <div>
          <span className="eyebrow">BELAJAR ANGGARAN DENGAN BERMAIN</span>
          <h2>
            Satu gelas.
            <br />
            Banyak keputusan.
          </h2>
        </div>
        {[
          [
            Target,
            "Rencanakan",
            "Anggarkan pendapatan dan biaya sebelum kedai dibuka.",
          ],
          [
            Coffee,
            "Jalankan",
            "Hadapi kejadian pasar dan pilih penggunaan modal.",
          ],
          [
            TrendingUp,
            "Pelajari",
            "Bandingkan hasil dengan rencana, lalu perbaiki.",
          ],
        ].map(([Icon, title, text]) => (
          <div className="feature" key={title}>
            <span className="icon-tile">
              <Icon size={22} />
            </span>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </section>
    </>
  );
}

const story = [
  {
    title: "Selamat datang di Tealab!",
    tag: "BAB 01 · PERAN BARUMU",
    text: "Kamu baru saja ditunjuk sebagai manajer Tealab, kedai teh kecil dengan mimpi besar.",
    dialogue:
      "Hai! Aku Teala. Aku akan membantumu meracik keputusan bisnis yang baik.",
    icon: Coffee,
    stat: "Manajer baru",
    detail: "Kamu yang menentukan arah kedai.",
  },
  {
    title: "Modal ada. Rencana di tanganmu.",
    tag: "BAB 02 · SEBUAH KEPERCAYAAN",
    text: "Pemilik menitipkan Rp15.000.000 dan mempercayakan operasional kedai selama 4 minggu kepadamu.",
    dialogue:
      "Sebelum kedai dibuka, kita perlu merencanakan penjualan, stok, dan biaya promosi.",
    icon: Coins,
    stat: "Rp15.000.000",
    detail: "Modal awal untuk 4 minggu virtual.",
  },
  {
    title: "Bukan sekadar menjual teh.",
    tag: "BAB 03 · TANTANGAN DIMULAI",
    text: "Susun anggaran, alokasikan modal, hadapi kejutan, dan bandingkan hasil aktual dengan rencanamu.",
    dialogue:
      "Bisakah kamu membawa Tealab bertahan dan berkembang selama 4 minggu?",
    icon: TrendingUp,
    stat: "Rencana → keputusan → evaluasi",
    detail: "Setiap minggu adalah kesempatan belajar.",
  },
];
export function StoryIntro({ index, onNext, onBack }) {
  const s = story[index],
    Icon = s.icon;
  return (
    <div className="story-layout">
      <div className="story-visual">
        <TeaShop />
        <div className="story-stamp">
          <Icon size={26} />
          <div>
            <b>{s.stat}</b>
            <small>{s.detail}</small>
          </div>
        </div>
      </div>
      <section className="story-copy" key={index}>
        <span className="eyebrow">{s.tag}</span>
        <h1 tabIndex={-1}>{s.title}</h1>
        <p>{s.text}</p>
        <Teala>{s.dialogue}</Teala>
        <div className="story-bottom">
          <span
            className="story-dots"
            aria-label={`Cerita ${index + 1} dari 3`}
          >
            {story.map((_, i) => (
              <i key={i} className={i <= index ? "filled" : ""} />
            ))}
          </span>
          <span>{index + 1} / 3</span>
        </div>
        <div className="actions">
          <button className="secondary" onClick={onBack}>
            <ArrowLeft size={17} /> Kembali
          </button>
          <button className="primary" onClick={onNext}>
            {index === 2 ? "Siap mengelola Tealab" : "Lanjut cerita"}
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}

export function Mission({ onNext, onBack }) {
  return (
    <section className="onboarding-page">
      <div className="eyebrow">SURAT MISI · MANAJER TEALAB</div>
      <h1>Misi kamu</h1>
      <p className="page-lead">
        Kelola Tealab selama 4 minggu dengan menggunakan budgeting yang baik.
      </p>
      <div className="mission-grid">
        {[
          [Wallet, "Jaga kas", "Pastikan bisnis tidak kehabisan uang."],
          [
            Target,
            "Buat anggaran realistis",
            "Usahakan hasil aktual mendekati rencana.",
          ],
          [
            TrendingUp,
            "Kembangkan laba",
            "Ambil keputusan yang meningkatkan performa bisnis.",
          ],
        ].map(([Icon, title, text], i) => (
          <article className="mission-card card" key={title}>
            <span className="mission-index">0{i + 1}</span>
            <span className="icon-tile">
              <Icon size={28} />
            </span>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </div>
      <TeaTip>
        Keputusan terbaik bukan selalu yang menghasilkan penjualan tertinggi.
        Pertimbangkan biaya, kas, dan akurasi anggaran.
      </TeaTip>
      <div className="mission-score">
        <b>Cara meraih skor terbaik</b>
        <p>
          Profitabilitas 40% · Akurasi anggaran 30% · Pengelolaan kas 20% ·
          Efisiensi stok 10%.
        </p>
        <small>
          Selesaikan 4 minggu dan raih skor hingga 100. Semakin baik
          keputusanmu, semakin tinggi penilaian bisnismu.
        </small>
      </div>
      <div className="next-row">
        <button className="secondary" onClick={onBack}>
          <ArrowLeft size={17} /> Kembali ke cerita
        </button>
        <button className="primary" onClick={onNext}>
          Pelajari cara bermain
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}

const tutorial = [
  {
    title: "Susun anggaran",
    icon: Target,
    concept: "Perencanaan",
    text: "Tentukan target penjualan, jumlah stok, dan dana promosi. Kamu sedang merencanakan penggunaan sumber daya bisnis.",
    example: "Target 500 gelas × Rp15.000 = anggaran penjualan Rp7.500.000.",
  },
  {
    title: "Hadapi kejadian bisnis",
    icon: Sparkles,
    concept: "Ketidakpastian bisnis",
    text: "Setiap minggu ada satu kejadian yang dapat mengubah permintaan atau biaya. Anggaran yang sudah dibuat tetap menjadi pembanding.",
    example:
      "Viral: permintaan +30% · Hujan: −20% · Supplier naik: biaya bahan +15%.",
  },
  {
    title: "Ambil keputusan",
    icon: Coins,
    concept: "Alokasi sumber daya",
    text: "Beberapa kejadian menawarkan pilihan. Pertimbangkan manfaat, biaya, kas, dan stok sebelum memilih.",
    example:
      "Festival: bayar Rp750.000 untuk potensi permintaan +40%, atau lewatkan tanpa biaya tambahan.",
  },
  {
    title: "Lihat hasil aktual",
    icon: Coffee,
    concept: "Kinerja aktual",
    text: "Setelah kedai beroperasi, lihat gelas terjual, pendapatan, biaya, laba, dan saldo kas yang benar-benar terjadi.",
    example:
      "Penjualan dibatasi permintaan dan stok. Semua stok tetap dikenakan biaya bahan, termasuk yang tidak terjual.",
  },
  {
    title: "Evaluasi dan perbaiki",
    icon: BookOpen,
    concept: "Pengendalian & evaluasi kinerja",
    text: "Bandingkan anggaran dengan realisasi. Selisih (variance) menunjukkan seberapa jauh hasil berbeda dari rencana.",
    example:
      "Laba anggaran Rp3 juta vs aktual Rp2,5 juta → selisih −Rp500 ribu: tidak menguntungkan.",
  },
];
export function Tutorial({ onDone, inModal = false }) {
  return (
    <section
      className={inModal ? "tutorial-content" : "onboarding-page tutorial-page"}
    >
      {!inModal && (
        <>
          <span className="eyebrow">PANDUAN MANAJER BARU</span>
          <h1>Cara bermain</h1>
        </>
      )}
      <p className="page-lead">Setiap minggu terdiri dari 5 tahap.</p>
      <div className="tutorial-journey">
        {tutorial.map(({ title, icon: Icon, concept, text, example }, i) => (
          <article className="tutorial-step" key={title}>
            <span className="tutorial-number">{i + 1}</span>
            <div>
              <div className="tutorial-heading">
                <Icon size={21} />
                <h2>{title}</h2>
                <span className="concept-tag">{concept}</span>
              </div>
              <p>{text}</p>
              <div className="tutorial-example">{example}</div>
            </div>
          </article>
        ))}
      </div>
      <BudgetCycle />
      <TeaTip>
        Gunakan hasil evaluasi untuk membuat anggaran yang lebih baik di minggu
        berikutnya.
      </TeaTip>
      <button className="primary full tutorial-cta" onClick={onDone}>
        {inModal ? "Mengerti, tutup panduan" : "Mulai minggu 1"}
        <ArrowRight size={18} />
      </button>
    </section>
  );
}
