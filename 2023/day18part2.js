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
/* 0 means R, 1 means D, 2 means L, and 3 means U */
let actMap = {
  0: [0, 1],
  1: [1, 0],
  2: [0, -1],
  3: [-1, 0],
};
let interMap = {
  3: [0, 1],
  0: [1, 0],
  1: [0, -1],
  2: [-1, 0],
  "3C": [0, -1],
  "0C": [-1, 0],
  "1C": [0, 1],
  "2C": [1, 0],
};
let turnActMap = {
  "01": 1,
  12: 1,
  23: 1,
  30: 1,
  "03": -1,
  32: -1,
  21: -1,
  10: -1,
};
let rRegex = /^[URDL] +[0-9]+ +\(#([0-9a-f]{5})([0123])\)$/;
let hMap = {};
let vMap = {};
let pos = [0, 0];
let cwCnt = 0;
let lastAct = "";
input
  .split("\n")
  .filter((v) => v)
  .forEach((r) => {
    const [i, j] = pos;
    const [_, step0x, act] = rRegex.exec(r);
    const step = parseInt(`0x${step0x}`);
    const [di, dj] = actMap[act];
    const [ei, ej] = [i + di * step, j + dj * step];
    cwCnt += turnActMap[`${lastAct}${act}`] || 0;
    if (di === 0) {
      // horizonal
      const list = (hMap[i] = hMap[i] || []);
      list.push([Math.min(j, ej), Math.max(j, ej), act]);
    } else {
      // vertical
      const list = (vMap[j] = vMap[j] || []);
      list.push([Math.min(i, ei), Math.max(i, ei), act]);
    }
    pos = [ei, ej];
    lastAct = act;
  });
let hLines = Object.entries(hMap).map(([k, v]) => [Number(k), v]);
hLines.sort((a, b) => a[0] - b[0]);
hLines.forEach((lines) => {
  lines.sort((a, b) => a[0] - b[0]);
});
vTicks = Object.keys(vMap).map((v) => Number(v));
vTicks.sort((a, b) => a - b);
let area = 0;
for (let vIdx = 1; vIdx < vTicks.length; ++vIdx) {
  const v0 = vTicks[vIdx - 1];
  const v1 = vTicks[vIdx] - 1;
  let matchedHLines = [];
  hLines.forEach(([i, lines]) => {
    lines.forEach(([start, end]) => {
      if ((start <= v0 && v0 <= end) || (start <= v1 && v1 <= end)) {
        const left = Math.max(start, v0);
        const right = Math.min(end, v1);
        if (left === right) {
          return;
        }
        matchedHLines.push([i, [left, right]]);
      }
    });
  });
  for (let hIdx = 1; hIdx < matchedHLines.length; hIdx += 2) {
    const h0 = matchedHLines[hIdx - 1];
    const h1 = matchedHLines[hIdx];
    area += (Math.abs(h1[0] - h0[0]) + 1) * (Math.abs(h1[1][1] - h0[1][0]) + 1);
  }
}
Object.entries(vMap).forEach(([j, list]) => {
  list.forEach(([i0, i1, act]) => {
    if ((cwCnt > 0 && act === "3") || (cwCnt < 0 && act === "1")) {
      return;
    }
    let deduct = 0;
    if (hMap[i0].find(([j0, _]) => j0 == j)) {
      deduct++;
    }
    if (hMap[i1].find(([j0, _]) => j0 == j)) {
      deduct++;
    }
    // console.log(`## ${j} ${i0}, ${i1}, ${deduct}`);
    area += Math.abs(i0 - i1) + 1 - deduct;
  });
});
console.log(area);
