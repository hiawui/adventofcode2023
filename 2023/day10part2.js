input = `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L
`;

let pipeMap = {
  "|": { dir: ["u", "d"] },
  "-": { dir: ["r", "l"] },
  L: { dir: ["u", "r"] },
  J: { dir: ["l", "u"] },
  7: { dir: ["d", "l"] },
  F: { dir: ["r", "d"] },
};
let map = {};
let start = null;
input
  .split("\n")
  .filter((r) => r)
  .forEach((r, i) => {
    for (let j = 0; j < r.length; ++j) {
      const tile = {};
      const c = r.charAt(j);
      tile.pos = { i, j };
      tile.pipe = c;
      if (c in pipeMap) {
        tile.dir = pipeMap[c].dir;
      }
      if (c === "S") {
        tile.start = true;
        start = tile;
      }
      map[`${i},${j}`] = tile;
    }
  });

let checkNext = (pos, dir) => {
  let oppo = null;
  let { i, j } = pos;
  if (dir === "u") {
    i = pos.i - 1;
    oppo = "d";
  } else if (dir === "l") {
    j = pos.j - 1;
    oppo = "r";
  } else if (dir === "d") {
    i = pos.i + 1;
    oppo = "u";
  } else if (dir === "r") {
    j = pos.j + 1;
    oppo = "l";
  }
  const next = map[`${i},${j}`];
  if (next && next.start) {
    return [next];
  }
  if (!next || !next.dir || !next.dir.includes(oppo)) {
    return null;
  }
  return [next, next.dir.filter((d) => d != oppo)[0]];
};
let found = null;
let cwCnt = 0;
let ccwCnt = 0;
for (const st of ["u", "l", "d", "r"]) {
  let last = start;
  let next = checkNext(start.pos, st);
  if (!next) {
    continue;
  }
  const path = {};
  let s = 0;
  path[`${start.pos.i},${start.pos.j}`] = {
    seq: s,
    start: true,
    out: st,
    tile: start,
  };
  cwCnt = 0;
  ccwCnt = 0;
  do {
    const [tile, dir] = next;
    const k = `${tile.pos.i},${tile.pos.j}`;
    const pathNode = path[k];
    if (pathNode) {
      if (pathNode.start) {
        found = path;
        let indir = null;
        if (last[1] === "u") {
          indir = "d";
        } else if (last[1] === "l") {
          indir = "r";
        } else if (last[1] === "d") {
          indir = "u";
        } else if (last[1] === "r") {
          indir = "l";
        }
        for (const [pipe, { dir }] of Object.entries(pipeMap)) {
          if (dir.includes(st) && dir.includes(indir)) {
            tile.dir = dir;
            tile.pipe = pipe;
            break;
          }
        }
      }
      break;
    }
    s++;
    path[k] = {
      seq: s,
      out: dir,
      tile,
    };
    if (["F", "L", "J", "7"].includes(tile.pipe)) {
      if (tile.dir[1] === dir) {
        ccwCnt++;
      } else {
        cwCnt++;
      }
    }
    last = next;
    next = checkNext(tile.pos, dir);
  } while (next);
  if (found) {
    break;
  }
}

let nest = {};
let ccw = ccwCnt > cwCnt;
for (const node of Object.values(found)) {
  const tile = node.tile;
  const { i, j } = tile.pos;
  const naborK = [];
  if (tile.pipe === "|") {
    if (
      (node.out === tile.dir[1] && ccw) ||
      (node.out === tile.dir[0] && !ccw)
    ) {
      naborK.push(`${i},${j + 1}`);
    } else {
      naborK.push(`${i},${j - 1}`);
    }
  } else if (tile.pipe === "-") {
    if (
      (node.out === tile.dir[1] && ccw) ||
      (node.out === tile.dir[0] && !ccw)
    ) {
      naborK.push(`${i + 1},${j}`);
    } else {
      naborK.push(`${i - 1},${j}`);
    }
  } else if (tile.pipe === "L") {
    if (
      (node.out === tile.dir[1] && !ccw) ||
      (node.out === tile.dir[0] && ccw)
    ) {
      naborK.push(`${i},${j - 1}`);
      naborK.push(`${i + 1},${j}`);
    }
  } else if (tile.pipe === "J") {
    if (
      (node.out === tile.dir[1] && !ccw) ||
      (node.out === tile.dir[0] && ccw)
    ) {
      naborK.push(`${i},${j + 1}`);
      naborK.push(`${i + 1},${j}`);
    }
  } else if (tile.pipe === "7") {
    if (
      (node.out === tile.dir[1] && !ccw) ||
      (node.out === tile.dir[0] && ccw)
    ) {
      naborK.push(`${i},${j + 1}`);
      naborK.push(`${i - 1},${j}`);
    }
  } else if (tile.pipe === "F") {
    if (
      (node.out === tile.dir[1] && !ccw) ||
      (node.out === tile.dir[0] && ccw)
    ) {
      naborK.push(`${i},${j - 1}`);
      naborK.push(`${i - 1},${j}`);
    }
  }
  for (const nk of naborK) {
    const nabor = map[nk];
    if (!nabor || nk in found || nk in nest) {
      continue;
    }
    nest[nk] = { tile: nabor };
  }
}

let findNaborNest = (tile) => {
  const { i, j } = tile.pos;
  const naborK = [
    { i: i - 1, j },
    { i: i + 1, j },
    { i, j: j - 1 },
    { i, j: j + 1 },
  ];
  for (const { i, j } of naborK) {
    const k = `${i},${j}`;
    const nabor = map[k];
    if (!nabor || k in found || k in nest) {
      continue;
    }
    nest[k] = { tile: nabor };
    findNaborNest(nabor);
  }
};
for (const { tile } of Object.values(nest)) {
  findNaborNest(tile);
}
console.log(Object.keys(nest).length);
