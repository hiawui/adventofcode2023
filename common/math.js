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
