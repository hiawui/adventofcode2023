import { runWithInput } from '../common/input.js'

const parseInput = (input) => {
  const [patternInput, designInput] = input
    .split(/\n{2,}/)
    .filter((l) => l.length > 0)
  const patterns = patternInput.split(/, */).filter((l) => l.length > 0)
  const designs = designInput.split('\n').filter((l) => l.length > 0)
  return [patterns, designs]
}

const testDesign = (cache, patterns, design, pos) => {
  if (pos >= design.length) {
    return true
  }
  const slice = design.slice(pos)
  const cached = cache[slice]
  if (cached !== undefined) {
    return cached
  }
  for (const p of patterns) {
    if (p.length > slice.length) {
      continue
    }
    if (slice.startsWith(p)) {
      if (testDesign(cache, patterns, design, pos + p.length)) {
        cache[slice] = true
        return true
      }
    }
  }
  cache[slice] = false
  return false
}

const testDesign2 = (cache, patterns, design, pos) => {
  if (pos >= design.length) {
    return 1
  }
  const slice = design.slice(pos)
  if (slice in cache) {
    return cache[slice]
  }
  let cnt = 0
  for (const p of patterns) {
    if (p.length > slice.length) {
      continue
    }
    if (slice.startsWith(p)) {
      cnt += testDesign2(cache, patterns, design, pos + p.length)
    }
  }
  cache[slice] = cnt
  return cnt
}

runWithInput(
  // part 1
  async (input) => {
    const [patterns, designs] = parseInput(input)
    const cache = {}
    let cnt = 0
    designs.forEach((d) => {
      if (testDesign(cache, patterns, d, 0)) {
        cnt++
      }
    })
    return cnt
  },
  // part 2
  async (input) => {
    const [patterns, designs] = parseInput(input)
    const cache = {}
    let cnt = 0
    designs.forEach((d) => {
      cnt += testDesign2(cache, patterns, d, 0)
    })
    return cnt
  },
  2024,
  19
)
