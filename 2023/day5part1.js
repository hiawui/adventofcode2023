let input = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`;

let numbers = {};
let maps = {};
input.split("\n\n").forEach((part) => {
  if (!part) {
    return;
  }
  if (part.startsWith("seeds:")) {
    numbers.seed = part
      .substring(7)
      .split(" ")
      .filter((v) => v)
      .map((v) => Number(v));
    return;
  }
  const mapping = {
    map: [],
  };
  part.split("\n").forEach((r) => {
    if (!r) {
      return;
    }
    const re = /^([^-]+)-to-([^-]+) map:/.exec(r);
    // console.log(`## ${r}, ${re ? re.length : null}`);
    if (re) {
      maps[re[1]] = mapping;
      mapping.target = re[2];
    } else {
      mapping.map.push(r.split(/ +/).map((v) => Number(v)));
    }
  });
});
let src = "seed";
let final = "location";
while (src != final) {
  const map = maps[src];
  const targets = [];
  numbers[src].forEach((v) => {
    let ok = false;
    for (const m of map.map) {
      if (v >= m[1] && v < m[1] + m[2]) {
        ok = true;
        targets.push(m[0] + v - m[1]);
        break;
      }
    }
    if (!ok) {
      targets.push(v);
    }
  });
  src = map.target;
  numbers[src] = targets;
}
numbers["location"].reduce((a, b) => Math.min(a, b), Infinity);
