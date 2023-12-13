input = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`;
// input = document.querySelector('pre').innerText.trim()
let times = 1;
let all = [];
input
  .split("\n")
  .filter((r) => r)
  .forEach((r) => {
    const [records, numbers] = r.split(/ +/);

    const line = {
      raw: r,
      records: [],
      numbers: [],
      brkCnt: 0,
      qmCnt: 0,
      ttlCnt: 0,
    };
    const origRecords = records
      .split("")
      .filter((r) => r)
      .reduce((arr, r) => {
        if (arr[arr.length - 1] === "." && r === ".") {
          return arr;
        }
        arr.push(r);
        return arr;
      }, []);
    const origNumbers = numbers
      .split(",")
      .filter((v) => v)
      .map((v) => Number(v));
    for (let i = 0; i < times; ++i) {
      origRecords.forEach((r) => line.records.push(r));
      if (i < times - 1) {
        line.records.push("?");
      }
      origNumbers.forEach((n) => line.numbers.push(n));
    }
    // <-- 简化
    while (["."].includes(line.records[0])) {
      line.records.splice(0, 1);
    }
    while (["."].includes(line.records[line.records.length - 1])) {
      line.records.splice(line.records.length - 1, 1);
    }
    // 简化完成 -->

    line.numbers.forEach((n) => {
      line.ttlCnt += n;
    });
    line.records.forEach((r) => {
      if (r === "#") {
        line.brkCnt++;
      } else if (r === "?") {
        line.qmCnt++;
      }
    });
    all.push(line);
  });

let tryComb2 = (records, rcOffset, numbers, nbOffset, cache) => {
  if (rcOffset >= records.length && nbOffset < numbers.length) {
    return 0;
  } else if (nbOffset >= numbers.length) {
    if (rcOffset >= records.length) {
      return 1;
    }
    for (let i = rcOffset; i < records.length; ++i) {
      if (records[i] === "#") {
        return 0;
      }
    }
    return 1;
  }
  const cacheKey =
    records.slice(rcOffset).join("") + numbers.slice(nbOffset).join(",");
  if (cacheKey in cache) {
    return cache[cacheKey];
  }
  const r = records[rcOffset];
  let cnt = 0;
  if ([".", "?"].includes(r)) {
    cnt += tryComb2(records, rcOffset + 1, numbers, nbOffset, cache);
  }
  if (["#", "?"].includes(r)) {
    const n = numbers[nbOffset];
    let ok = true;
    if (rcOffset + n > records.length) {
      ok = false;
    }
    for (let i = rcOffset + 1; ok && i < rcOffset + n; ++i) {
      if ("." === records[i]) {
        ok = false;
      }
    }
    if (
      ok &&
      (rcOffset + n === records.length ||
        ["?", "."].includes(records[rcOffset + n]))
    ) {
      cnt += tryComb2(records, rcOffset + n + 1, numbers, nbOffset + 1, cache);
    }
  }
  cache[cacheKey] = cnt;
  return cnt;
};

let res = 0;
all.forEach((line, i) => {
  const cnt = tryComb2(line.records, 0, line.numbers, 0, {});
  //   console.log(`${i}: ${line.raw} - ${cnt}`);
  res += cnt;
});
console.log(res);
