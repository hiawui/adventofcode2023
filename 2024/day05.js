import { runWithInput } from '../common/input.js'

const parseInput = (input) => {
  const rules = []
  const seqs = []
  let secPart = false
  for (const line of input.split('\n')) {
    if (!line) {
      secPart = true
      continue
    }
    if (!secPart) {
      const [a, b] = line.split('|')
      rules.push([a, b])
    } else {
      const m = {}
      line.split(',').forEach((n) => (m[`n${n}`] = n))
      seqs.push(m)
    }
  }
  return [rules, seqs]
}

const buildRuleMap = (rules, seqmap) => {
  const ruleMap = {}
  for (const [a, b] of rules) {
    if (`n${a}` in seqmap && `n${b}` in seqmap) {
      ruleMap[a] = ruleMap[a] || {}
      ruleMap[b] = ruleMap[b] || {}
      ruleMap[a][b] = 0
    }
  }
  let chg = 1
  while (chg > 0) {
    chg = 0
    for (const amap of Object.values(ruleMap)) {
      for (const bmap of Object.values(amap)) {
        for (const k in bmap) {
          if (!(k in amap)) {
            amap[k] = bmap[k]
            chg++
          }
        }
      }
    }
  }
  return ruleMap
}

runWithInput(
  // part 1
  async (input) => {
    const [rules, seqs] = parseInput(input)
    let res = 0
    for (const seqmap of seqs) {
      const rulemap = buildRuleMap(rules, seqmap)
      let ok = true
      const seqlist = Object.values(seqmap)
      for (let i = 0; i < seqlist.length - 1; ++i) {
        const curr = seqlist[i]
        const next = seqlist[i + 1]
        if (!(next in rulemap[curr])) {
          ok = false
          break
        }
      }
      if (ok) {
        res += Number(seqlist[Math.floor(seqlist.length / 2)])
      }
    }
    return res
  },
  // part 2
  async (input) => {
    const [rules, seqs] = parseInput(input)
    let res = 0
    for (const seqmap of seqs) {
      const rulemap = buildRuleMap(rules, seqmap)
      let ok = true
      const seqlist = Object.values(seqmap)
      for (let i = 0; i < seqlist.length - 1; ++i) {
        const curr = seqlist[i]
        const next = seqlist[i + 1]
        if (!(next in rulemap[curr])) {
          ok = false
          break
        }
      }
      if (ok) {
        continue
      }
      seqlist.sort(
        (a, b) =>
          Object.keys(rulemap[b]).length - Object.keys(rulemap[a]).length
      )
      res += Number(seqlist[Math.floor(seqlist.length / 2)])
    }
    return res
  },
  2024,
  5
)
