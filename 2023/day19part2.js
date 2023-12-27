input = `px{a<2006:qkq,m>2090:A,rfg}
pv{a>1716:R,A}
lnx{m>1548:A,A}
rfg{s<537:gd,x>2440:R,A}
qs{s>3448:A,lnx}
qkq{x<1416:A,crn}
crn{x>2662:A,R}
in{s<1351:px,qqz}
qqz{s>2770:qs,m<1801:hdj,R}
gd{a>3333:R,R}
hdj{m>838:A,pv}

{x=787,m=2655,a=1222,s=2876}
{x=1679,m=44,a=2067,s=496}
{x=2036,m=264,a=79,s=2244}
{x=2461,m=1339,a=466,s=291}
{x=2127,m=1623,a=2188,s=1013}
`;
let splitRange = ([inputLow, inputHigh], [condLow, condHigh]) => {
  if (condLow > condHigh || condLow > inputHigh || condHigh < inputLow) {
    return [null, [inputLow, inputHigh]];
  } else if (condLow <= inputLow && condHigh >= inputHigh) {
    return [[inputLow, inputHigh], null];
  } else if (condLow <= inputLow) {
    return [
      [inputLow, condHigh],
      [condHigh + 1, inputHigh],
    ];
  } else if (condHigh >= inputHigh) {
    return [
      [condLow, inputHigh],
      [inputLow, condLow - 1],
    ];
  }
  throw new Error(
    `impossible. input: [${inputLow}, ${inputHigh}], cond: [${condLow}, ${condHigh}]`
  );
};
let min = 1;
let max = 4000;
let wfMap = {};
let [wfInput, _] = input.split("\n\n").filter((v) => v);
wfInput
  .split("\n")
  .filter((v) => v)
  .forEach((row) => {
    const spliterIdx = row.indexOf("{");
    const name = row.substring(0, spliterIdx);
    const rules = [];
    row
      .substring(spliterIdx + 1, row.length - 1)
      .split(",")
      .forEach((rule) => {
        const [cond, act] = rule.split(":");
        if (act) {
          const label = cond[0];
          const op = cond[1];
          const number = Number(cond.substring(2));
          const range = op === "<" ? [min, number - 1] : [number + 1, max];
          rules.push({
            cond: [label, range],
            act,
          });
        } else {
          rules.push({
            cond: null,
            act: cond,
          });
        }
      });
    wfMap[name] = rules;
  });

let accepted = [];
let route = (partRange, act, rules) => {
  if (act === "R") {
    return;
  }
  if (act === "A") {
    accepted.push(partRange);
    return;
  }
  for (const rule of rules) {
    const nextRules = wfMap[rule.act];
    if (!rule.cond) {
      route(partRange, rule.act, nextRules);
      return;
    }
    const [c, condRange] = rule.cond;
    const cPartRange = partRange[c];
    const [matched, rest] = splitRange(cPartRange, condRange);
    // console.log(
    //   `split [${c}]: ${JSON.stringify(matched)}, ${JSON.stringify(rest)}`
    // );
    if (matched) {
      route({ ...partRange, [c]: matched }, rule.act, nextRules);
    }
    if (rest === null) {
      return;
    }
    partRange = { ...partRange, [c]: rest };
  }
  throw new Error(`impossible. ${JSON.stringify(partRange)}`);
};
route(
  { x: [min, max], m: [min, max], a: [min, max], s: [min, max] },
  "",
  wfMap["in"]
);
let res = 0;
accepted.forEach((partRange) => {
  let p = 1;
  Object.values(partRange).forEach(([low, high]) => {
    p *= Math.max(0, high - low + 1);
  });
  res += p;
});
console.log(res);
