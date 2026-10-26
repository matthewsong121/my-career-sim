"use strict";

function newCareer(cfg) {
  const idea = pick(IDEAS);
  const rng = mulberry32(cfg.seed || Date.now());
  return {
    player: createPlayer(cfg),
    idea,
    cash: 80000,
    users: 0,
    paying: 0,
    team: 1,
    teamRoles: ["創辦人"],
    product: 8,
    stage: "idea",
    month: 1,
    year: 1,
    week: 1,
    morale: 75,
    reputation: 5,
    burnRate: 4000,
    equity: 100,
    fundingHistory: [],
    pendingFunding: null,
    pendingHire: false,
    pendingPitch: false,
    productPressure: 0,
    retired: false,
    success: false,
    log: [],
    seed: cfg.seed || Date.now(),
    rng
  };
}

function getStage(state) {
  for (let i = STAGES.length - 1; i >= 0; i--) {
    const st = STAGES[i];
    if (state.product >= st.reqProduct && state.users >= st.reqUsers) return st;
  }
  return STAGES[0];
}

function advanceWeek(state) {
  if (state.retired) return;
  state.week++;
  if (state.week > 4) {
    state.week = 1;
    state.month++;
    monthlyTick(state);
    if (state.month > 12) {
      state.month = 1;
      state.year++;
      state.player.age++;
    }
  }

  // weekly burn
  state.cash -= Math.round(state.burnRate / 4);

  // growth
  const growthBase = state.product * 0.4 + state.player.attrs.mkt * 0.5 + state.team * 2;
  const stageMult = { idea: 0.3, mvp: 0.8, growth: 1.4, scale: 2.2, mature: 1.6 }[state.stage] || 1;
  state.users += Math.floor(growthBase * stageMult * state.idea.baseUsers);
  if (state.users > 50) {
    state.paying = Math.floor(state.users * (0.02 + state.player.attrs.sales * 0.0008));
    state.cash += state.paying * ri(8, 25);
  }

  // random event
  if (state.rng() < 0.42) {
    const ev = pick(EVENTS);
    ev.effect(state);
    state.log.unshift({ y: state.year, m: state.month, w: state.week, text: `${ev.title}：${ev.desc}` });
  }

  updateStage(state);
  checkEnd(state);
  if (state.log.length > 40) state.log.length = 40;
}

function monthlyTick(state) {
  // morale drift
  state.morale = clamp(state.morale - 2 + state.team * 0.3, 0, 100);
  state.player.morale = state.morale;

  // product pressure
  if (state.productPressure > 0) {
    state.product = clamp(state.product - 1, 0, 100);
    state.productPressure -= 5;
  }
}

function updateStage(state) {
  const newStage = getStage(state);
  if (newStage.id !== state.stage) {
    state.stage = newStage.id;
    state.log.unshift({ y: state.year, m: state.month, w: state.week, text: `公司進入「${newStage.name}」階段` });
  }
}

function checkEnd(state) {
  if (state.cash < -30000 || state.morale < 8) {
    state.retired = true;
    state.log.unshift({ y: state.year, m: state.month, w: state.week, text: "公司倒閉。" });
  }
  if (state.users > 300000 && state.cash > 2000000 && state.stage === "mature") {
    state.retired = true;
    state.success = true;
    state.log.unshift({ y: state.year, m: state.month, w: state.week, text: "公司達到成功規模，可以選擇退出。" });
  }
  if (state.player.age >= 45 && !state.success) {
    state.retired = true;
    state.log.unshift({ y: state.year, m: state.month, w: state.week, text: "你決定結束這段創業旅程。" });
  }
}

function doAction(state, actionId) {
  const act = ACTIONS.find(a => a.id === actionId);
  if (!act || (act.cost && state.cash < act.cost)) return false;

  if (act.cost) state.cash -= act.cost;
  const p = state.player;

  switch (actionId) {
    case "build":
      state.product = clamp(state.product + 6 + p.attrs.tech * 0.12 + p.attrs.product * 0.08, 0, 100);
      trainAttr(state, "tech", 0.35);
      trainAttr(state, "product", 0.2);
      state.morale -= 4;
      break;
    case "market":
      state.users += Math.floor(300 + p.attrs.mkt * 12 + state.team * 20);
      trainAttr(state, "mkt", 0.3);
      break;
    case "sales":
      state.paying += Math.floor(5 + p.attrs.sales * 0.4);
      state.cash += state.paying * 15;
      trainAttr(state, "sales", 0.3);
      break;
    case "pitch":
      tryFunding(state);
      trainAttr(state, "biz", 0.25);
      break;
    case "hire":
      if (state.team < 15) {
        state.team += 1;
        state.teamRoles.push(pick(TEAM_ROLES));
        state.burnRate += 3500;
        state.morale += 4;
        trainAttr(state, "lead", 0.3);
      }
      break;
    case "ops":
      state.burnRate = Math.max(2000, state.burnRate - 800);
      trainAttr(state, "product", 0.2);
      trainAttr(state, "biz", 0.15);
      break;
    case "rest":
      state.morale = clamp(state.morale + 18, 0, 100);
      trainAttr(state, "resilience", 0.25);
      break;
  }

  state.morale = clamp(state.morale, 0, 100);
  p.morale = state.morale;
  advanceWeek(state);
  return true;
}

function tryFunding(state) {
  const available = FUNDING_ROUNDS.find(r => 
    state.product >= r.minProduct && 
    !state.fundingHistory.some(h => h.round === r.id)
  );
  if (!available) {
    state.log.unshift({ y: state.year, m: state.month, w: state.week, text: "目前沒有合適的融資機會。" });
    return;
  }
  const successChance = 0.25 + state.player.attrs.biz * 0.006 + state.reputation * 0.004 + (state.stage === "growth" || state.stage === "scale" ? 0.15 : 0);
  if (state.rng() < successChance) {
    const amount = ri(available.amount[0], available.amount[1]);
    const equity = ri(available.equity[0], available.equity[1]);
    state.cash += amount;
    state.equity = Math.max(10, state.equity - equity);
    state.fundingHistory.push({ round: available.id, amount, equity, year: state.year, month: state.month });
    state.reputation += 15;
    state.log.unshift({ y: state.year, m: state.month, w: state.week, text: `成功完成 ${available.name}！融資 $${fmtMoney(amount)}，稀釋 ${equity}% 股權。` });
  } else {
    state.log.unshift({ y: state.year, m: state.month, w: state.week, text: `${available.name} 融資沒有成功。` });
  }
}
