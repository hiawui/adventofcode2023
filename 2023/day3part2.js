let input = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`;

let symbols = {};
let numbers = [];
input.split("\n").forEach((r, i) => {
  if (!r) {
    return;
  }
  let number = { digits: [], row: i, col: [] };
  for (let j = 0; j < r.length; ++j) {
    const c = r.charAt(j);
    if (c >= "0" && c <= "9") {
      number.digits.push(c);
      number.col.push(j);
    } else {
      if (number.digits.length > 0) {
        numbers.push(number);
        number = { digits: [], row: i, col: [] };
      }
      if (c !== ".") {
        symbols[`${i},${j}`] = { s: c, r: [] };
      }
    }
  }
  if (number.digits.length > 0) {
    numbers.push(number);
  }
});

numbers.forEach((n) => {
  for (let j of n.col) {
    for (rd of [-1, 0, 1]) {
      for (cd of [-1, 0, 1]) {
        const sym = symbols[`${n.row + rd},${j + cd}`];
        if (sym && sym.s === "*") {
          sym.r.push(Number(n.digits.join("")));
          return;
        }
      }
    }
  }
});

Object.values(symbols)
  .filter((s) => s.r.length === 2)
  .map((s) => s.r[0] * s.r[1])
  .reduce((a, b) => a + b, 0);
