"use strict";

const ATTR_KEYS = ["tech", "product", "biz", "mkt", "sales", "lead", "resilience"];
const ATTR_LABELS = {
  tech: "技術", product: "產品", biz: "商業", mkt: "行銷",
  sales: "銷售", lead: "領導", resilience: "抗壓"
};

const DIFFS = {
  easy: { name: "輕鬆", startBoost: 10, potMin: 75, potMax: 95 },
  normal: { name: "普通", startBoost: 0, potMin: 65, potMax: 90 },
  hard: { name: "困難", startBoost: -8, potMin: 55, potMax: 85 },
  nightmare: { name: "地獄", startBoost: -15, potMin: 45, potMax: 80 }
};

const IDEAS = [
  { id: "ai", name: "AI 自動化工具", category: "SaaS", baseUsers: 1.2 },
  { id: "social", name: "垂直社群平台", category: "Consumer", baseUsers: 1.8 },
  { id: "fintech", name: "中小企業金融服務", category: "Fintech", baseUsers: 0.9 },
  { id: "ecom", name: "利基電商", category: "E-commerce", baseUsers: 1.4 },
  { id: "devtool", name: "開發者工具", category: "DevTools", baseUsers: 1.1 },
  { id: "health", name: "數位健康平台", category: "Health", baseUsers: 1.0 }
];

const STAGES = [
  { id: "idea", name: "想法階段", reqProduct: 0, reqUsers: 0 },
  { id: "mvp", name: "MVP", reqProduct: 30, reqUsers: 100 },
  { id: "growth", name: "成長期", reqProduct: 55, reqUsers: 5000 },
  { id: "scale", name: "擴張期", reqProduct: 75, reqUsers: 50000 },
  { id: "mature", name: "成熟期", reqProduct: 90, reqUsers: 200000 }
];

const FUNDING_ROUNDS = [
  { id: "angel", name: "天使輪", minProduct: 20, amount: [80000, 300000], equity: [8, 15] },
  { id: "seed", name: "種子輪", minProduct: 40, amount: [300000, 1500000], equity: [12, 20] },
  { id: "a", name: "A 輪", minProduct: 60, amount: [2000000, 8000000], equity: [15, 25] },
  { id: "b", name: "B 輪", minProduct: 75, amount: [8000000, 30000000], equity: [10, 20] }
];

const TEAM_ROLES = ["工程師", "產品", "行銷", "銷售", "營運"];

const EVENTS = [
  { id: "viral", title: "產品爆紅", desc: "有網紅推薦，流量暴增", effect: s => { s.users = Math.floor(s.users * 3 + 1000); s.reputation += 15; } },
  { id: "bug", title: "嚴重 Bug", desc: "核心功能出錯，使用者流失", effect: s => { s.users = Math.floor(s.users * 0.7); s.morale -= 12; s.reputation -= 8; } },
  { id: "press", title: "正面媒體報導", desc: "科技媒體專訪", effect: s => { s.reputation += 20; s.users += Math.floor(s.users * 0.3 + 500); } },
  { id: "competitor", title: "強勁競爭對手", desc: "有大公司推出類似產品", effect: s => { s.users = Math.floor(s.users * 0.75); s.reputation -= 10; } },
  { id: "keyhire", title: "關鍵人才想加入", desc: "業界資深人士主動聯繫", effect: s => { s.pendingHire = true; s.reputation += 5; } },
  { id: "burnout", title: "團隊過勞", desc: "連續加班太久", effect: s => { s.morale -= 25; s.player.attrs.resilience -= 3; } },
  { id: "churn", title: "使用者流失", desc: "留存率突然下降", effect: s => { s.users = Math.floor(s.users * 0.85); } },
  { id: "partnership", title: "合作機會", desc: "有平台想合作導流", effect: s => { s.users += Math.floor(2000 + s.player.attrs.biz * 50); s.reputation += 8; } },
  { id: "investor_intro", title: "投資人引薦", desc: "朋友介紹了投資人", effect: s => { s.pendingPitch = true; s.reputation += 10; } },
  { id: "feature_request", title: "大量功能需求", desc: "使用者強烈要求新功能", effect: s => { s.productPressure = (s.productPressure || 0) + 15; } }
];

const ACTIONS = [
  { id: "build", name: "開發產品", desc: "推進功能與品質", focus: "tech" },
  { id: "market", name: "行銷推廣", desc: "獲取新使用者", cost: 8000, focus: "mkt" },
  { id: "sales", name: "銷售拓展", desc: "增加付費客戶", cost: 5000, focus: "sales" },
  { id: "pitch", name: "見投資人", desc: "嘗試融資", focus: "biz" },
  { id: "hire", name: "招募人才", desc: "擴大團隊", cost: 12000, focus: "lead" },
  { id: "ops", name: "優化營運", desc: "降低燒錢率", focus: "product" },
  { id: "rest", name: "休息調整", desc: "恢復士氣", focus: "resilience" }
];
