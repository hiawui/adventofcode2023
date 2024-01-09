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

let dirs = [
  [-1, 0, "^"],
  [0, 1, ">"],
  [1, 0, "v"],
  [0, -1, "<"],
];

let simpleMap = {};
for (const node of Object.values(map)) {
  const k = `${node.i},${node.j}`;
  node.neighbors = {};
  simpleMap[k] = node;
  dirs.forEach(([di, dj]) => {
    const [ni, nj] = [node.i + di, node.j + dj];
    const nk = `${ni},${nj}`;
    if (nk in map) {
      node.neighbors[nk] = 1;
    }
  });
}

do {
  let updCnt = 0;
  for (const node of Object.values(simpleMap)) {
    if (Object.keys(node.neighbors).length !== 2) {
      continue;
    }
    const k = `${node.i},${node.j}`;
    delete simpleMap[k];
    const [[nk0, dis0], [nk1, dis1]] = Object.entries(node.neighbors);
    const n0 = simpleMap[nk0];
    const n1 = simpleMap[nk1];
    delete n0.neighbors[k];
    delete n1.neighbors[k];
    n0.neighbors[nk1] = dis0 + dis1;
    n1.neighbors[nk0] = dis0 + dis1;
    updCnt++;
  }
  if (updCnt === 0) {
    break;
  }
} while (true);

let dfs = (pos, visited) => {
  if (pos.i === end.i && pos.j === end.j) {
    return 0;
  }
  const k = `${pos.i},${pos.j}`;
  visited[k] = 1;
  let res = -Infinity;
  for (const [nk, dis] of Object.entries(pos.neighbors)) {
    if (nk in visited) {
      continue;
    }
    const n = simpleMap[nk];
    const r = dis + dfs(n, visited);
    delete visited[nk];
    if (res < r) {
      res = r;
    }
  }
  return res;
};

dfs(simpleMap[`${start.i},${start.j}`], {});
