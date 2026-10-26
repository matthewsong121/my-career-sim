"use strict";

const UI = {
  renderMenu() {
    const app = document.getElementById("app");
    app.innerHTML = `
      <div class="menu">
        <h1>創業人生 · 大型模擬器</h1>
        <p>從想法到規模化，經營你的公司。</p>
        <div class="form">
          <label>名字 <input id="name" value="Alex" /></label>
          <label>難度
            <select id="diff">
              <option value="easy">輕鬆</option>
              <option value="normal" selected>普通</option>
              <option value="hard">困難</option>
              <option value="nightmare">地獄</option>
            </select>
          </label>
          <label>種子碼（選填，相同種子結果相同）<input id="seed" placeholder="留空則隨機" /></label>
          <button id="start">開始創業</button>
        </div>
        <div id="slots"></div>
      </div>
    `;
    document.getElementById("start").onclick = () => {
      const name = document.getElementById("name").value || "創辦人";
      const diff = document.getElementById("diff").value;
      const seedInput = document.getElementById("seed").value;
      const seed = seedInput ? parseInt(seedInput) || seedInput.split('').reduce((a,c)=>a+c.charCodeAt(0),0) : Date.now();
      App.startNew({ name, diff, seed });
    };
    this.renderSlots();
  },

  renderSlots() {
    const el = document.getElementById("slots");
    if (!el) return;
    const saves = Saves.list();
    el.innerHTML = "<h3>存檔</h3>" + (saves.length ? saves.map((s, i) =>
      `<div class="slot">
        <span>${s.player.name} · ${s.idea.name} · ${getStatusText(s)} · 第${s.year}年</span>
        <button onclick="App.load(${i})">繼續</button>
      </div>`
    ).join("") : "<p>尚無存檔</p>");
  },

  renderHub() {
    const s = App.state;
    const p = s.player;
    const stage = getStage(s);
    const val = getValuation(s);
    const app = document.getElementById("app");
    app.innerHTML = `
      <div class="hub">
        <header>
          <h2>${p.name} · ${s.idea.name}</h2>
          <div class="badge">${stage.name} · ${s.idea.category}</div>
          <div class="stats">
            現金 $${fmtMoney(s.cash)} · 使用者 ${s.users.toLocaleString()} · 付費 ${s.paying.toLocaleString()}<br>
            團隊 ${s.team}人 · 產品 ${s.product}% · 聲譽 ${s.reputation} · 士氣 ${Math.round(s.morale)}<br>
            燒錢率 $${fmtMoney(s.burnRate)}/月 · 股權 ${s.equity}% · 估值約 $${fmtMoney(val)}
          </div>
          <div class="time">第 ${s.year} 年 ${s.month} 月 · 第 ${s.week} 週 · 種子 ${s.seed}</div>
        </header>
        <div class="attrs">
          ${ATTR_KEYS.map(k => `<div class="attr"><span>${ATTR_LABELS[k]}</span><div class="bar"><div style="width:${p.attrs[k]}%"></div></div><span>${Math.round(p.attrs[k])}</span></div>`).join("")}
        </div>
        <div class="actions">
          ${ACTIONS.map(a => `<button ${a.cost && s.cash < a.cost ? "disabled" : ""} onclick="App.doAction('${a.id}')">
            ${a.name}<br><small>${a.desc}${a.cost ? " ($" + fmtMoney(a.cost) + ")" : ""}</small>
          </button>`).join("")}
        </div>
        <div class="log">
          <h3>最近事件</h3>
          ${s.log.slice(0, 10).map(l => `<div>${l.y}年${l.m}月：${l.text}</div>`).join("") || "<div>尚無事件</div>"}
        </div>
        <div class="footer">
          <button onclick="App.saveAndMenu()">存檔並返回</button>
          <button onclick="App.exportSave()">匯出存檔</button>
        </div>
      </div>
    `;
    if (s.retired) setTimeout(() => this.renderRetired(), 50);
  },

  renderRetired() {
    const s = App.state;
    const app = document.getElementById("app");
    app.innerHTML = `
      <div class="menu">
        <h1>${s.success ? "成功退出！" : "旅程結束"}</h1>
        <p>${s.success ? "你把公司做到了規模。" : "這次創業沒有成功。"}</p>
        <p>最終使用者：${s.users.toLocaleString()}<br>
           現金：$${fmtMoney(s.cash)}<br>
           持股：${s.equity}%<br>
           存活：${s.year} 年 ${s.month} 個月</p>
        <button onclick="App.menu()">返回主選單</button>
      </div>
    `;
  }
};
