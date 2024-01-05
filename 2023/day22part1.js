input = `1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9
`;

let bricks = {};
input
  .split("\n")
  .filter((v) => v)
  .forEach((r, i) => {
    const [e0, e1] = r.split("~");
    const [x0, y0, z0] = e0.split(",").map((v) => Number(v));
    const [x1, y1, z1] = e1.split(",").map((v) => Number(v));
    const brick = {
      id: i,
      ends: [
        { x: x0, y: y0, z: z0 },
        { x: x1, y: y1, z: z1 },
      ],
      support: {},
      supported: {},
    };
    brick.ends.sort((e0, e1) => e0.z - e1.z);
    bricks[i] = brick;
  });
let sortedBricks = Object.values(bricks);
let sortBricks = (bricks) => {
  bricks.sort((b0, b1) => {
    const cl = b0.ends[0].z - b1.ends[0].z;
    if (cl != 0) {
      return cl;
    }
    return b0.ends[1].z - b1.ends[1].z;
  });
};
sortBricks(sortedBricks);

let isConflict1D = ([f0, t0], [f1, t1]) => {
  let [l0, h0] = [Math.min(f0, t0), Math.max(f0, t0)];
  let [l1, h1] = [Math.min(f1, t1), Math.max(f1, t1)];
  if (l0 > h1 || l1 > h0) {
    return false;
  }
  return true;
};
let isConflict = (b0, b1) => {
  const ends0 = b0.ends;
  const ends1 = b1.ends;
  if (!isConflict1D([ends0[0].z, ends0[1].z], [ends1[0].z, ends1[1].z])) {
    return false;
  }
  if (!isConflict1D([ends0[0].y, ends0[1].y], [ends1[0].y, ends1[1].y])) {
    return false;
  }
  if (!isConflict1D([ends0[0].x, ends0[1].x], [ends1[0].x, ends1[1].x])) {
    return false;
  }
  return true;
};
let brickZMove = (brick, dz) => {
  brick.ends[0].z += dz;
  brick.ends[1].z += dz;
};

for (let i = 0; i < sortedBricks.length; ++i) {
  let conflictZ = [0];
  const brick = sortedBricks[i];
  for (let j = i - 1; j >= 0; --j) {
    // check conflict
    const lowerBrick = sortedBricks[j];
    const dz = lowerBrick.ends[1].z - brick.ends[0].z;
    brickZMove(brick, dz);
    if (isConflict(brick, lowerBrick)) {
      if (conflictZ[0] < brick.ends[0].z) {
        conflictZ = [brick.ends[0].z, lowerBrick.id];
      } else if (conflictZ[0] == brick.ends[0].z) {
        conflictZ.push(lowerBrick.id);
      }
    }
    brickZMove(brick, -dz);
  }
  const dz = conflictZ[0] + 1 - brick.ends[0].z;
  brickZMove(brick, dz);
  for (let i = 1; i < conflictZ.length; ++i) {
    const supporterId = conflictZ[i];
    const supporter = bricks[supporterId];
    supporter.support[brick.id] = 1;
    brick.supported[supporterId] = 1;
  }
  sortBricks(sortedBricks);
}

let cnt = 0;
for (const brick of sortedBricks) {
  let ok = true;
  for (const upId of Object.keys(brick.support)) {
    const upBrick = bricks[upId];
    if (Object.keys(upBrick.supported).length <= 1) {
      ok = false;
      break;
    }
  }
  if (ok) {
    cnt++;
  }
}
console.log(cnt);
