input = `
broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output
`;

let map = {};
input
  .split("\n")
  .filter((v) => v)
  .forEach((r) => {
    const [sInput, rInput] = r.split(/ *-> */);
    const mod = {
      q: [],
    };
    if (sInput[0] === "b") {
      mod.name = sInput;
      mod.type = "b";
      mod.q = [];
    } else {
      mod.name = sInput.substring(1);
      mod.type = sInput[0];
      if (mod.type === "%") {
        mod.state = 0;
      } else if (mod.type === "&") {
        mod.from = {};
      }
    }
    mod.to = rInput.split(/, */);
    map[mod.name] = mod;
  });
Object.values(map).forEach((mod) => {
  mod.to.forEach((to) => {
    const toMod = map[to];
    if (!toMod || toMod.type !== "&") {
      return;
    }
    toMod.from[mod.name] = 0;
  });
});

let pushBtn = () => {
  map["broadcaster"].q.push({ from: "", state: 0 });
  let cnt = [1, 0];
  do {
    let newCnt = [0, 0];
    Object.values(map).forEach((mod) => {
      const q = mod.q;
      mod.q = [];
      q.forEach((pulse) => {
        if (mod.type === "b") {
          mod.to.forEach((to) => {
            newCnt[pulse.state]++;
            const toMod = map[to];
            if (!toMod) {
              return;
            }
            toMod.q.push({ from: mod.name, state: pulse.state });
          });
        } else if (mod.type === "%") {
          if (pulse.state === 1) {
            return;
          }
          mod.state = 1 - mod.state;
          mod.to.forEach((to) => {
            newCnt[mod.state]++;
            const toMod = map[to];
            if (!toMod) {
              return;
            }
            toMod.q.push({ from: mod.name, state: mod.state });
          });
        } else if (mod.type === "&") {
          mod.from[pulse.from] = pulse.state;
          let newPulseState = 1;
          if (1 === Object.values(mod.from).reduce((r, v) => r * v, 1)) {
            newPulseState = 0;
          }
          mod.to.forEach((to) => {
            newCnt[newPulseState]++;
            const toMod = map[to];
            if (!toMod) {
              return;
            }
            toMod.q.push({ from: mod.name, state: newPulseState });
          });
        }
      });
    });
    if (newCnt[0] === 0 && newCnt[1] === 0) {
      break;
    }
    cnt[0] += newCnt[0];
    cnt[1] += newCnt[1];
  } while (true);
  return cnt;
};

let maxStep = 1000;
let cnt = [0, 0];
let step = 0;
do {
  const [lowCnt, highCnt] = pushBtn();
  step++;
  cnt[0] += lowCnt;
  cnt[1] += highCnt;
} while (step < maxStep);

console.log(cnt[0] * cnt[1]);
