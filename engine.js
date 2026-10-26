"use strict";

function newCareer(cfg) {
  const idea = pick(STARTING_IDEAS);
  return {
    player: createPlayer(cfg),
    idea: idea,
    cash: 50000,
    users: 0,
    team: 1,
    product: 10,
    month: 1,
    year: 1,
    week: 1,
    morale: 70,
    reputation: 10,
    pendingFunding: false,
    retired: false,
    log: [],
    seed: Date.now()
  };
}

function advanceWeek(state) {
  if (state.retired) return;
  state.week++;
  if (state.week > 4) {
    state.week = 1;
    state.month++;
    if (state.month > 12) {
      state.month = 1;
      state.year++;
      state.player.age++;
    }
  }

  // burn rate
  const burn = 3000 + state.team * 4000;
  state.cash -= burn;

  // natural growth
  if (state.product > 30) {
    state.users += Math.floor(state.product * 0.5 + state.player.attrs.mkt * 0.3);
  }

  // random event
  if (Math.random() < 0.35) {
    const ev = pick(EVENTS);
    ev.effect(state);
    state.log.unshift({ month: state.month, year: state.year, text: ev.title + "：" + ev.desc });
  }

  // check failure
  if (state.cash < -20000 || state.player.morale < 10) {
    state.retired = true;
    state.log.unshift({ month: state.month, year: state.year, text: "公司倒閉了。" });
  }

  // success condition
  if (state.users > 100000 && state.cash > 500000) {
    state.retired = true;
    state.success = true;
    state.log.unshift({ month: state.month, year: state.year, text: "公司成功！可以選擇退出或繼續擴大。" });
  }

  if (state.log.length > 30) state.log.pop();
}

function doAction(state, actionId) {
  const act = ACTIONS.find(a => a.id === actionId);
  if (!act || state.cash < act.cost) return false;

  state.cash -= act.cost;
  const p = state.player;

  switch (actionId) {
    case "build":
      state.product = clamp(state.product + 8 + p.attrs.tech * 0.15, 0, 100);
      trainAttr(state, "tech", 0.4);
      p.morale -= 3;
      break;
    case "market":
      state.users += Math.floor(200 + p.attrs.mkt * 8);
      trainAttr(state, "mkt", 0.3);
      break;
    case "pitch":
      if (state.product > 40 && Math.random() < 0.4 + p.attrs.biz * 0.005) {
        const raised = ri(100000, 500000);
        state.cash += raised;
        state.reputation += 20;
        state.log.unshift({ month: state.month, year: state.year, text: `成功融資 $${fmtMoney(raised)}！` });
      } else {
        state.log.unshift({ month: state.month, year: state.year, text: "這次融資沒有成功。" });
      }
      trainAttr(state, "biz", 0.3);
      break;
    case "hire":
      if (state.cash > 15000) {
        state.team += 1;
        p.morale += 5;
        trainAttr(state, "lead", 0.3);
      }
      break;
    case "rest":
      p.morale = clamp(p.morale + 15, 0, 100);
      trainAttr(state, "resilience", 0.2);
      break;
  }

  p.morale = clamp(p.morale, 0, 100);
  advanceWeek(state);
  return true;
}
