"use strict";

function getStatusText(state) {
  if (state.retired && state.success) return "成功退出";
  if (state.retired) return "已結束";
  return STAGES.find(s => s.id === state.stage)?.name || "進行中";
}

function getValuation(state) {
  return Math.floor(state.users * 15 + state.paying * 800 + state.product * 5000 + state.reputation * 2000);
}
