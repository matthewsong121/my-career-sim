"use strict";

function createPlayer(cfg) {
  const diff = DIFFS[cfg.diff] || DIFFS.normal;
  const attrs = {};
  for (const k of ATTR_KEYS) {
    attrs[k] = clamp(Math.round(gauss(32 + diff.startBoost, 7)), 15, 75);
  }
  return {
    name: cfg.name || "創辦人",
    age: cfg.age || 26,
    attrs,
    potential: ri(diff.potMin, diff.potMax),
    morale: 75,
    reputation: 5
  };
}

function calcOverall(p) {
  let s = 0;
  for (const k of ATTR_KEYS) s += p.attrs[k];
  return Math.round(s / ATTR_KEYS.length);
}

function trainAttr(state, key, amount) {
  const p = state.player;
  const potBrake = p.potential > calcOverall(p) ? 1 : 0.3;
  p.attrs[key] = clamp(p.attrs[key] + amount * potBrake, 1, 99);
}
