import { runWithInput, parseInput } from '../common/input.js'

runWithInput(
  // part 1
  async (input) => {
    let res = 0
    for (const line of parseInput((l) => l, input)) {
      const re = /mul\((\d{1,3}),(\d{1,3})\)/g
      for (let i = 0; i < line.length; ++i) {
        const matched = re.exec(line)
        if (!matched) {
          break
        }
        res += Number(matched[1]) * Number(matched[2])
      }
    }
    return res
  },
  // part 2
  async (input) => {
    let res = 0
    let enabled = true
    for (const line of parseInput((l) => l, input)) {
      const re = /mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't\(\)/g
      for (let i = 0; i < line.length; ++i) {
        const matched = re.exec(line)
        if (!matched) {
          break
        }
        if (matched[0].startsWith('mul') && enabled) {
          res += Number(matched[1]) * Number(matched[2])
        } else if (matched[0] == 'do()') {
          enabled = true
        } else if (matched[0].startsWith("don't")) {
          enabled = false
        }
      }
    }
    return res
  },
  2024,
  3
)
