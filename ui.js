"use strict";

const UI = {
  renderMenu() {
    const app = document.getElementById("app");
    app.innerHTML = `
      <div class="menu">
        <h1>創業人生模擬器</h1>
        <p>從一個想法開始，打造你的公司。</p>
        <div class="form">
          <label>名字 <input id="name" value="Alex" /></label>
          <label>難度
            <select id="diff">
              <option value="easy">輕鬆</option>
              <option value="normal" selected>普通</option>
              <option value="hard">困難</option>
            </select>
          </label>
          <button id="start">開始創業</button>
        </div>
        <div id="slots"></div>
      </div>
    `;
    document.getElementById("start").onclick = () => {
      const name = document.getElementById("name").value || "創辦人";
      const diff = document.getElementById("diff").value;
      App.startNew({ name, diff });
    };
    this.renderSlots();
  },

  renderSlots() {
    const el = document.getElementById("slots");
    if (!el) return;
    const saves = Saves.list();
    el.innerHTML = "<h3>存檔</h3>" + (saves.length ? saves.map((s, i) =>
      `<div class="slot"><span>${s.player.name} · ${s.idea.name} · ${getStatusText(s)}</span>
       <button onclick="App.load(${i})">繼續</button></div>`
    ).join("") : "<p>尚無存檔</p>");
  },

  renderHub() {
    const s = App.state;
    const p = s.player;
    const app = document.getElementById("app");
    app.innerHTML = `
      <div class="hub">
        <header>
          <h2>${p.name} · ${s.idea.name}</h2>
          <div class="stats">
            現金 $${fmtMoney(s.cash)} · 使用者 ${s.users.toLocaleString()} · 團隊 ${s.team}人<br>
            產品完成度 ${s.product}% · 聲譽 ${s.reputation} · 士氣 ${Math.round(p.morale)}
          </div>
          <div class="time">第 ${s.year} 年 ${s.month} 月 · 第 ${s.week} 週</div>
        </header>
        <div class="attrs">
          ${ATTR_KEYS.map(k => `<div>${ATTR_LABELS[k]}: ${Math.round(p.attrs[k])}</div>`).join("")}
        </div>
        <div class="actions">
          ${ACTIONS.map(a => `<button ${s.cash < a.cost ? "disabled" : ""} onclick="App.doAction('${a.id}')">${a.name}<br><small>${a.desc}${a.cost ? " ($" + fmtMoney(a.cost) + ")" : ""}</small></button>`).join("")}
        </div>
        <div class="log">
          <h3>最近事件</h3>
          ${s.log.slice(0, 8).map(l => `<div>${l.year}年${l.month}月：${l.text}</div>`).join("") || "<div>尚無事件</div>"}
        </div>
        <div class="footer">
          <button onclick="App.saveAndMenu()">存檔並返回</button>
        </div>
      </div>
    `;
    if (s.retired) {
      setTimeout(() => this.renderRetired(), 100);
    }
  },

  renderRetired() {
    const s = App.state;
    const app = document.getElementById("app");
    app.innerHTML = `
      <div class="menu">
        <h1>${s.success ? "成功！" : "結束"}</h1>
        <p>${s.success ? "你的公司成功了。" : "這次創業沒有成功。"}</p>
        <p>最終使用者：${s.users.toLocaleString()} · 現金：$${fmtMoney(s.cash)}</p>
        <button onclick="App.menu()">返回主選單</button>
      </div>
    `;
  }
};
