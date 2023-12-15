input = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;

let result = 0;
input
  .split(",")
  .filter((v) => v)
  .forEach((s) => {
    let hash = 0;
    for (let i = 0; i < s.length; ++i) {
      const c = s.charCodeAt(i);
      hash += c;
      hash *= 17;
      hash %= 256;
    }
    // console.log(`s: ${s}, ${hash}`);
    result += hash;
  });
console.log(result);
