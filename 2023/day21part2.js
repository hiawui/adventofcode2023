
let rowCnt = 0;
let colCnt = 0;
let map = {};
let start = null;
input
  .split("\n")
  .filter((v) => v)
  .forEach((r, i) => {
    rowCnt++;
    colCnt = r.length;
    for (let j = 0; j < r.length; ++j) {
      map[`${i},${j}`] = {
        i,
        j,
        type: "#" === r[j] ? "#" : ".",
      };
      if (r[j] === "S") {
        start = [i, j];
      }
    }
  });

let getTile = (i, j) => {
  const oi = (rowCnt + (i % rowCnt)) % rowCnt;
  const oj = (colCnt + (j % colCnt)) % colCnt;
  const k = `${oi},${oj}`;
  return { ...map[k], i, j, oi, oj };
};

let go1 = (pos) => {
  const res = {};
  for (const [i, j] of Object.values(pos)) {
    [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ].forEach(([di, dj]) => {
      const [ni, nj] = [i + di, j + dj];
      const nTile = getTile(ni, nj);
      if (nTile === null || nTile.type === "#") {
        return;
      }
      const nk = `${ni},${nj}`;
      if (nk in res) {
        return;
      }
      res[nk] = [ni, nj];
    });
  }
  return res;
};

let step = 65 + 131 * 2;
let pos = { [`${start[0]},${start[1]}`]: start };
while (step-- > 0) {
  pos = go1(pos);
}

/**
type0Cnt = N^2 + 2N + 1
type1Cnt = N^2

excl = (2 * type0PlotCnt - edge0_in) * (N+1)
incl = edge1_in * N
*/
let type0PlotCnt = 0;
let type1PlotCnt = 0;
let edge0In = 0;
let edge1In = 0;
// count type0
for (let i = 0; i < 131; ++i) {
  for (let j = 0; j < 131; ++j) {
    if (`${i},${j}` in pos) {
      type0PlotCnt++;
    }
  }
}
// count type1
for (let i = 131; i < 131 * 2; ++i) {
  for (let j = 0; j < 131; ++j) {
    if (`${i},${j}` in pos) {
      type1PlotCnt++;
    }
  }
}
// count edge0In
for (let i = -131 * 2; i < -131; ++i) {
  for (let j = 0; j < 131; ++j) {
    if (`${i},${j}` in pos) {
      edge0In++;
    }
  }
}
for (let i = 131 * 2; i < 131 * 3; ++i) {
  for (let j = 0; j < 131; ++j) {
    if (`${i},${j}` in pos) {
      edge0In++;
    }
  }
}
// count edge1In
for (let i = -131 * 2; i < -131; ++i) {
  for (let j = -131; j < 0; ++j) {
    if (`${i},${j}` in pos) {
      edge1In++;
    }
  }
}
for (let i = -131 * 2; i < -131; ++i) {
  for (let j = 131; j < 131 * 2; ++j) {
    if (`${i},${j}` in pos) {
      edge1In++;
    }
  }
}
for (let i = 131 * 2; i < 131 * 3; ++i) {
  for (let j = -131; j < 0; ++j) {
    if (`${i},${j}` in pos) {
      edge1In++;
    }
  }
}
for (let i = 131 * 2; i < 131 * 3; ++i) {
  for (let j = 131; j < 131 * 2; ++j) {
    if (`${i},${j}` in pos) {
      edge1In++;
    }
  }
}
let n = (26501365 - 65) / 131;
let res =
  (n ** 2 + n * 2 + 1) * type0PlotCnt +
  n ** 2 * type1PlotCnt +
  edge1In * n -
  (2 * type0PlotCnt - edge0In) * (n + 1);
console.log(res);
