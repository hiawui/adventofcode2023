let input = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`;

let hands = [];
input
  .split("\n")
  .filter((r) => r)
  .forEach((r) => {
    const [cards, bid] = r.split(/ +/);
    hands.push({
      cards,
      bid: Number(bid),
    });
  });

let cards = ["J", "2", "3", "4", "5", "6", "7", "8", "9", "T", "Q", "K", "A"];
let cardMap = cards.reduce((m, v, i) => {
  m[v] = i;
  return m;
}, {});
let handOrder = (cards) => {
  const m = {};
  let jcnt = 0;
  cards.split("").forEach((c) => {
    if (c === "J") {
      jcnt++;
    } else {
      m[c] = m[c] || 0;
      m[c]++;
    }
  });
  const cnts = Object.values(m);
  cnts.sort((a, b) => b - a);
  if (cnts.length === 0) {
    return "5";
  }
  cnts[0] += jcnt;
  return cnts.join("");
};
hands.sort((a, b) => {
  const ha = handOrder(a.cards);
  const hb = handOrder(b.cards);
  if (ha < hb) {
    return -1;
  } else if (ha > hb) {
    return 1;
  } else {
    for (let i = 0; i < 5; ++i) {
      const ca = cardMap[a.cards.charAt(i)];
      const cb = cardMap[b.cards.charAt(i)];
      if (ca < cb) {
        return -1;
      } else if (ca > cb) {
        return 1;
      }
      continue;
    }
    return 0;
  }
});
console.log(hands.reduce((a, b, i) => a + b.bid * (i + 1), 0));
