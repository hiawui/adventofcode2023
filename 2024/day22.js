import { runWithInput } from '../common/input.js'

const parseInput = (input) => {
  return input
    .split('\n')
    .filter((v) => v.length > 0)
    .map((v) => BigInt(v))
}

const pseudorandom = (n, t, cache) => {
  const mod = 16777216n - 1n
  const diffs = []
  let res = n
  for (let i = 1; i <= t; ++i) {
    let res0 = res
    res0 = ((res0 << 6n) ^ res0) & mod
    res0 = ((res0 >> 5n) ^ res0) & mod
    res0 = ((res0 << 11n) ^ res0) & mod
    if (cache) {
      const c = res0 % 10n
      diffs.push(c - (res % 10n))
      if (diffs.length > 4) {
        diffs.splice(0, diffs.length - 4)
      }
      if (diffs.length === 4) {
        const k = diffs.join('')
        if (c > 0 && !(k in cache)) {
          cache[k] = c
        }
      }
    }
    res = res0
  }
  return res
}

runWithInput(
  // part 1
  async (input) => {
    let result = 0n
    parseInput(input).forEach((n) => {
      result += pseudorandom(n, 2000)
    })
    return result
  },
  // part 2
  async (input) => {
    const keys = {}
    const caches = []
    parseInput(input).forEach((n) => {
      const cache = {}
      caches.push(cache)
      pseudorandom(n, 2000, cache)
      Object.keys(cache).forEach((k) => (keys[k] = 1))
    })
    const max = {
      seq: '',
      v: 0n,
    }
    for (const k of Object.keys(keys)) {
      let v = 0n
      caches.forEach((cache) => {
        v += cache[k] || 0n
      })
      if (v > max.v) {
        max.seq = k
        max.v = v
      }
    }
    return max.v
  },
  2024,
  22
)
