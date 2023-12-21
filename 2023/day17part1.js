
class Heap {
  constructor(comp, keyFn) {
    this.buff = [];
    this.map = {};
    this.comp = comp || ((a, b) => a - b);
    this.keyFn = keyFn || ((v) => v);
  }

  parent(i) {
    if (i === 0) {
      return [null, null];
    }
    const idx = Math.floor((i - 1) / 2);
    return [idx, this.buff[idx]];
  }

  children(i) {
    const j = i * 2;
    const left = j + 1;
    const right = j + 2;
    return [
      [left, left < this.buff.length ? this.buff[left] : null],
      [right, right < this.buff.length ? this.buff[right] : null],
    ];
  }

  goUp(i) {
    if (i <= 0 || i >= this.buff.length) {
      return;
    }
    const [prtIdx, prtValue] = this.parent(i);
    const value = this.buff[i];
    if (this.comp(prtValue, value) > 0) {
      this.buff[prtIdx] = value;
      this.buff[i] = prtValue;
      this.map[this.keyFn(value)] = prtIdx;
      this.map[this.keyFn(prtValue)] = i;
      this.goUp(prtIdx);
    }
  }

  goDown(i) {
    if (i < 0 || i > this.buff.length / 2) {
      return;
    }
    let childIdx = null;
    let childValue = null;
    const [[leftIdx, leftValue], [rigthIdx, rightValue]] = this.children(i);
    if (leftValue === null && rightValue === null) {
      return;
    } else if (leftValue !== null && rightValue !== null) {
      if (this.comp(leftValue, rightValue) < 0) {
        childIdx = leftIdx;
        childValue = leftValue;
      } else {
        childIdx = rigthIdx;
        childValue = rightValue;
      }
    } else {
      [childIdx, childValue] =
        leftValue != null ? [leftIdx, leftValue] : [rigthIdx, rightValue];
    }
    const value = this.buff[i];
    if (this.comp(value, childValue) > 0) {
      this.buff[childIdx] = value;
      this.buff[i] = childValue;
      this.map[this.keyFn(value)] = childIdx;
      this.map[this.keyFn(childValue)] = i;
      this.goDown(childIdx);
    }
  }

  push(v) {
    this.buff.push(v);
    this.map[this.keyFn(v)] = this.buff.length - 1;
    this.goUp(this.buff.length - 1);
  }
  pop() {
    if (this.buff.length === 0) {
      return null;
    }
    const top = this.buff[0];
    this.buff[0] = this.buff[this.buff.length - 1];
    this.buff.splice(this.buff.length - 1, 1);
    delete this.map[this.keyFn(top)];
    if (this.buff.length > 0) {
      this.map[this.keyFn(this.buff[0])] = 0;
      this.goDown(0);
    }
    return top;
  }
  update(orig, tgt) {
    const origKey = this.keyFn(orig);
    if (!(origKey in this.map)) {
      return;
    }
    const origIdx = this.map[origKey];
    this.buff[origIdx] = tgt;
    delete this.map[origKey];
    const tgtKey = this.keyFn(tgt);
    this.map[tgtKey] = origIdx;
    this.goDown(origIdx);
    const tgtIdx = this.map[tgtKey];
    this.goUp(tgtIdx);
  }
  find(v) {
    const k = this.keyFn(v);
    if (k in this.map) {
      return this.buff[this.map[k]];
    }
    return null;
  }
}

let maxI = null;
let maxJ = null;
let map = {};
input
  .split("\n")
  .filter((v) => v)
  .forEach((r, i) => {
    maxI = Number(i);
    maxJ = r.length - 1;
    for (let j = 0; j < r.length; ++j) {
      map[`${i},${j}`] = Number(r.charAt(j));
    }
  });

let disMap = new Heap(
  (a, b) => a.dis - b.dis,
  (v) => `${v.i},${v.j},${v.di},${v.dj},${v.dc}`
);
for (let i = 0; i <= maxI; ++i) {
  for (let j = 0; j <= maxJ; ++j) {
    for (const [di, dj] of [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ]) {
      for (let dc = 1; dc <= 3; ++dc) {
        disMap.push({ i, j, di, dj, dc, dis: Infinity });
      }
    }
  }
}
let cnt = 0;
let task = { i: 0, j: 0, dc: 0, dis: 0 };
do {
  cnt++;
  for (const [di, dj] of [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ]) {
    if (task.di === di && task.dj === dj && task.dc >= 3) {
      continue;
    } else if (task.di + di === 0 && task.dj + dj === 0) {
      continue;
    }
    const [ni, nj] = [task.i + di, task.j + dj];
    const nk = `${ni},${nj}`;
    if (!(nk in map)) {
      continue;
    }
    const dc = task.di === di && task.dj === dj ? task.dc + 1 : 1;
    const dis = task.dis + map[nk];
    const upd = disMap.find({ i: ni, j: nj, di, dj, dc });
    if (upd && dis < upd.dis) {
      disMap.update(upd, { ...upd, dis });
    }
  }

  task = disMap.pop();
  if (!task) {
    break;
  }
  if (task.i === maxI && task.j === maxJ) {
    break;
  }
} while (task);
if (task) {
  console.log(task.dis);
}
