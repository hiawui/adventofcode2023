import { runWithInput } from '../common/input.js'

const parseInput = (input) => {
  const robots = []
  const re = /^p=(\d+),(\d+) v=(-?\d+),(-?\d+)$/
  input
    .split('\n')
    .filter((l) => l.length > 0)
    .forEach((line) => {
      const m = re.exec(line)
      if (!m) {
        console.error(`invalid line: ${line}`)
        return
      }
      robots.push({
        p: [Number(m[1]), Number(m[2])],
        v: [Number(m[3]), Number(m[4])],
      })
    })
  return robots
}

const step = (width, height, robot) => {
  let nx = (robot.p[0] + robot.v[0] + width) % width
  let ny = (robot.p[1] + robot.v[1] + height) % height
  robot.p = [nx, ny]
}

const createmap = (width, height) => {
  const map = []
  for (let i = 0; i < height; ++i) {
    const row = []
    for (let j = 0; j < width; ++j) {
      row.push('.')
    }
    map.push(row)
  }
  return map
}

const buildmap = (map, robots) => {
  for (let i = 0; i < map.length; ++i) {
    const row = map[i]
    for (let j = 0; j < row.length; ++j) {
      if (row[j] !== '.') {
        row[j] = '.'
      }
    }
  }
  robots.forEach((r) => {
    const [x, y] = r.p
    map[y][x] = 'R'
  })
}

const printmap = (map, robots) => {
  buildmap(map, robots)
  console.log(map.map((r) => r.join('')).join('\n'))
}

/**
 *     R
 *    RRR
 *   RRRRR
 */
const findTreetop = (robots) => {
  const rmap = {}
  robots.forEach((r) => {
    const [x, y] = r.p
    rmap[`${x},${y}`] = [x, y]
  })
  for (const [x, y] of Object.values(rmap)) {
    let allmatched = true
    for (let i = 1; i <= 2; ++i) {
      for (let j = -i; j <= i; ++j) {
        if (!(`${x + j},${y + i}` in rmap)) {
          allmatched = false
          break
        }
      }
      if (!allmatched) {
        break
      }
    }
    if (allmatched) {
      return true
    }
  }
  return false
}

runWithInput(
  // part 1
  async (input) => {
    const width = 101
    const height = 103
    const robots = parseInput(input)
    for (let i = 0; i < 100; ++i) {
      robots.forEach((robot) => {
        step(width, height, robot)
      })
    }
    const rc = [0, 0, 0, 0]
    robots.forEach((robot) => {
      const [x, y] = robot.p
      if (x < width / 2 - 1 && y < height / 2 - 1) {
        rc[0]++
      } else if (x > width / 2 && y < height / 2 - 1) {
        rc[1]++
      } else if (x < width / 2 - 1 && y > height / 2) {
        rc[2]++
      } else if (x > width / 2 && y > height / 2) {
        rc[3]++
      }
    })
    return rc.reduce((a, b) => a * b, 1)
  },
  // part 2
  async (input) => {
    const width = 101
    const height = 103
    const map = createmap(101, 103)
    const robots = parseInput(input)
    for (let i = 0; i < 10000; ++i) {
      robots.forEach((robot) => {
        step(width, height, robot)
      })
      if (findTreetop(robots)) {
        printmap(map, robots)
        return i + 1
      }
    }
  },
  2024,
  14
)
