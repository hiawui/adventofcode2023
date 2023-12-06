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

let seeds = [];
let maps = {};
input.split("\n\n").forEach((part) => {
  if (!part) {
    return;
  }
  if (part.startsWith("seeds:")) {
    const s = part
      .substring(7)
      .split(/ +/)
      .filter((v) => v)
      .map((v) => Number(v));
    for (let i = 0; i < s.length; i += 2) {
      seeds.push([s[i], s[i] + s[i + 1]]);
    }
    seeds.sort((a, b) => a[0] - b[0]);
    return;
  }
  const mapping = {
    tgt: "",
    ranges: [],
    checkpoints: [],
  };
  part.split("\n").forEach((r) => {
    if (!r) {
      return;
    }
    const re = /^([^-]+)-to-([^-]+) map:/.exec(r);
    if (re) {
      maps[re[1]] = mapping;
      mapping.tgt = re[2];
    } else {
      const rawRange = r.split(/ +/).map((v) => Number(v));
      mapping.ranges.push({
        src: [rawRange[1], rawRange[1] + rawRange[2]],
        chg: rawRange[0] - rawRange[1],
      });
    }
  });
  mapping.ranges.sort((a, b) => a.src[0] - b.src[0]);
  mapping.checkpoints = mapping.ranges
    .flatMap((r) => [r.src[0], r.src[1]])
    .reduce((a, e) => {
      if (a.length && a[a.length - 1] === e) {
        return a;
      }
      a.push(e);
      return a;
    }, []);
});

let splitSources = (srcs, checkpoints) => {
  const mp = [...checkpoints];
  const out = [];
  srcs.forEach((r) => {
    let [a, b] = r;
    while (mp.length > 0 && mp[0] <= a) {
      mp.splice(0, 1);
    }
    while (mp.length > 0 && mp[0] > a && mp[0] < b) {
      out.push([a, mp[0]]);
      a = mp[0];
      mp.splice(0, 1);
    }
    out.push([a, b]);
  });
  return out;
};

let src = "seed";
let srcOrigRange = seeds;
let final = "location";
while (src != final) {
  const map = maps[src];
  const srcRange = splitSources(srcOrigRange, map.checkpoints);
  const tgtOrigRange = srcRange.map((r) => {
    for (let i = 0; i < map.ranges.length; ++i) {
      const mr = map.ranges[i];
      if (r[0] >= mr.src[0] && r[0] < mr.src[1]) {
        return [r[0] + mr.chg, r[1] + mr.chg];
      }
    }
    return r;
  });
  tgtOrigRange.sort((a, b) => a[0] - b[0]);
  srcOrigRange = tgtOrigRange;
  src = map.tgt;
}
let min = Infinity;
srcOrigRange.forEach((r) => {
  min = Math.min(min, r[0]);
});
console.log(min);
