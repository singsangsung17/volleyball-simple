const { rally } = require("./rotation.js");

const state = { rotation: 0, us: 0, them: 0, serving: false, log: [] };
const sequence = [true, true, false, true, false, false, true];

console.log("=== Example 2: seven rallies, we receive first ===");
console.log("# | we were   | result | score | rotation | rotated");

let rotations = 0;
sequence.forEach((weWon, i) => {
  const wasServing = state.serving;
  const before = state.rotation;
  rally(state, weWon);
  const rotated = state.rotation !== before;
  if (rotated) rotations += 1;
  console.log(
    `${i + 1} | ${(wasServing ? "serving" : "receiving").padEnd(9)} | ` +
    `${(weWon ? "won" : "lost").padEnd(6)} | ${state.us}-${state.them}   | ` +
    `R${state.rotation + 1}       | ${rotated ? "yes" : "no"}`
  );
});

console.log("\nRotations triggered:", rotations, "of", sequence.length, "rallies");
console.log("Final score:", state.us, "-", state.them, "| rotation R" + (state.rotation + 1));
