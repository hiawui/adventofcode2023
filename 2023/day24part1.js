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

/**
 * v0 * t0 - v1 * t1 == p1 - p0
 *
 * vx0 * t0 - vx1 * t1 = x1 - x0
 * vy0 * t0 - vy1 * t1 = y1 - y0
 * t1 = (vx0 * t0 - x1 + x0) / vx1
 * vy0 * t0 - vy1 * (vx0 * t0 - x1 + x0) / vx1 = y1 - y0
 * (vy0 - vy1 * vx0 / vx1) * t0 + vy1 * x1 / vx1 - vy1 * x0 / vx1 = y1 - y0
 * t0 = (y1 - y0 - vy1 * x1 / vx1 + vy1 * x0 / vx1) / (vy0 - vy1 * vx0 / vx1)
 */
let resolve2 = (hail0, hail1) => {
  const t0 =
    (hail1.pos[1] -
      hail0.pos[1] -
      (hail1.vel[1] * hail1.pos[0]) / hail1.vel[0] +
      (hail1.vel[1] * hail0.pos[0]) / hail1.vel[0]) /
    (hail0.vel[1] - (hail1.vel[1] * hail0.vel[0]) / hail1.vel[0]);
  const t1 = (hail0.vel[0] * t0 - hail1.pos[0] + hail0.pos[0]) / hail1.vel[0];
  return [t0, t1];
};

let cnt = 0;
for (let i = 0; i < hails.length; ++i) {
  for (let j = i + 1; j < hails.length; ++j) {
    const [ti, tj] = resolve2(hails[i], hails[j]);
    if (ti < 0 || tj < 0) {
      continue;
    }
    const point = [];
    for (let k = 0; k < 2; ++k) {
      const e = hails[i].pos[k] + hails[i].vel[k] * ti;
      if (e < range[0] || e > range[1]) {
        break;
      }
      point.push(e);
    }
    if (point.length === 2) {
      cnt++;
    }
  }
}
console.log(cnt);
