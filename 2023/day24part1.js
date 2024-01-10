input = `19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3
`;
let range = [7, 27];
let hails = [];
input
  .split("\n")
  .filter((v) => v)
  .forEach((r, i) => {
    const [p, v] = r.split(/ *@ */);
    const obj = { id: i };
    hails.push(obj);
    obj.pos = p.split(/ *, */).map((v) => Number(v));
    obj.vel = v.split(/ *, */).map((v) => Number(v));
  });

// v0 * t0 - v1 * t1 == p1 - p0
let resolve2 = (hail0, hail1, d) => {
  const matrix = [];
  for (let i = 0; i < d; ++i) {
    matrix.push([hail0.vel[i], -hail1.vel[i], hail1.pos[i] - hail0.pos[i]]);
  }

  // 高斯消元
  let row = 0;
  let col = 0;
  do {
    let maxRow = row;
    for (let i = row + 1; i < matrix.length; ++i) {
      if (Math.abs(matrix[row][col]) > Math.abs(matrix[maxRow][col])) {
        maxRow = row;
      }
    }
    if (matrix[maxRow][col] === 0) {
      col++;
      continue;
    }

    const tmp = matrix[row];
    matrix[row] = matrix[maxRow];
    matrix[maxRow] = tmp;

    const div = matrix[row][col];
    matrix[row] = matrix[row].map((v) => v / div);
    for (let i = row + 1; i < matrix.length; ++i) {
      const m = matrix[i][col];
      matrix[i] = matrix[i].map((v, j) => v - m * matrix[row][j]);
    }

    row++;
    col++;
  } while (row < matrix.length && col < 2);

  row = matrix.length - 1;
  col = 1;
  do {
    if (matrix[row][col] === 0) {
      row--;
      continue;
    }
    for (let i = row - 1; i >= 0; --i) {
      const m = matrix[i][col];
      matrix[i] = matrix[i].map((v, j) => v - m * matrix[row][j]);
    }
    row--;
    col--;
  } while (row > 1 && col > 0);
  if (matrix[1][1] === 0) {
    return [-Infinity, -Infinity];
  }
  return [matrix[0][2], matrix[1][2]];
};

let dim = 2;
let cnt = 0;
for (let i = 0; i < hails.length; ++i) {
  for (let j = i + 1; j < hails.length; ++j) {
    const [ti, tj] = resolve2(hails[i], hails[j], dim);
    if (ti < 0 || tj < 0) {
      continue;
    }
    const point = [];
    for (let k = 0; k < dim; ++k) {
      const e = hails[i].pos[k] + hails[i].vel[k] * ti;
      if (e < range[0] || e > range[1]) {
        break;
      }
      point.push(e);
    }
    if (point.length === dim) {
      cnt++;
    }
  }
}
console.log(cnt);
