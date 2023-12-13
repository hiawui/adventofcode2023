input = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#
`;

patterns = [];

input
  .split("\n\n")
  .filter((v) => v)
  .forEach((p) => {
    const map = {};
    let maxI = 0;
    let maxJ = 0;
    p.split("\n")
      .filter((v) => v)
      .forEach((r, i) => {
        maxI++;
        maxJ = r.length;
        for (let j = 0; j < r.length; ++j) {
          map[`${i},${j}`] = r.charAt(j);
        }
      });
    patterns.push({
      map,
      i: maxI,
      j: maxJ,
    });
  });

res = 0;
patterns.forEach((p, pi) => {
  // row
  for (let i = 0; i < p.i - 1; ++i) {
    let ok = true;
    for (let j = 0; j < p.j; ++j) {
      for (let k = 0; i - k >= 0 && i + k + 1 < p.i; ++k) {
        if (p.map[`${i - k},${j}`] !== p.map[`${i + k + 1},${j}`]) {
          ok = false;
          break;
        }
      }
      if (!ok) {
        break;
      }
    }
    if (ok) {
      //   console.log(`p: ${pi}, row: ${i}`);
      res += (i + 1) * 100;
      break;
    }
  }

  // col
  for (let j = 0; j < p.j - 1; ++j) {
    let ok = true;
    for (let i = 0; i < p.i; ++i) {
      for (let k = 0; j - k >= 0 && j + k + 1 < p.j; ++k) {
        if (p.map[`${i},${j - k}`] !== p.map[`${i},${j + k + 1}`]) {
          ok = false;
          break;
        }
      }
      if (!ok) {
        break;
      }
    }
    if (ok) {
      //   console.log(`p: ${pi}, col: ${j}`);
      res += j + 1;
      break;
    }
  }
});
console.log(res);
