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
let max = -Infinity;
let tasks = [
  {
    i: start.i,
    j: start.j,
    dis: -Infinity,
    children: [...dirs],
  },
];
let lastChildDis = -Infinity;
let visited = { [`${start.i},${start.j}`]: 1 };
do {
  const task = tasks[tasks.length - 1];
  const k = `${task.i},${task.j}`;
  if (task.i === end.i && task.j === end.j) {
    tasks.pop();
    delete visited[k];
    lastChildDis = 0;
    continue;
  }
  if (task.dis < lastChildDis + 1) {
    task.dis = lastChildDis + 1;
  }
  if (task.children.length <= 0) {
    tasks.pop();
    delete visited[k];
    lastChildDis = task.dis;
    continue;
  }
  const node = map[k];
  lastChildDis = -Infinity;
  do {
    const [di, dj, dir] = task.children.pop();
    if (node.type !== "." && node.type !== dir) {
      continue;
    }
    const [ni, nj] = [task.i + di, task.j + dj];
    const nk = `${ni},${nj}`;
    if (!(nk in map) || nk in visited) {
      continue;
    }
    tasks.push({
      i: ni,
      j: nj,
      dis: -Infinity,
      children: [...dirs],
    });
    visited[nk] = 1;
    break;
  } while (task.children.length);
} while (tasks.length);

console.log(lastChildDis);
