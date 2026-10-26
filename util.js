"use strict";

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function ri(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function gauss(mean, sd) {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return mean + sd * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}
function fmtMoney(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(0) + "K";
  return Math.round(n).toString();
}
function seedRandom(seed) {
  let s = seed || Date.now();
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
