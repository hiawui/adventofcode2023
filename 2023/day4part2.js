let input = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
`;
let cards = [];
input
  .split("\n")
  .filter((r) => r)
  .forEach((r) => {
    const [card, seqs] = r.split(/ *: */);
    const id = Number(card.split(/ +/)[1]);
    const [wins, has] = seqs.split(/ *\| */).map((seq) => {
      return seq.split(/ +/).flatMap((n) => {
        if (!n) {
          return [];
        } else {
          return [Number(n)];
        }
      });
    });
    cards.push({ id, wins, has, cnt: 1 });
  });

for (let i = 0; i < cards.length; ++i) {
  const card = cards[i];
  let cnt = 0;
  card.wins.forEach((w) => {
    if (card.has.includes(w)) {
      cnt++;
    }
  });
  for (let j = 1; j <= cnt; ++j) {
    const card1 = cards[i + j];
    if (!card1) {
      console.error(`out of range. ${i + j}`);
      break;
    }
    card1.cnt += card.cnt;
  }
}
cards.reduce((a, c) => a + c.cnt, 0);
