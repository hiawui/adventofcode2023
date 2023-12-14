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
let res = 0;
Object.entries(map).forEach(([k, c]) => {
  if (c === "#") {
    return;
  }
  res += (rowCnt - Number(k.split(',')[0]))
});
console.log(res)
