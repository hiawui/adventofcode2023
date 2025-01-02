import { runWithInput } from '../common/input.js'

const parseInput = (input) => {
  const btnRe = /^Button ([AB]): X\+(\d+), Y\+(\d+)$/
  const priRe = /^Prize: X=(\d+), Y=(\d+)$/
  const claws = []
  let claw = {}
  input
    .split('\n')
    .filter((l) => l.length > 0)
    .forEach((line) => {
      const btnMatch = btnRe.exec(line)
      if (btnMatch) {
        claw[btnMatch[1]] = [BigInt(btnMatch[2]), BigInt(btnMatch[3])]
        return
      }
      const priMatch = priRe.exec(line)
      if (priMatch) {
        claw['P'] = [BigInt(priMatch[1]), BigInt(priMatch[2])]
        claws.push(claw)
        claw = {}
        return
      }
    })
  return claws
}

runWithInput(
  // part 1
  async (input) => {
    const claws = parseInput(input)
    let tokens = BigInt(0)
    claws.forEach((claw) => {
      const { A: a, B: b, P: p } = claw
      const na = (b[0] * p[1] - b[1] * p[0]) / (b[0] * a[1] - b[1] * a[0])
      const nb = (p[0] - a[0] * na) / b[0]
      if (
        na >= 0 &&
        nb >= 0 &&
        a[0] * na + b[0] * nb == p[0] &&
        a[1] * na + b[1] * nb == p[1]
      ) {
        tokens += na * BigInt(3) + nb
      }
    })
    return tokens
  },
  // part 2
  async (input) => {
    const claws = parseInput(input)
    let tokens = BigInt(0)
    claws.forEach((claw) => {
      const { A: a, B: b, P: p } = claw
      p[0] += BigInt(10000000000000)
      p[1] += BigInt(10000000000000)
      const na = (b[0] * p[1] - b[1] * p[0]) / (b[0] * a[1] - b[1] * a[0])
      const nb = (p[0] - a[0] * na) / b[0]
      if (
        na >= 0 &&
        nb >= 0 &&
        a[0] * na + b[0] * nb == p[0] &&
        a[1] * na + b[1] * nb == p[1]
      ) {
        tokens += na * BigInt(3) + nb
      }
    })
    return tokens
  },
  2024,
  13
)
