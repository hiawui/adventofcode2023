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
      };
    }
  });

let route = (curr, dirIn, beams) => {
  const currKey = curr.join(",");
  if (!(currKey in map)) {
    return;
  }
  if (!(currKey in beams)) {
    beams[currKey] = {
      dirIn: {},
      energized: false,
    };
  }
  const dirInKey = dirIn.join(",");
  const beamRecord = beams[currKey];
  if (dirInKey in beamRecord.dirIn) {
    return;
  }
  beamRecord.energized = true;
  beamRecord.dirIn[dirInKey] = 1;
  const acts = actMap[map[currKey].symbol][dirInKey];
  for (const act of acts) {
    const next = [curr[0] + act[0], curr[1] + act[1]];
    route(next, act, beams);
  }
};
let max = 0;
let entry = null;
for (let i = 0; i <= maxI; ++i) {
  let j = 0;
  do {
    const start = [i, j];
    let inDir = [];
    if (i === 0) {
      inDir.push([1, 0]);
    }
    if (i === maxI) {
      inDir.push([-1, 0]);
    }
    if (j === 0) {
      inDir.push([0, 1]);
    }
    if (j === maxJ) {
      inDir.push([0, -1]);
    }
    for (const dir of inDir) {
      const beams = {};
      route(start, dir, beams);
      const res = Object.values(beams).reduce(
        (r, record) => (record.energized ? r + 1 : r),
        0
      );
      if (res > max) {
        max = res;
        entry = [start, dir];
      }
    }

    if ([0, maxI].includes(i)) {
      j++;
    } else {
      j += maxJ;
    }
  } while (j <= maxJ);
}
console.log(`${max}, ${JSON.stringify(entry)}`);
