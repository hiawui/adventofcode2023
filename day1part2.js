let input = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

let words = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];
let values = [];
input.split("\n").forEach((r) => {
  if (!r) {
    return;
  }
  const digits = [];
  for (let i = 0; i < r.length; ++i) {
    const c = r.charAt(i);
    let d = null;
    if (c >= "0" && c <= "9") {
      d = c;
    } else {
      for (let j = 0; j < words.length; ++j) {
        const w = words[j];
        if (i + w.length > r.length) {
          continue;
        }
        let match = true;
        for (let k = 0; k < w.length && i + k < r.length; ++k) {
          if (w.charAt(k) != r.charAt(i + k)) {
            match = false;
            break;
          }
        }
        if (match) {
          d = j + 1;
          break;
        }
      }
    }
    if (d) {
      if (digits.length === 0) {
        digits.push(d);
        digits.push(d);
      } else {
        digits.splice(1, 1, d);
      }
    }
  }
  values.push(Number(digits.join("")));
});
values.reduce((a, b) => a + b, 0);
