const ZONES = [1, 2, 3, 4, 5, 6];
const FRONT = [4, 3, 2];
const BACK = [5, 6, 1];

function occupancy(lineup, r) {
  const out = {};
  ZONES.forEach((zone, i) => {
    out[zone] = lineup[(i + r) % 6];
  });
  return out;
}

function rally(state, weWon) {
  const wasServing = state.serving;

  if (weWon) {
    state.us += 1;
    if (!wasServing) {
      state.rotation = (state.rotation + 1) % 6;
      state.serving = true;
    }
  } else {
    state.them += 1;
    state.serving = false;
  }
}

function winner(state, target) {
  if (state.us >= target && state.us - state.them >= 2) return "us";
  if (state.them >= target && state.them - state.us >= 2) return "them";
  return null;
}

if (typeof module !== "undefined") {
  module.exports = { ZONES, FRONT, BACK, occupancy, rally, winner };
}
