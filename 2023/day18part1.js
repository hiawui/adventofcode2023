input = `R 6 (#70c710)
D 5 (#0dc571)
L 2 (#5713f0)
D 2 (#d2c081)
R 2 (#59c680)
D 2 (#411b91)
L 5 (#8ceee2)
U 2 (#caa173)
L 1 (#1b58a2)
U 2 (#caa171)
R 2 (#7807d2)
U 3 (#a77fa3)
L 2 (#015232)
U 2 (#7a21e3)
`;
let actMap = {
  U: [-1, 0],
  R: [0, 1],
  D: [1, 0],
  L: [0, -1],
};
let interMap = {
  U: [0, 1],
  R: [1, 0],
  D: [0, -1],
  L: [-1, 0],
  UC: [0, -1],
  RC: [-1, 0],
  DC: [0, 1],
  LC: [1, 0],
};
let turnActMap = {
  RD: 1,
  DL: 1,
  LU: 1,
  UR: 1,
  RU: -1,
  UL: -1,
  LD: -1,
  DR: -1,
};
let minMaxI = [0, 0];
let minMaxJ = [0, 0];
let rRegex = /^([URDL]) +([0-9]+) +\((#[0-9a-f]+)\)$/;
let map = {};
let pos = { i: 0, j: 0 };
let cwCnt = 0;
let lastAct = "";
input
  .split("\n")
  .filter((v) => v)
  .forEach((r) => {
    const [_, act, step, color] = rRegex.exec(r);
    const [di, dj] = actMap[act];
    cwCnt += turnActMap[`${lastAct}${act}`] || 0;
    for (let s = 0; s < step; ++s) {
      pos.i += di;
      pos.j += dj;
      map[`${pos.i},${pos.j}`] = { i: pos.i, j: pos.j, color, act };
    }
    minMaxI = [Math.min(pos.i, minMaxI[0]), Math.max(pos.i, minMaxI[1])];
    minMaxJ = [Math.min(pos.j, minMaxJ[0]), Math.max(pos.j, minMaxJ[1])];
    lastAct = act;
  });

let expandInter = (i, j) => {
  const stack = [{ i, j }];
  do {
    const { i, j } = stack.pop();
    for (const [di, dj] of [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ]) {
      const [ni, nj] = [i + di, j + dj];
      const nk = `${ni},${nj}`;
      if (nk in map) {
        continue;
      }
      map[nk] = { i: ni, j: nj, inter: true };
      stack.push({ i: ni, j: nj });
    }
  } while (stack.length > 0);
};
Object.values(map).forEach((hole) => {
  const [di, dj] = interMap[`${hole.act}${cwCnt > 0 ? "" : "C"}`];
  const [ni, nj] = [hole.i + di, hole.j + dj];
  const nk = `${ni},${nj}`;
  if (nk in map) {
    return;
  }
  map[nk] = { i: ni, j: nj, inter: true };
  expandInter(ni, nj, 0);
});
console.log(Object.keys(map).length);
