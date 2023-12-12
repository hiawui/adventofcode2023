input = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`;

let all = [];
input
  .split("\n")
  .filter((r) => r)
  .forEach((r) => {
    const [records, numbers] = r.split(/ +/);

    const line = {
      records: records.split("").filter((r) => r),
      numbers: [],
      brkCnt: 0,
      qmCnt: 0,
      ttlCnt: 0,
    };
    numbers.split(",").forEach((n) => {
      if (!n) {
        return;
      }
      const v = Number(n);
      line.numbers.push(v);
      line.ttlCnt += v;
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

let isMatch = (records, numbers) => {
  const tgtNumbers = [];
  let n = 0;
  for (const r of records) {
    if (r === "#") {
      n++;
    } else if (n > 0) {
      tgtNumbers.push(n);
      n = 0;
    }
  }
  if (n > 0) {
    tgtNumbers.push(n);
  }
  if (tgtNumbers.length != numbers.length) {
    return false;
  }
  for (const i in tgtNumbers) {
    if (tgtNumbers[i] != numbers[i]) {
      return false;
    }
  }
  return true;
};

let tryComb = (records, numbers, leftCnt, offset) => {
  if (leftCnt === 0) {
    return isMatch(records, numbers) ? 1 : 0;
  }
  const qmIdx = records.indexOf("?", offset);
  if (qmIdx < 0) {
    return 0;
  }
  const newRecords0 = [...records];
  newRecords0[qmIdx] = "#";
  let cnt = tryComb(newRecords0, numbers, leftCnt - 1, qmIdx + 1);
  cnt += tryComb(records, numbers, leftCnt, qmIdx + 1);
  return cnt;
};

let res = 0;
for (const line of all) {
  const cnt = tryComb(line.records, line.numbers, line.ttlCnt - line.brkCnt);
  res += cnt;
}
console.log(res);
