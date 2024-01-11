/**

p0 + v0 * t0 = pr + vr * t0
p0 - pr = (vr - v0) * t0
t0 = (p0 - pr) / (vr - v0)
(x0 - xr) / (vxr - vx0) = (y0 - yr) / (vyr - vy0) = (z0 - zr) / (vzr - vz0)
(x0 - xr) * (vyr - vy0) = (y0 - yr) * (vxr - vx0)
x0 * vyr - x0 * vy0 - xr * vyr + xr * vy0 = y0 * vxr - y0 * vx0 - yr * vxr + yr * vx0
xr * vyr - yr * vxr = x0 * vyr - x0 * vy0 + xr * vy0 - y0 * vxr + y0 * vx0 - yr * vx0
xr * vyr - yr * vxr = vy0 * xr - vx0 * yr + x0 * vyr - y0 * vxr - x0 * vy0 + y0 * vx0

vy0 * xr - vx0 * yr + x0 * vyr - y0 * vxr - x0 * vy0 + y0 * vx0 = vy1 * xr - vx1 * yr + x1 * vyr - y1 * vxr - x1 * vy1 + y1 * vx1
(vy0 - vy1) * xr + (vx1 - vx0) * yr + (y1 - y0) * vxr + (x0 - x1) * vyr = x0 * vy0 - y0 * vx0 - x1 * vy1 + y1 * vx1
 */

input = `19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3
`;
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

let dim = 3;
let matrix = [];
// (vy0 - vy1) * xr + (vx1 - vx0) * yr + (y1 - y0) * vxr + (x0 - x1) * vyr = x0 * vy0 - y0 * vx0 - x1 * vy1 + y1 * vx1
for (let d0 = 0; d0 < dim; ++d0) {
  for (let d1 = d0 + 1; d1 < dim; ++d1) {
    for (let h0 = 0; h0 < hails.length; ++h0) {
      const hail0 = hails[h0];
      for (let h1 = h0 + 1; h1 < hails.length; ++h1) {
        const hail1 = hails[h1];
        const r = [];
        matrix.push(r);
        // rock pos
        for (let k = 0; k < dim; ++k) {
          if (k === d0) {
            r.push(hail0.vel[d1] - hail1.vel[d1]);
          } else if (k === d1) {
            r.push(hail1.vel[d0] - hail0.vel[d0]);
          } else {
            r.push(0);
          }
        }
        // rock vel
        for (let k = 0; k < dim; ++k) {
          if (k === d0) {
            r.push(hail1.pos[d1] - hail0.pos[d1]);
          } else if (k === d1) {
            r.push(hail0.pos[d0] - hail1.pos[d0]);
          } else {
            r.push(0);
          }
        }
        // const
        r.push(
          hail0.pos[d0] * hail0.vel[d1] -
            hail0.pos[d1] * hail0.vel[d0] -
            hail1.pos[d0] * hail1.vel[d1] +
            hail1.pos[d1] * hail1.vel[d0]
        );
      }
    }
  }
}

let printMatrix = (matrix) => {
  matrix.forEach((r) => {
    console.log(JSON.stringify(r));
  });
};
// 高斯消元
let gausElim = (matrix) => {
  const unknownCnt = matrix[0].length - 1;
  let row = 0;
  let col = 0;
  do {
    let maxRow = row;
    for (let i = row + 1; i < matrix.length; ++i) {
      if (Math.abs(matrix[i][col]) > Math.abs(matrix[maxRow][col])) {
        maxRow = i;
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
  } while (row < matrix.length && col < unknownCnt);

  row = matrix.length - 1;
  col = unknownCnt - 1;
  do {
    const v = matrix[row][col];
    if (v === 0) {
      row--;
      continue;
    } else if (v !== 1) {
      col--;
      continue;
    }
    for (let i = row - 1; i >= 0; --i) {
      const m = matrix[i][col];
      matrix[i] = matrix[i].map((v, j) => v - m * matrix[row][j]);
    }
    row--;
    col--;
  } while (row > 0 && col > 0);
  return matrix;
};
gausElim(matrix);
let rLen = matrix[0].length;
console.log(matrix[0][rLen - 1] + matrix[1][rLen - 1] + matrix[2][rLen - 1]);
