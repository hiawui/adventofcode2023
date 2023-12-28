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

let map = {};
let start = null;
input
  .split("\n")
  .filter((v) => v)
  .forEach((r, i) => {
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

let cache = {};
let go = (i, j, steps) => {
  const goK = `${i},${j},${steps}`;
  if (goK in cache) {
    return cache[goK];
  }
  if (steps === 0) {
    return { [`${i},${j}`]: 1 };
  }
  const pos = {};
  [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ].forEach(([di, dj]) => {
    const [ni, nj] = [i + di, j + dj];
    const nk = `${ni},${nj}`;
    if (!(nk in map) || map[nk].type === "#") {
      return;
    }
    pos[nk] = { i: ni, j: nj };
  });
  const res = {};
  Object.values(pos).forEach(({ i, j }) => {
    Object.keys(go(i, j, steps - 1)).forEach((k) => {
      res[k] = 1;
    });
  });
  cache[goK] = res;
  return res;
};

let res = go(start[0], start[1], 64);
console.log(Object.keys(res).length);
