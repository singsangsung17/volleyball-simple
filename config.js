const PLAYERS = ["An", "Yi", "Yang", "Zhen", "Song", "Miao"];

const START_SERVING = false;

const TARGET = 25;

const SPOTS = {
  serve: {
    4: [20, 26], 3: [50, 26], 2: [80, 26],
    5: [20, 72], 6: [50, 72], 1: [84, 90]
  },
  receive: {
    4: [18, 45], 3: [50, 38], 2: [82, 45],
    5: [22, 80], 6: [50, 72], 1: [78, 80]
  }
};

const COLOURS = {
  court: "#2E8B7A",
  front: "#E8833A",
  back: "#1A2238",
  paper: "#F7F5F0"
};

const LABELS = {
  us: "Us",
  them: "Them",
  lineup: "Lineup",
  rotations: "Rotations",
  match: "Match"
};
