import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { calculateActualResult, calculateFinalScore } from "../src/engine.js";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const errors = [];
const readSave = (page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem("tealab-game-v1")));
async function screenshot(page, name) {
  await page.screenshot({
    path: `test-results/${name}.png`,
    fullPage: true,
    animations: "disabled",
  });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
    `${name}: page overflows`,
  );
}
async function play(size, label) {
  const context = await browser.newContext({
    viewport: size,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("http://localhost:5173");
  await page.getByRole("heading", { name: /Kedai tehmu/ }).waitFor();
  await screenshot(page, `landing-${label}`);
  await page.getByRole("button", { name: "Cara bermain", exact: true }).click();
  await page.getByRole("dialog").waitFor();
  assert.equal(await page.locator(".tutorial-step").count(), 5);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Mulai cerita" }).click();
  await page
    .getByRole("heading", { name: "Selamat datang di Tealab!" })
    .waitFor();
  assert.equal(await page.getByRole("spinbutton").count(), 0);
  await screenshot(page, `story-${label}`);
  await page.getByRole("button", { name: "Lanjut cerita" }).click();
  await page.reload();
  await page
    .getByRole("heading", { name: "Modal ada. Rencana di tanganmu." })
    .waitFor();
  await page.getByRole("button", { name: "Kembali", exact: true }).click();
  await page
    .getByRole("heading", { name: "Selamat datang di Tealab!" })
    .waitFor();
  await page.getByRole("button", { name: "Lanjut cerita" }).click();
  await page.getByRole("button", { name: "Lanjut cerita" }).click();
  await page.getByRole("button", { name: "Siap mengelola Tealab" }).click();
  await page.getByRole("heading", { name: "Misi kamu" }).waitFor();
  await screenshot(page, `mission-${label}`);
  await page.getByRole("button", { name: "Pelajari cara bermain" }).click();
  assert.equal(await page.locator(".tutorial-step").count(), 5);
  await screenshot(page, `tutorial-${label}`);
  await page
    .getByRole("button", { name: "Mulai minggu 1", exact: true })
    .click();
  await page.getByRole("heading", { name: "Rencana bisnismu" }).waitFor();
  await screenshot(page, `planning-${label}`);
  await page.getByRole("button", { name: "Sembunyikan tips Teala" }).click();
  await page
    .getByRole("spinbutton", { name: "Target penjualan", exact: true })
    .fill("900");
  assert.equal(
    await page
      .getByRole("button", { name: "Jalankan bisnis minggu ini" })
      .isDisabled(),
    true,
  );
  await page
    .getByRole("spinbutton", { name: "Target penjualan", exact: true })
    .fill("500");
  for (let week = 1; week <= 4; week++) {
    await page.evaluate((index) => {
      Math.random = () => [0.8, 0.9, 0.3, 0.15][index - 1];
    }, week);
    const starting = await readSave(page);
    await page
      .getByRole("button", { name: "Jalankan bisnis minggu ini" })
      .click();
    const locked = await readSave(page);
    assert.equal(locked.stage, "event");
    await page.reload();
    assert.deepEqual((await readSave(page)).event, locked.event);
    if (week === 1) await screenshot(page, `event-${label}`);
    await page.getByRole("button", { name: "Hadapi kejadian" }).click();
    const accepted = week === 1;
    if (locked.event.decision) {
      assert.equal((await readSave(page)).stage, "decision");
      if (week === 1) await screenshot(page, `decision-${label}`);
      await page
        .getByRole("button", {
          name: accepted ? "Pilih ikut festival" : "Pilih lewatkan kesempatan",
          exact: true,
        })
        .click();
    }
    await page
      .getByRole("heading", { name: `Hasil minggu ${week}`, exact: true })
      .waitFor();
    const result = await readSave(page);
    assert.equal(result.history.length, week);
    const expected = calculateActualResult(
      locked.budget,
      locked.event,
      accepted,
      starting.cash,
      locked.fluctuation,
    );
    assert.deepEqual(result.history.at(-1).actual, expected);
    assert.equal(result.cash, expected.endingCash);
    assert.equal(await page.locator("table").count(), 0);
    if (week === 1) await screenshot(page, `result-${label}`);
    await page
      .getByRole("button", { name: "Evaluasi anggaran", exact: true })
      .click();
    await page
      .getByRole("heading", { name: `Evaluasi minggu ${week}`, exact: true })
      .waitFor();
    assert.equal(await page.locator("tbody tr").count(), 5);
    if (week === 1) {
      await screenshot(page, `evaluation-${label}`);
      await page.getByRole("button", { name: "Kembali ke hasil" }).click();
      await page
        .getByRole("button", { name: "Evaluasi anggaran", exact: true })
        .click();
      await page.reload();
      assert.deepEqual((await readSave(page)).history, result.history);
      assert.equal((await readSave(page)).cash, result.cash);
    }
    await page.getByRole("button", { name: "Selesaikan minggu ini" }).click();
    await page
      .getByRole("heading", { name: `Minggu ${week} selesai!` })
      .waitFor();
    if (week === 1) await screenshot(page, `transition-${label}`);
    await page
      .getByRole("button", {
        name:
          week === 4 ? "Lihat laporan akhir" : `Lanjut ke minggu ${week + 1}`,
        exact: true,
      })
      .click();
  }
  await page.getByRole("heading", { name: "Laporan akhir bisnis" }).waitFor();
  const final = await readSave(page);
  assert.equal(final.history.length, 4);
  assert.equal(calculateFinalScore(final.history).endingCash, final.cash);
  await screenshot(page, `final-${label}`);
  await page.reload();
  await page
    .getByRole("button", { name: "Lihat ringkasan", exact: true })
    .click();
  assert.equal(await page.locator(".history-grid article").count(), 4);
  await page.getByRole("button", { name: "Main lagi", exact: true }).click();
  await page.getByRole("button", { name: "Batal", exact: true }).click();
  assert.deepEqual((await readSave(page)).history, final.history);
  await page.getByRole("button", { name: "Main lagi", exact: true }).click();
  await page.getByRole("button", { name: "Ya, mulai ulang" }).click();
  assert.equal((await readSave(page)).cash, 15000000);
  assert.equal((await readSave(page)).history.length, 0);
  // A save from the old version must open directly at the result, with unchanged history.
  await page.evaluate((saved) => {
    localStorage.setItem(
      "tealab-game-v1",
      JSON.stringify({ ...saved, stage: "result", storyIndex: undefined }),
    );
  }, final);
  await page.reload();
  await page
    .getByRole("heading", { name: "Hasil minggu 4", exact: true })
    .waitFor();
  assert.deepEqual((await readSave(page)).history, final.history);
  // Decision cost cannot exceed the cash left after the locked budget.
  const first = final.history[0];
  await page.evaluate((entry) => {
    localStorage.setItem(
      "tealab-game-v1",
      JSON.stringify({
        stage: "decision",
        cash: entry.budget.expenses,
        history: [],
        plan: entry.budget,
        budget: entry.budget,
        event: entry.event,
        fluctuation: 1,
      }),
    );
  }, first);
  await page.reload();
  assert.equal(
    await page
      .getByRole("button", { name: "Pilih ikut festival", exact: true })
      .isDisabled(),
    true,
  );
  await page
    .getByRole("button", { name: "Pilih lewatkan kesempatan", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "Hasil minggu 1", exact: true })
    .waitFor();
  await context.close();
}
try {
  await play({ width: 1440, height: 1000 }, "desktop");
  await play({ width: 390, height: 844 }, "mobile");
  assert.deepEqual(errors, []);
  console.log(
    "PASS: desktop/mobile story → mission → tutorial → 4 weeks → report; both decision outcomes; original calculations; persistence; legacy saves; no duplicate results; unaffordable decision; restart; no console errors or page overflow.",
  );
} finally {
  await browser.close();
}
