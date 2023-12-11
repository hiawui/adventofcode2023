input = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`;

let all = [];
let res = 0;
input
  .split("\n")
  .filter((r) => r)
  .forEach((r) => {
    const his = {};
    all.push(his);
    his[0] = r.split(/ +/).map((v) => Number(v));
    let ok = false;
    for (let i = 1; i < 1000; ++i) {
      let curr = [];
      his[i] = curr;
      let last = his[i - 1];
      let nonZeros = 0;
      for (let j = 1; j < last.length; ++j) {
        const v = last[j] - last[j - 1];
        if (v !== 0) {
          nonZeros++;
        }
        curr.push(v);
      }
      if (nonZeros === 0) {
        curr[-1] = 0;
        do {
          i--;
          last[-1] = last[0] - curr[-1];
          curr = last;
          last = his[i - 1];
        } while (i > 0);
        res += curr[-1];
        ok = true;
        break;
      }
    }
    if (!ok) {
      console.error(`cannot find result. seq=${his[0]}`);
    }
  });
console.log(res);
