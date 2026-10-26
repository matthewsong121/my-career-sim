"use strict";

const ATTR_KEYS = ["tech", "biz", "mkt", "lead", "resilience"];
const ATTR_LABELS = {
  tech: "技術",
  biz: "商業",
  mkt: "行銷",
  lead: "領導",
  resilience: "抗壓"
};

const DIFFS = {
  easy: { name: "輕鬆", startBoost: 8, potMin: 70, potMax: 90 },
  normal: { name: "普通", startBoost: 0, potMin: 60, potMax: 85 },
  hard: { name: "困難", startBoost: -5, potMin: 50, potMax: 80 }
};

const STARTING_IDEAS = [
  { name: "AI 工具", desc: "幫中小企業自動化流程" },
  { name: "社群 App", desc: "垂直興趣社群平台" },
  { name: "SaaS 訂閱", desc: "B2B 管理軟體" },
  { name: "電商平台", desc: "利基市場電商" },
  { name: "內容平台", desc: "創作者工具與變現" }
];

const EVENTS = [
  { id: "viral", title: "產品突然爆紅", desc: "有人在社群分享，流量暴增！", effect: s => { s.users = Math.floor(s.users * 2.5 + 500); s.cash += 20000; } },
  { id: "investor", title: "投資人主動接觸", desc: "有天使投資人想聊一聊。", effect: s => { s.reputation += 10; } },
  { id: "bug", title: "嚴重 Bug", desc: "使用者回報關鍵功能壞掉。", effect: s => { s.morale -= 15; s.users = Math.floor(s.users * 0.8); } },
  { id: "hire", title: "優秀工程師想加入", desc: "有人主動投履歷。", effect: s => { s.team += 1; s.morale += 5; } },
  { id: "burnout", title: "團隊過勞", desc: "大家連續加班太久了。", effect: s => { s.morale -= 20; s.player.resilience -= 2; } },
  { id: "competitor", title: "競爭對手出現", desc: "有一家資金更充足的公司做類似產品。", effect: s => { s.users = Math.floor(s.users * 0.85); s.reputation -= 5; } },
  { id: "press", title: "媒體報導", desc: "科技媒體寫了一篇正面文章。", effect: s => { s.reputation += 15; s.users += 300; } },
  { id: "funding", title: "融資機會", desc: "有機會進行種子輪。", effect: s => { s.pendingFunding = true; } }
];

const ACTIONS = [
  { id: "build", name: "開發產品", desc: "推進功能開發", cost: 0, time: 1 },
  { id: "market", name: "行銷推廣", desc: "增加使用者", cost: 5000, time: 1 },
  { id: "pitch", name: "見投資人", desc: "嘗試融資", cost: 0, time: 1 },
  { id: "hire", name: "招募人才", desc: "擴大團隊", cost: 8000, time: 1 },
  { id: "rest", name: "休息調整", desc: "恢復士氣與抗壓", cost: 0, time: 1 }
];
