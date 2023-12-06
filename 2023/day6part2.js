let input = `Time:      7  15   30
Distance:  9  40  200
`;

let game = {};

input.split("\n").forEach((r) => {
  if (!r) {
    return;
  }
  if (r.startsWith("Time:")) {
    game.time = Number(
      r
        .substring(5)
        .split(/ +/)
        .filter((v) => v)
        .join("")
    );
  } else {
    game.distance = Number(
      r
        .substring(9)
        .split(/ +/)
        .filter((v) => v)
        .join("")
    );
  }
});

let run = (ttlTime, chgTime) => (ttlTime - chgTime) * chgTime;

let findChgTime = (ttlTime, tgt) => {
  let low = 0;
  let high = Math.floor(ttlTime / 2);
  let mid = Math.floor((low + high) / 2);
  let dis = run(ttlTime, mid);
  while (true) {
    if (dis > tgt) {
      high = mid;
    } else {
      low = mid;
    }
    mid = Math.floor((low + high) / 2);
    dis = run(ttlTime, mid);
    if (mid === low) {
      break;
    }
  }
  return dis > tgt ? mid : mid + 1;
};

let res = 1;
let low = findChgTime(game.time, game.distance);
let high = game.time - low;
res *= high - low + 1;
console.log(res);
