"use strict";

// career.js - high level flow (kept simple for now)
function getStatusText(state) {
  if (state.retired && state.success) return "成功退出";
  if (state.retired) return "已結束";
  return "進行中";
}
