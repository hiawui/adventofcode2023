import { runWithInput } from '../common/input.js'

const and = 'AND'
const xor = 'XOR'
const or = 'OR'

const parseInput = (input) => {
  const [init, eq] = input.split(/\n{2,}/)
  const vars = {}
  init
    .split('\n')
    .filter((v) => v.length > 0)
    .forEach((line) => {
      const [n, v] = line.split(/: */)
      vars[n] = Number(v)
    })
  const re = /^([^ ]+) +([^ ]+) +([^ ]+) +-> +([^ ]+)$/
  const equations = []
  eq.split('\n')
    .filter((v) => v.length > 0)
    .forEach((line) => {
      const matched = re.exec(line)
      if (!matched) {
        console.error(`error equation: ${line}`)
        return
      }
      const in0 = matched[1]
      const in1 = matched[3]
      const out = matched[4]
      vars[in0] = vars[in0]
      vars[in1] = vars[in1]
      vars[out] = vars[out]
      equations.push({
        op: matched[2],
        in: [in0, in1].sort(),
        out,
      })
    })
  return [vars, equations]
}

const run = (op, a, b) => {
  if (op === and) {
    return a & b
  } else if (op === or) {
    return a | b
  } else if (op === xor) {
    return a ^ b
  }
  throw new Error(`invalid op: ${op}`)
}

const calculate = (vars, equations) => {
  let calculated = 0
  do {
    calculated = 0
    equations.forEach((eq) => {
      const out = vars[eq.out]
      if (out !== undefined) {
        return
      }
      const in0 = vars[eq.in[0]]
      const in1 = vars[eq.in[1]]
      if (in0 === undefined || in1 === undefined) {
        return
      }
      vars[eq.out] = run(eq.op, in0, in1)
      calculated++
    })
  } while (calculated > 0)
}

const isZ = (oprand, zi) => {
  return oprand[0] === 'z' && Number(oprand.slice(1)) === zi
}

const checkCarryOr = (inopmap, maxZi, oprand, zi) => {
  const carryOr = inopmap[`${oprand},${or}`]
  if (!carryOr) {
    return [oprand]
  }
  if (zi === maxZi) {
    if (!isZ(carryOr.out, zi)) {
      return [carryOr.out]
    }
    return []
  }
  const results = []
  const carryXor = inopmap[`${carryOr.out},${xor}`]
  if (!carryXor) {
    results.push(carryOr.out)
  } else if (!isZ(carryXor.out, zi)) {
    results.push(carryXor.out)
  }
  checkXCarryAnd(inopmap, maxZi, carryOr.out, zi + 1).forEach((n) =>
    results.push(n)
  )
  return results
}

const checkXCarryAnd = (inopmap, maxZi, oprand, zi) => {
  const carryAnd = inopmap[`${oprand},${and}`]
  if (!carryAnd) {
    return [oprand]
  }
  return checkCarryOr(inopmap, maxZi, carryAnd.out, zi)
}

const findWrong = (equations) => {
  const inopmap = {}
  let maxZi = 0
  equations.forEach((eq) => {
    inopmap[`${eq.in[0]},${eq.op}`] = eq
    inopmap[`${eq.in[1]},${eq.op}`] = eq
    if (eq.out[0] === 'z') {
      maxZi = Math.max(maxZi, Number(eq.out.slice(1)))
    }
  })
  const wrong = {}
  equations.forEach((eq) => {
    if (eq.in[0][0] !== 'x') {
      return
    }
    if (eq.in[0] === 'x00') {
      if (eq.op === xor && !isZ(eq.out, 0)) {
        wrong[eq.out] = 1
        return
      }
      if (eq.op === and) {
        if (eq.out[0] === 'z') {
          wrong[eq.out] = 1
          return
        }
        const xor01 = inopmap[`${eq.out},${xor}`]
        if (!xor01) {
          wrong[eq.out] = 1
          return
        }
        if (!isZ(xor01.out, 1)) {
          wrong[xor01.out] = 1
          return
        }
        checkXCarryAnd(inopmap, maxZi, eq.out, 2).forEach((n) => (wrong[n] = 1))
      }
    } else {
      const xi = Number(eq.in[0].slice(1))
      if (eq.op === xor) {
        if (eq.out[0] === 'z') {
          wrong[eq.out] = 1
          return
        }
        const xor01 = inopmap[`${eq.out},${xor}`]
        if (!xor01) {
          wrong[eq.out] = 1
          return
        }
        if (!isZ(xor01.out, xi)) {
          wrong[xor01.out] = 1
          return
        }
        checkXCarryAnd(inopmap, maxZi, eq.out, xi + 1).forEach(
          (n) => (wrong[n] = 1)
        )
      } else if (eq.op === and) {
        if (eq.out[0] === 'z') {
          wrong[eq.out] = 1
          return
        }
        checkCarryOr(inopmap, maxZi, eq.out, xi + 1).forEach(
          (n) => (wrong[n] = 1)
        )
      }
    }
  })
  return wrong
}

runWithInput(
  // part 1
  async (input) => {
    const [vars, equations] = parseInput(input)
    calculate(vars, equations)
    return Object.keys(vars)
      .filter((k) => k[0] === 'z')
      .sort((a, b) => b.localeCompare(a))
      .map((k) => vars[k])
      .reduce((a, b) => a * 2 + b, 0)
  },
  // part 2
  async (input) => {
    const [_, equations] = parseInput(input)
    const wrongset = findWrong(equations)
    return Object.keys(wrongset).sort().join(',')
  },
  2024,
  24
)

/**
```mermaid
flowchart LR
	x0 --> xor0[xor]
	y0 --> xor0
	xor0 --> z0

	x0 --> and0[and]
	y0 --> and0

	x1 --> xor1[xor]
	y1 --> xor1

	x1 --> and1[and]
	y1 --> and1

	and0 --> xor01[xor]
	xor1 --> xor01

	and0 --> and01[and]
	xor1 --> and01

	xor01 --> z1

	and01 --> or1[or]
	and1 --> or1

	x2 --> xor2[xor]
	y2 --> xor2

	x2 --> and2[and]
	y2 --> and2

	or1 --> xor12[xor]
	xor2 --> xor12

	or1 --> and12[and]
	xor2 --> and12

	xor12 --> z2

	and12 --> or2[or]
	and2 --> or2
```
*/
