input = `
...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........
`;

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
  if (`${i},${j}` in map) {
    return map[`${i},${j}`];
  }
  return null;
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

let step = 64;
let pos = { [`${start[0]},${start[1]}`]: start };
while (step-- > 0) {
  pos = go1(pos);
}
console.log(Object.keys(pos).length);
