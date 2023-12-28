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
    mod.to.forEach((to) => {
      if (to in map) {
        return;
      }
      map[to] = {
        name: to,
        q: [],
        to: [],
      };
    });
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
let cons = ["pv", "qh", "xm", "hz"];
let pushBtn = () => {
  const last4 = {};
  map["broadcaster"].q.push({ from: "", state: 0 });
  let cnt = [0, 0];
  do {
    let newCnt = [0, 0];
    Object.values(map).forEach((mod) => {
      const q = mod.q;
      mod.q = [];
      q.forEach((pulse) => {
        if (mod.name === "kh" && cons.includes(pulse.from) && pulse.state > 0) {
          last4[pulse.from] = pulse.state;
        }
        newCnt[pulse.state]++;
        if (mod.type === "b") {
          mod.to.forEach((to) => {
            map[to].q.push({ from: mod.name, state: pulse.state });
          });
        } else if (mod.type === "%") {
          if (pulse.state === 1) {
            return;
          }
          mod.state = 1 - mod.state;
          mod.to.forEach((to) => {
            map[to].q.push({ from: mod.name, state: mod.state });
          });
        } else if (mod.type === "&") {
          mod.from[pulse.from] = pulse.state;
          let newPulseState = 1;
          if (1 === Object.values(mod.from).reduce((r, v) => r * v, 1)) {
            newPulseState = 0;
          }
          mod.to.forEach((to) => {
            map[to].q.push({ from: mod.name, state: newPulseState });
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
  return last4;
};

let cnt = [0, 0];
let step = 0;
let last4Steps = {};
do {
  step++;
  const last4 = pushBtn();
  Object.entries(last4).forEach(([k, v]) => {
    if (k in last4Steps || v === 0) {
      return;
    }
    last4Steps[k] = step;
  });
  if (Object.keys(last4Steps).length >= 4) {
    break;
  }
} while (true);

let gcd = (a, b) => {
  let [low, high] = [Math.min(a, b), Math.max(a, b)];
  do {
    const rest = high % low;
    if (rest === 0) {
      return low;
    }
    high = low;
    low = rest;
  } while (true);
};
let lcm = (a, b) => {
  return (a * b) / gcd(a, b);
};
let res = 1;
Object.values(last4Steps).forEach((v) => {
  res = lcm(res, v);
});
console.log(res);
