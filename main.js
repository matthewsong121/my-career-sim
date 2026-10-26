"use strict";

const Saves = {
  key: "career-sim-saves",
  list() {
    try { return JSON.parse(localStorage.getItem(this.key) || "[]"); }
    catch { return []; }
  },
  save(slot, state) {
    const all = this.list();
    all[slot] = JSON.parse(JSON.stringify(state));
    localStorage.setItem(this.key, JSON.stringify(all.slice(0, 5)));
  },
  load(slot) {
    const all = this.list();
    return all[slot] ? JSON.parse(JSON.stringify(all[slot])) : null;
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

  menu() {
    this.state = null;
    UI.renderMenu();
  }
};

document.addEventListener("DOMContentLoaded", () => UI.renderMenu());
