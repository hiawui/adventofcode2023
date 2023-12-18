input = `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....
`;

let actMap = {
  ".": {
    "0,1": [[0, 1]], // →
    "0,-1": [[0, -1]], // ←
    "1,0": [[1, 0]], // ↓
    "-1,0": [[-1, 0]], // ↑
  },
  "|": {
    "0,1": [
      [1, 0],
      [-1, 0],
    ],
    "0,-1": [
      [1, 0],
      [-1, 0],
    ],
    "1,0": [[1, 0]],
    "-1,0": [[-1, 0]],
  },
  "-": {
    "0,1": [[0, 1]],
    "0,-1": [[0, -1]],
    "1,0": [
      [0, 1],
      [0, -1],
    ],
    "-1,0": [
      [0, 1],
      [0, -1],
    ],
  },
  "\\": {
    "0,1": [[1, 0]],
    "0,-1": [[-1, 0]],
    "1,0": [[0, 1]],
    "-1,0": [[0, -1]],
  },
  "/": {
    "0,1": [[-1, 0]],
    "0,-1": [[1, 0]],
    "1,0": [[0, -1]],
    "-1,0": [[0, 1]],
  },
};

let maxI = null;
let maxJ = null;
let map = {};
input
  .split("\n")
  .filter((v) => v)
  .forEach((r, i) => {
    maxI = Number(i);
    maxJ = r.length - 1;
    for (let j = 0; j < r.length; ++j) {
      map[`${i},${j}`] = {
        symbol: r.charAt(j),
        beams: {},
        energized: false,
      };
    }
  });

let route = (curr, dirIn) => {
  const currKey = curr.join(",");
  if (!(currKey in map)) {
    return;
  }
  const dirInKey = dirIn.join(",");
  const tile = map[currKey];
  if (dirInKey in tile.beams) {
    return;
  }
  tile.energized = true;
  tile.beams[dirInKey] = 1;
  const acts = actMap[tile.symbol][dirInKey];
  for (const act of acts) {
    const next = [curr[0] + act[0], curr[1] + act[1]];
    route(next, act);
  }
};
route([0, 0], [0, 1]);
let res = Object.values(map).reduce(
  (r, tile) => (tile.energized ? r + 1 : r),
  0
);
console.log(res);
