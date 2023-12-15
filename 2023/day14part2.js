input = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....
`;
let map = {};
let rowCnt = 0;
let colCnt = 0;
input
  .split("\n")
  .filter((v) => v)
  .forEach((r, i) => {
    rowCnt++;
    colCnt = r.length;
    for (let j = 0; j < r.length; ++j) {
      const c = r.charAt(j);
      if (["O", "#"].includes(c)) {
        map[`${i},${j}`] = c;
      }
    }
  });

let round = 0;
let states = {};
do {
  round++;
  // north
  for (let i = 1; i < rowCnt; ++i) {
    for (let j = 0; j < colCnt; ++j) {
      if (map[`${i},${j}`] !== "O") {
        continue;
      }
      let k = i - 1;
      for (; k >= 0; --k) {
        if (`${k},${j}` in map) {
          break;
        }
      }
      if (k + 1 !== i) {
        delete map[`${i},${j}`];
        map[`${k + 1},${j}`] = "O";
      }
    }
  }
  // west
  for (let j = 1; j < colCnt; ++j) {
    for (let i = 0; i < rowCnt; ++i) {
      if (map[`${i},${j}`] !== "O") {
        continue;
      }
      let k = j - 1;
      for (; k >= 0; --k) {
        if (`${i},${k}` in map) {
          break;
        }
      }
      if (k + 1 !== j) {
        delete map[`${i},${j}`];
        map[`${i},${k + 1}`] = "O";
      }
    }
  }
  // south
  for (let i = rowCnt - 2; i >= 0; --i) {
    for (let j = 0; j < colCnt; ++j) {
      if (map[`${i},${j}`] !== "O") {
        continue;
      }
      let k = i + 1;
      for (; k <= rowCnt - 1; ++k) {
        if (`${k},${j}` in map) {
          break;
        }
      }
      if (k - 1 !== i) {
        delete map[`${i},${j}`];
        map[`${k - 1},${j}`] = "O";
      }
    }
  }
  // east
  for (let j = colCnt - 2; j >= 0; --j) {
    for (let i = 0; i < rowCnt; ++i) {
      if (map[`${i},${j}`] !== "O") {
        continue;
      }
      let k = j + 1;
      for (; k <= colCnt - 1; ++k) {
        if (`${i},${k}` in map) {
          break;
        }
      }
      if (k - 1 !== j) {
        delete map[`${i},${j}`];
        map[`${i},${k - 1}`] = "O";
      }
    }
  }
  const state = Object.entries(map)
    .filter(([_, v]) => v === "O")
    .map(([k, _]) => k)
    .join(";");
  if (state in states) {
    round = states[state];
    break;
  }
  states[state] = round;
} while (true);

let seq =
  ((1000000000 - round) % (Object.keys(states).length - round + 1)) + round;
let state = null;
for (const [k, v] of Object.entries(states)) {
  if (v === seq) {
    state = k;
    break;
  }
}
let res = 0;
state.split(";").forEach((k) => {
  res += rowCnt - Number(k.split(",")[0]);
});
console.log(res);
