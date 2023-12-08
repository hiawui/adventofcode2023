input = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)
`;

let instructions = "";
let map = {};
input
  .split("\n")
  .filter((v) => v)
  .forEach((r, i) => {
    if (i === 0) {
      instructions = r;
      return;
    }
    const [from, tgts] = r.split(/ *= */);
    const re = /^\(([^ ,]+), *([^ ,]+)\)$/.exec(tgts);
    map[from] = [re[1], re[2]];
  });

let pos = "AAA";
let step = 0;
let actMap = { L: 0, R: 1 };
while (true) {
  pos = map[pos][actMap[instructions.charAt(step % instructions.length)]];
  step++;
  if (pos === "ZZZ") {
    break;
  }
}
console.log(step);
