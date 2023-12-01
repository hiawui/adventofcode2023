let input = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

let values = [];
input.split("\n").forEach((r) => {
  if (!r) {
    return;
  }
  const digits = [];
  for (let i = 0; i < r.length; ++i) {
    const c = r.charAt(i);
    if (c >= "0" && c <= "9") {
      if (digits.length === 0) {
        digits.push(c);
        digits.push(c);
      } else {
        digits.splice(1, 1, c);
      }
    }
  }
  values.push(Number(digits.join("")));
});
values.reduce((a, b) => a + b, 0);
