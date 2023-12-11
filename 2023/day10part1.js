input = `7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ
`;

let map = {};
let start = null;
input
  .split("\n")
  .filter((r) => r)
  .forEach((r, i) => {
    for (let j = 0; j < r.length; ++j) {
      const tile = {};
      const c = r.charAt(j);
      tile.pipe = c;
      if (c === "|") {
        tile.dir = ["u", "d"];
      } else if (c === "-") {
        tile.dir = ["r", "l"];
      } else if (c === "L") {
        tile.dir = ["u", "r"];
      } else if (c === "J") {
        tile.dir = ["l", "u"];
      } else if (c === "7") {
        tile.dir = ["d", "l"];
      } else if (c === "F") {
        tile.dir = ["r", "d"];
      } else if (c === "S") {
        tile.start = true;
        start = { i, j };
      }
      map[`${i},${j}`] = tile;
    }
  });

let checkNext = (pos, dir) => {
  let oppo = null;
  let { i, j } = pos;
  if (dir === "u") {
    i = pos.i - 1;
    oppo = "d";
  } else if (dir === "l") {
    j = pos.j - 1;
    oppo = "r";
  } else if (dir === "d") {
    i = pos.i + 1;
    oppo = "u";
  } else if (dir === "r") {
    j = pos.j + 1;
    oppo = "l";
  }
  const next = map[`${i},${j}`];
  if (i === start.i && j === start.j) {
    return [{ i, j }];
  }
  if (!next || !next.dir || !next.dir.includes(oppo)) {
    return null;
  }
  return [{ i, j }, next.dir.filter((d) => d != oppo)[0]];
};
let found = null;
for (const st of ["u", "l", "d", "r"]) {
  let pos = { ...start };
  let next = checkNext(pos, st);
  if (!next) {
    continue;
  }
  const path = {};
  let i = 0;
  do {
    const [pos, dir] = next;
    if (pos.i === start.i && pos.j === start.j) {
      found = path;
      break;
    }
    const k = `${pos.i},${pos.j}`;
    if (k in path) {
      break;
    }
    i++;
    path[k] = i;
    next = checkNext(pos, dir);
  } while (next);
  if (found) {
    break;
  }
}
let maxStep = Object.values(found).reduce((a, b) => Math.max(a, b), 0);
console.log(Math.ceil(maxStep / 2));
