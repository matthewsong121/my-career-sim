"use strict";

function createPlayer(cfg) {
  const diff = DIFFS[cfg.diff] || DIFFS.normal;
  const attrs = {};
  for (const k of ATTR_KEYS) {
    attrs[k] = clamp(Math.round(gauss(35 + diff.startBoost, 6)), 20, 70);
  }
  return {
    name: cfg.name || "創辦人",
    age: cfg.age || 25,
    attrs,
    potential: ri(diff.potMin, diff.potMax),
    morale: 70,
    energy: 100,
    reputation: 10
  };
}

function calcOverall(p) {
  let s = 0;
  for (const k of ATTR_KEYS) s += p.attrs[k];
  return Math.round(s / ATTR_KEYS.length);
}

function trainAttr(state, key, amount) {
  const p = state.player;
  p.attrs[key] = clamp(p.attrs[key] + amount, 1, 99);
}
