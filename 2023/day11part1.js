input = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`;

let maxi = 0;
let maxj = 0;
let galaxyI = {};
let galaxyJ = {};
let galaxies = [];
input
  .split("\n")
  .filter((r) => r)
  .forEach((r, i) => {
    maxi = i;
    for (let j = 0; j < r.length; ++j) {
      const c = r.charAt(j);
      if (c === "#") {
        galaxies.push({ oi: i, oj: j, i, j });
        maxj = Math.max(maxj, j);
        galaxyI[i] = 1;
        galaxyJ[j] = 1;
      }
    }
  });
for (let v = 0; v < maxi; ++v) {
  if (v in galaxyI) {
    continue;
  }
  for (const g of galaxies) {
    if (g.oi < v) {
      continue;
    }
    g.i++;
  }
}
for (let v = 0; v < maxj; ++v) {
  if (v in galaxyJ) {
    continue;
  }
  for (const g of galaxies) {
    if (g.oj < v) {
      continue;
    }
    g.j++;
  }
}

let sum = 0;
for (let i = 0; i < galaxies.length; ++i) {
  for (let j = i + 1; j < galaxies.length; ++j) {
    sum +=
      Math.abs(galaxies[i].i - galaxies[j].i) +
      Math.abs(galaxies[i].j - galaxies[j].j);
  }
}
console.log(sum);
