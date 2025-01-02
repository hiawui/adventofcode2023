import { runWithInput } from '../common/input.js'

const parseInput = (input) => {
  const locks = []
  const keys = []
  input
    .split(/\n{2,}/)
    .filter((l) => l.length)
    .forEach((e) => {
      const seq = [0, 0, 0, 0, 0]
      let islock = true
      const lines = e.split('\n')
      for (let i = 0; i < lines.length; ++i) {
        const line = lines[i]
        if (i === 0) {
          islock = line === '#####'
          continue
        } else if (i === lines.length - 1) {
          continue
        }
        for (let j = 0; j < line.length; ++j) {
          if (line[j] === '#') {
            seq[j]++
          }
        }
      }
      if (islock) {
        locks.push(seq)
      } else {
        keys.push(seq)
      }
    })
  return [locks, keys]
}

const isMatched = (lock, key) => {
  for (let i = 0; i < 5; ++i) {
    if (lock[i] + key[i] > 5) {
      return false
    }
  }
  return true
}

const findMatchCnt = (locks, keys) => {
  let matchCnt = 0
  for (let i = 0; i < locks.length; ++i) {
    for (let j = 0; j < keys.length; ++j) {
      if (isMatched(locks[i], keys[j])) {
        matchCnt++
      }
    }
  }
  return matchCnt
}

runWithInput(
  // part 1
  async (input) => {
    const [locks, keys] = parseInput(input)
    return findMatchCnt(locks, keys)
  },
  // part 2
  async (input) => {},
  2024,
  25
)
