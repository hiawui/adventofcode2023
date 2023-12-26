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

let workflows = {};
let parts = [];
let accepted = [];

let [wfInput, ptInput] = input
  .split("\n\n")
  .filter((v) => v)
  .map((v) => v.trim());
let wfRe = /^([^{}]+){(.+)}$/;
wfInput
  .split("\n")
  .filter((v) => v)
  .forEach((r) => {
    const [_, name, flow] = wfRe.exec(r);
    const rules = [];
    workflows[name] = rules;
    flow
      .split(",")
      .filter((v) => v)
      .forEach((rule) => {
        const [cond, act] = rule.split(":");
        if (!act) {
          rules.push({
            cond: null,
            act: cond,
          });
        } else {
          rules.push({
            cond,
            act,
          });
        }
      });
  });
ptInput
  .split("\n")
  .filter((v) => v)
  .forEach((r) => {
    parts.push(r.slice(1, r.length - 1));
  });
let runRule = (part, rule) => {
  if (!rule.cond) {
    return rule.act;
  }
  let x = null,
    m = null,
    a = null,
    s = null;
  eval(part);
  if (eval(rule.cond)) {
    return rule.act;
  }
  return null;
};
let procPart = (part) => {
  let rules = workflows["in"];
  while (rules) {
    for (const rule of rules) {
      const act = runRule(part, rule);
      if (act === null) {
        continue;
      } else if (act === "A") {
        accepted.push(part);
        return;
      } else if (act === "R") {
        return;
      }
      rules = workflows[act];
      break;
    }
  }
};
parts.forEach((part) => {
  procPart(part);
});
let res = 0;
accepted.forEach((part) => {
  part
    .split(",")
    .filter((v) => v)
    .forEach((c) => {
      res += Number(c.split("=")[1]);
    });
});
console.log(res);
