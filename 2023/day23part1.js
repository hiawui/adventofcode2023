input = `#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#
`;

let map = {};
let start = null;
let end = null;
input
  .split("\n")
  .filter((v) => v)
  .forEach((r, i) => {
    for (let j = 0; j < r.length; ++j) {
      if (r[j] === "#") {
        continue;
      }
      const obj = {
        i,
        j,
        type: r[j],
      };
      if (r[j] === ".") {
        if (i === 0) {
          start = { i, j };
        }
        end = { i, j };
      }
      map[`${i},${j}`] = obj;
    }
  });

let search = (end, pos, visited) => {
  if (end.i === pos.i && end.j === pos.j) {
    return 0;
  }
    const node = map[`${pos.i},${pos.j}`];
  let max = -Infinity;
  for (const [di, dj, dir] of [
    [-1, 0, "^"],
    [0, 1, ">"],
    [1, 0, "v"],
    [0, -1, "<"],
  ]) {
    if (node.type !== "." && node.type !== dir) {
      continue;
    }
    const [ni, nj] = [pos.i + di, pos.j + dj];
    const nk = `${ni},${nj}`;
    if (!(nk in map) || nk in visited) {
      continue;
    }
    const dis =
      search(end, { i: ni, j: nj }, { ...visited, [`${pos.i},${pos.j}`]: 1 }) +
      1;
    max = Math.max(dis, max);
  }
  return max;
};

console.log(search(end, start, {}));
