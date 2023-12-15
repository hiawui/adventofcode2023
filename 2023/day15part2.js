input = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;

let boxes = {};
input
  .split(",")
  .filter((v) => v)
  .forEach((s) => {
    const re = /^([^=-]+)([=-])([0-9]*)$/.exec(s);
    if (!re) {
      console.error(`invalid step: ${s}`);
      return;
    }
    const [_, label, op, focal] = re;
    let hash = 0;
    for (let i = 0; i < label.length; ++i) {
      const c = s.charCodeAt(i);
      hash += c;
      hash *= 17;
      hash %= 256;
    }
    const lenses = (boxes[hash] = boxes[hash] || []);
    if (op === "-") {
      boxes[hash] = lenses.filter((l) => l.label !== label);
    } else if (op === "=" && focal) {
      const lens = lenses.find((l) => l.label === label);
      if (lens) {
        lens.focal = Number(focal);
      } else {
        lenses.push({
          label,
          focal: Number(focal),
        });
      }
    }
  });

let res = 0;
Object.entries(boxes).forEach(([boxIdx, lenses]) => {
  res += lenses.reduce(
    (r, lens, lensIdx) => r + (Number(boxIdx) + 1) * (lensIdx + 1) * lens.focal,
    0
  );
});
console.log(res);
