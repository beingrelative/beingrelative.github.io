// Every number on the page comes from this file. `src` points at the file that holds the number;
// tools/check_publish.py refuses to pass while DRAFT is true. Labels are bilingual ({ko, en}).
window.SITE = {
  DRAFT: false,
  FILING_NO: "provisional-filed",  // filing recorded; the application number is kept out of public code

  banking: {
    src: "results/reports/T3_SUBMIT_PREP.md",
    arms: {
      base: { k: [49.48, 39.69, 33.51, null], t44: 29, t04: 35 },
      ours: { k: [57.22, 46.39, 39.69, 35.05], t44: 34, t04: 25 },
      top: { k: [55.15, 45.19, 39.69, 35.05], t44: 34, t04: 26 },
    },
  },

  // pass^1, no layer (a) → + layer (b). Engine unchanged; only the declaration file differs per domain.
  transfer: [
    { key: "sop", group: "SOPBench library", note: { ko: "66과제 × 4회 · 공식 채점기", en: "66 tasks × 4 · official scorer" },
      src: "results/reports/SOPX4.md", ref: { official: 66.7, corr: 75.8, name: "GPT-5" }, rows: [
      { m: "Qwen3.8-27B", a: 56.8, b: 72.0, corr: [69.3, 86.0] },
      { m: "GPT-4o-mini", a: 44.3, b: 50.4 },
      { m: "Qwen3-8B", a: 35.2, b: 46.2 },
      { m: "Qwen3-14B", a: 33.3, b: 47.3 },
      { m: "Qwen2.5-32B", a: 24.2, b: 34.8 },
    ]},
    { key: "air", group: "τ²-bench airline", note: { ko: "50과제 × 4회", en: "50 tasks × 4" },
      src: "docs/blog/TECH_BLOG_LEADERBOARD_DRAFT.md §4.2 (LADDER_PREP.md)", rows: [
      { m: "Qwen3.8-27B", a: 82.5, b: 83.5 },
      { m: "GPT-5.2", a: 56.5, b: 71.0 },
      { m: "Qwen3-8B", a: 37.8, b: 49.5 },
      { m: "Qwen3-14B", a: 37.5, b: 47.0 },
      { m: "Qwen2.5-32B", a: 29.0, b: 51.5 },
      { m: "GPT-4o-mini", a: 27.0, b: 49.0 },
    ]},
    { key: "ret", group: "τ²-bench retail", note: { ko: "114과제 × 4회", en: "114 tasks × 4" },
      src: "docs/blog/TECH_BLOG_LEADERBOARD_DRAFT.md §4.2 (API_ARMS_BUILD.md, RETF.md)", rows: [
      { m: "Qwen3.8-27B", a: 80.4, b: 81.3 },
      { m: "Kimi K2.5", a: 75.7, b: 75.4 },
      { m: "Qwen2.5-32B", a: 53.9, b: 52.9 },
      { m: "Qwen3-14B", a: 52.0, b: 53.9 },
    ]},
  ],

  // Tasks where the full layer fired. One lever switched off at a time.
  ablation: {
    src: "results/reports/ABLATION.md · ABLATION_4OM.md · ABLATION_8B.md",
    sets: [
      { name: { ko: "Qwen3.8-27B · banking", en: "Qwen3.8-27B · banking" }, n: { ko: "발동 16과제", en: "16 fired tasks" },
        base: 40.6, full: 57.8, off: { LB3: 34.4, LB6: 48.4, LB2: 50.0, LB7: 53.1, LB4: 54.7, LB1: 56.2, LB5: 56.2 } },
      { name: { ko: "GPT-4o-mini · airline", en: "GPT-4o-mini · airline" }, n: { ko: "발동 30과제", en: "30 fired tasks" },
        base: 20.8, full: 55.0, off: { LB3: 20.0, LB1: 45.8, LB6: 46.7, LB7: 50.0, LB2: 52.5, LB5: 56.7, LB4: 58.3 } },
      { name: { ko: "Qwen3-8B · airline", en: "Qwen3-8B · airline" }, n: { ko: "발동 24과제", en: "24 fired tasks" },
        base: 36.5, full: 58.3, off: { LB3: 34.4, LB1: 58.3 } },
    ],
  },

  reasonless: {
    src: "docs/blog/TECH_BLOG_LEADERBOARD_DRAFT.md §4.3 (Reason Less, Verify More, arXiv 2607.07405, re-run under our harness)",
    rows: [
      { m: "GPT-4o-mini", none: [27.0, 10.0], gates: [46.0, 20.0], ours: [49.0, 30.0] },
      { m: "GPT-5.2", none: [56.5, 36.0], gates: [66.5, 40.0], ours: [71.0, 50.0] },
    ],
    losses: { ours: 1, gates: 5 },
  },

  heldout: { src: "README.md · docs/blog/TECH_BLOG_LEADERBOARD_DRAFT.md §7 (procedure: results/reports/HELDOUT.md)",
    model: "GPT-4o-mini", train: 30, test: 20, a: 31.2, b: 52.5, overblock: 0 },
};
