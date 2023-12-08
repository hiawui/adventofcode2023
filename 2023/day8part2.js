input = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)
`;

let instructions = "";
let map = {};
let starts = [];
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
    if (from.charAt(2) === "A") {
      starts.push(from);
    }
  });

console.log(`step: 0, ${JSON.stringify(starts)}`);
let positions = [...starts];
let minSteps = starts.map((_) => 0);
let actMap = { L: 0, R: 1 };
for (const i in positions) {
  let pos = positions[i];
  let step = 0;
  while (true) {
    const act = instructions.charAt(step % instructions.length);
    pos = map[pos][actMap[act]];
    positions[i] = pos;
    step++;
    if (pos.charAt(2) === "Z") {
      minSteps[i] = step;
      break;
    }
  }
}
let primes = {};
let maxTry = Math.sqrt(minSteps.reduce((a, b) => Math.max(a, b), 0));
for (let i = 2; i <= maxTry; ++i) {
  let yes = true;
  for (const p in primes) {
    if (i % p === 0) {
      yes = false;
      break;
    }
  }
  if (yes) {
    primes[i] = 1;
  }
}
let factors = [];
minSteps.forEach((step) => {
  const f = {};
  for (const p in primes) {
    while (step % p === 0) {
      f[p] = f[p] || 0;
      f[p]++;
      step /= p;
      if (step === 1) {
        return;
      }
    }
  }
  if (step > 1) {
    f[step] = 1;
  }
  factors.push(f);
});

let maxFactors = {};
factors.forEach((f) => {
  for (const [k, n] of Object.entries(f)) {
    maxFactors[k] = maxFactors[k] || 0;
    maxFactors[k] = Math.max(maxFactors[k], n);
  }
});
let max = 1;
for (const [k, n] of Object.entries(maxFactors)) {
  max *= k ** n;
}
console.log(max);
