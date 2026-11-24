const { ZONES, occupancy } = require("./rotation.js");

const lineup = ["An", "Yi", "Yang", "Zhen", "Song", "Miao"];
const pad = (s) => String(s).padEnd(7);

console.log("=== Example 1: all six rotations ===");
console.log("r | view | front 4-3-2        | back 5-6-1         | serving");

const servers = [];
for (let r = 0; r < 6; r++) {
  const o = occupancy(lineup, r);
  servers.push(o[1]);
  console.log(
    `${r} | R${r + 1}   | ${pad(o[4])}${pad(o[3])}${pad(o[2])}| ${pad(o[5])}${pad(o[6])}${pad(o[1])}| ${o[1]}`
  );
}

const unique = new Set(servers).size === 6;
console.log("\nEach player serves exactly once per cycle:", unique ? "PASS" : "FAIL");
