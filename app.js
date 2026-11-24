const KEY = "volley-simple-v1";

const state = {
  rotation: 0,
  us: 0,
  them: 0,
  serving: START_SERVING,
  log: []
};

let lineup = PLAYERS.slice();
let selected = null;
let phase = "serve";
const history = [];

function swap(lineup, a, b) {
  [lineup[a], lineup[b]] = [lineup[b], lineup[a]];
  render();
}

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

function playerNode(name, zone, ph, extra) {
  const spot = SPOTS[ph][zone];
  const node = el("div", "player" + (extra ? " " + extra : ""));
  node.style.left = spot[0] + "%";
  node.style.top = spot[1] + "%";
  node.appendChild(el("span", "pname", name));
  node.appendChild(el("span", "pzone", "Z" + zone));
  if (FRONT.indexOf(zone) >= 0) node.classList.add("front");
  return node;
}

function renderLineup() {
  const court = document.getElementById("lineup-court");
  const occ = occupancy(lineup, 0);
  court.innerHTML = "";
  court.appendChild(el("div", "net"));
  ZONES.forEach((zone) => {
    const i = zone - 1;
    const node = playerNode(occ[zone], zone, "serve", "tap");
    if (selected === i) node.classList.add("picked");
    node.onclick = () => pick(i);
    court.appendChild(node);
  });
}

function pick(i) {
  if (selected === null || selected === i) {
    selected = selected === i ? null : i;
    render();
    return;
  }
  const a = selected;
  selected = null;
  swap(lineup, a, i);
}

function renderRotations() {
  const grid = document.getElementById("rotation-grid");
  grid.innerHTML = "";
  for (let r = 0; r < 6; r++) {
    const occ = occupancy(lineup, r);
    const box = el("div", "minibox");
    box.appendChild(el("p", "minilab", "R" + (r + 1)));
    const court = el("div", "court mini");
    court.appendChild(el("div", "net"));
    ZONES.forEach((zone) => {
      const node = playerNode(occ[zone], zone, phase, "small");
      if (zone === 1 && phase === "serve") node.classList.add("server");
      court.appendChild(node);
    });
    box.appendChild(court);
    grid.appendChild(box);
  }
}

function renderMatch() {
  document.getElementById("score-us").textContent = state.us;
  document.getElementById("score-them").textContent = state.them;
  document.getElementById("rot-label").textContent = "R" + (state.rotation + 1);
  document.getElementById("serve-label").textContent =
    state.serving ? "We serve" : "They serve";

  const ph = state.serving ? "serve" : "receive";
  const occ = occupancy(lineup, state.rotation);
  const court = document.getElementById("match-court");
  court.innerHTML = "";
  court.appendChild(el("div", "net"));
  ZONES.forEach((zone) => {
    const node = playerNode(occ[zone], zone, ph);
    if (zone === 1 && state.serving) node.classList.add("server");
    court.appendChild(node);
  });

  const table = document.getElementById("log");
  table.innerHTML = "";
  const head = el("tr");
  ["#", "We were", "Result", "Score", "Rotation", "Rotated"].forEach((h) => {
    head.appendChild(el("th", null, h));
  });
  table.appendChild(head);
  state.log.slice().reverse().forEach((e) => {
    const row = el("tr");
    row.appendChild(el("td", null, e.n));
    row.appendChild(el("td", null, e.wasServing ? "serving" : "receiving"));
    row.appendChild(el("td", null, e.weWon ? "won" : "lost"));
    row.appendChild(el("td", null, e.us + " – " + e.them));
    row.appendChild(el("td", null, "R" + (e.rotation + 1)));
    row.appendChild(el("td", e.rotated ? "yes" : null, e.rotated ? "yes" : "no"));
    table.appendChild(row);
  });

  const won = winner(state, TARGET);
  document.getElementById("result").textContent =
    won === "us" ? "We win the set" : won === "them" ? "They win the set" : "";
}

function record(weWon) {
  if (winner(state, TARGET)) return;
  history.push(JSON.stringify({
    rotation: state.rotation,
    us: state.us,
    them: state.them,
    serving: state.serving,
    log: state.log
  }));

  const wasServing = state.serving;
  const before = state.rotation;
  rally(state, weWon);

  state.log.push({
    n: state.log.length + 1,
    weWon: weWon,
    wasServing: wasServing,
    us: state.us,
    them: state.them,
    rotation: state.rotation,
    rotated: state.rotation !== before
  });
  render();
}

function undo() {
  if (!history.length) return;
  const prev = JSON.parse(history.pop());
  state.rotation = prev.rotation;
  state.us = prev.us;
  state.them = prev.them;
  state.serving = prev.serving;
  state.log = prev.log;
  render();
}

function resetMatch() {
  state.rotation = 0;
  state.us = 0;
  state.them = 0;
  state.serving = START_SERVING;
  state.log = [];
  history.length = 0;
  render();
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ lineup: lineup, state: state }));
  } catch (e) {
    return;
  }
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    if (d.lineup && d.lineup.length === 6) lineup = d.lineup;
    if (d.state) {
      state.rotation = d.state.rotation || 0;
      state.us = d.state.us || 0;
      state.them = d.state.them || 0;
      state.serving = !!d.state.serving;
      state.log = d.state.log || [];
    }
  } catch (e) {
    return;
  }
}

function setView(name) {
  document.querySelectorAll(".view").forEach((n) => {
    n.classList.toggle("on", n.id === "view-" + name);
  });
  document.querySelectorAll(".tab").forEach((n) => {
    n.classList.toggle("on", n.dataset.view === name);
  });
}

function setPhase(name) {
  phase = name;
  document.querySelectorAll(".phasebtn").forEach((n) => {
    n.classList.toggle("on", n.dataset.phase === name);
  });
  renderRotations();
}

function applyColours() {
  const root = document.documentElement.style;
  root.setProperty("--court", COLOURS.court);
  root.setProperty("--front", COLOURS.front);
  root.setProperty("--back", COLOURS.back);
  root.setProperty("--paper", COLOURS.paper);
}

function applyLabels() {
  document.getElementById("label-us").textContent = LABELS.us;
  document.getElementById("label-them").textContent = LABELS.them;
  document.querySelectorAll(".tab").forEach((n) => {
    n.textContent = LABELS[n.dataset.view];
  });
}

function render() {
  renderLineup();
  renderRotations();
  renderMatch();
  save();
}

function init() {
  applyColours();
  applyLabels();
  load();

  document.querySelectorAll(".tab").forEach((n) => {
    n.onclick = () => setView(n.dataset.view);
  });
  document.querySelectorAll(".phasebtn").forEach((n) => {
    n.onclick = () => setPhase(n.dataset.phase);
  });
  document.getElementById("btn-us").onclick = () => record(true);
  document.getElementById("btn-them").onclick = () => record(false);
  document.getElementById("btn-undo").onclick = undo;
  document.getElementById("btn-reset").onclick = resetMatch;

  setPhase("serve");
  setView("lineup");
  render();
}

init();
