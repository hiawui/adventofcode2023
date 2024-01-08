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
      if (r[j] === ".") {
        if (i === 0) {
          start = { i, j };
        }
        end = { i, j };
      }

      map[`${i},${j}`] = {
        i,
        j,
        type: r[j],
      };
    }
  });

let disMap = {
  [`${start.i},${start.j}`]: { i: start.i, j: start.j, dis: 0, from: "" },
};
let nodeCnt = Object.keys(map).length;
for (let i = 0; i < nodeCnt; ++i) {
  for (const disNode of Object.values(disMap)) {
    const k = `${disNode.i},${disNode.j}`;
    const node = map[k];
    [
      [-1, 0, "^"],
      [1, 0, "v"],
      [0, -1, "<"],
      [0, 1, ">"],
    ].forEach(([di, dj, dir]) => {
      if (node.type !== "." && node.type !== dir) {
        return;
      }
      const [ni, nj] = [node.i + di, node.j + dj];
      const nk = `${ni},${nj}`;
      if (!(nk in map) || nk === disNode.from) {
        return;
      }
      const nNode = map[nk];
      if (nNode.type === "#") {
        return;
      }
      const nDisNode = (disMap[nk] = disMap[nk] || {
        i: ni,
        j: nj,
        dis: disNode.dis + 1,
        from: k,
      });
      if (nDisNode.dis < disNode.dis + 1) {
        nDisNode.dis = disNode.dis + 1;
        nDisNode.from = k;
      }
    });
  }
}
console.log(disMap[`${end.i},${end.j}`].dis);
