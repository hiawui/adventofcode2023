input = `jqt: rhn xhk nvd
rsh: frs pzl lsr
xhk: hfx
cmg: qnr nvd lhk bvb
rhn: xhk bvb hfx
bvb: xhk hfx
pzl: lsr hfx nvd
qnr: nvd
ntq: jqt hfx bvb xhk
nvd: lhk
lsr: lhk
rzs: qnr cmg lsr rsh
frs: qnr lhk lsr
`;
let map = {};
input
  .split("\n")
  .filter((v) => v)
  .forEach((r) => {
    const [id, cons] = r.split(/ *: */);
    const comp = (map[id] = map[id] || { id, merged: {}, cons: {} });
    cons.split(/ +/).forEach((c) => {
      comp.cons[c] = { id: c, w: 1 };
      const comp0 = (map[c] = map[c] || { id: c, merged: {}, cons: {} });
      comp0.cons[id] = { id, w: 1 };
    });
  });

let A = {};
do {
  const start = Object.values(map)[0];
  A[start.id] = start;
  let last = [null, null];
  do {
    const w = {};
    for (const n of Object.values(A)) {
      Object.values(n.cons).forEach((c) => {
        if (c.id in A) {
          return;
        }
        if (c.id in w) {
          w[c.id] += c.w;
        } else {
          w[c.id] = c.w;
        }
      });
    }
    if (Object.keys(w).length === 0) {
      break;
    }
    let max = [null, 0];
    Object.entries(w).forEach((e) => {
      if (max[1] < e[1]) {
        max = e;
      }
    });
    const curr = map[max[0]];
    A[curr.id] = curr;
    last.shift();
    last.push(curr);
  } while (Object.keys(A).length < Object.keys(map).length);
  const [last2, last1] = last;
  if (Object.values(last1.cons).reduce((v, c) => v + c.w, 0) <= 3) {
    const ttl = Object.values(A).reduce(
      (c, n) => c + 1 + Object.keys(n.merged).length,
      0
    );
    const cnt1 = Object.keys(last1.merged).length + 1;
    console.log(`ttl: ${ttl}, cnt1: ${cnt1}, res: ${(ttl - cnt1) * cnt1}`);
    break;
  }
  // 删除last2, last1的连接
  delete last2.cons[last1.id];
  delete last1.cons[last2.id];
  // 合并last1到last2
  delete A[last1.id];
  Object.assign(last2.merged, last1.merged);
  last2.merged[last1.id] = last1;
  // 合并其他点到last1, last2的连接
  for (const c of Object.values(last1.cons)) {
    const cnode = A[c.id];
    delete cnode.cons[last1.id];
    const c2 = (cnode.cons[last2.id] = cnode.cons[last2.id] || {
      id: last2.id,
      w: 0,
    });
    c2.w += c.w;
    if (c.id in last2.cons) {
      last2.cons[c.id].w = c2.w;
    } else {
      last2.cons[c.id] = { id: c.id, w: c2.w };
    }
  }
  map = A;
  A = {};
} while (Object.keys(map).length > 1);
