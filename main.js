"use strict";

const Saves = {
  key: "career-sim-v2",
  list() {
    try { return JSON.parse(localStorage.getItem(this.key) || "[]"); }
    catch { return []; }
  },
  save(slot, state) {
    const all = this.list();
    const copy = JSON.parse(JSON.stringify(state));
    delete copy.rng;
    all[slot] = copy;
    localStorage.setItem(this.key, JSON.stringify(all.slice(0, 8)));
  },
  load(slot) {
    const all = this.list();
    if (!all[slot]) return null;
    const s = JSON.parse(JSON.stringify(all[slot]));
    s.rng = mulberry32(s.seed);
    return s;
  }
};

const App = {
  state: null,
  slot: 0,

  startNew(cfg) {
    this.state = newCareer(cfg);
    this.slot = Saves.list().length;
    Saves.save(this.slot, this.state);
    UI.renderHub();
  },

  load(slot) {
    const s = Saves.load(slot);
    if (s) {
      this.state = s;
      this.slot = slot;
      UI.renderHub();
    }
  },

  doAction(id) {
    if (!this.state || this.state.retired) return;
    doAction(this.state, id);
    Saves.save(this.slot, this.state);
    UI.renderHub();
  },

  saveAndMenu() {
    if (this.state) Saves.save(this.slot, this.state);
    this.menu();
  },

  exportSave() {
    if (!this.state) return;
    const data = JSON.stringify(this.state, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `career-${this.state.player.name}-${this.state.seed}.json`;
    a.click();
  },

  menu() {
    this.state = null;
    UI.renderMenu();
  }
};

document.addEventListener("DOMContentLoaded", () => UI.renderMenu());
