import { runWithInput, parseInput } from '../common/input.js'

const [min, max] = [1, 3]
const isSafe = (diffs) => {
  let negCnt = 0
  let posCnt = 0
  for (const diff of diffs) {
    if (Math.abs(diff) < min || Math.abs(diff) > max) {
      return false
    }
    if (diff > 0) {
      negCnt++
    } else {
      posCnt++
    }
  }
  return negCnt * posCnt === 0
}

runWithInput(
  // part 1
  async (input) => {
    let safeCnt = 0
    for (const levels of parseInput((line) => line.split(/\s+/), input)) {
      const diffs = []
      for (let i = 1; i < levels.length; ++i) {
        const diff = levels[i] - levels[i - 1]
        diffs.push(diff)
      }
      if (isSafe(diffs)) {
        safeCnt++
      }
    }
    return safeCnt
  },
  // part 2
  async (input) => {
    let safeCnt = 0
    for (const levels of parseInput((line) => line.split(/\s+/), input)) {
      const diffs = []
      for (let i = 1; i < levels.length; ++i) {
        const diff = levels[i] - levels[i - 1]
        diffs.push(diff)
      }
      if (isSafe(diffs)) {
        safeCnt++
      } else if (isSafe(diffs.slice(1))) {
        safeCnt++
      } else if (isSafe(diffs.slice(0, diffs.length - 1))) {
        safeCnt++
      } else {
        for (let i = 0; i < diffs.length - 1; ++i) {
          const newDiffs = [...diffs.slice(0, i), ...diffs.slice(i + 1)]
          newDiffs[i] += diffs[i]
          if (isSafe(newDiffs)) {
            safeCnt++
            break
          }
        }
      }
    }
    return safeCnt
  },
  2024,
  2
)
