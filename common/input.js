import { get } from 'https'
import config from '../config.json' with { type: "json" }

export const readInput = (year, dayNo) => {
  const url = `https://adventofcode.com/${year}/day/${dayNo}/input`
  return new Promise((resolve, reject) => {
    get(
      url,
      {
        headers: {
          Cookie: config.cookie,
        },
      },
      (res) => {
        let body = []
        res.on('data', (chunk) => {
          body.push(chunk)
        })
        res.on('end', () => {
          resolve(body.join(''))
        })
      }
    ).on('error', (err) => {
      reject(err)
    })
  })
}

export const parseInput = function* (lineParser, input) {
  for (const line of input.split('\n')) {
    if (!line) {
      continue
    }
    yield lineParser(line)
  }
}

export const runWithInput = async (
  partOneCallback,
  partTwoCallback,
  year,
  dayNo
) => {
  try {
    const input = await readInput(year, dayNo)
    const t0 = Date.now()
    const p1 = await partOneCallback(input)
    const d0 = Date.now() - t0
    console.log(`[${d0}ms] part1: ${p1}`)
    const t1 = Date.now()
    const p2 = await partTwoCallback(input)
    const d1 = Date.now() - t1
    console.log(`[${d1}ms] part2: ${p2}`)
  } catch (err) {
    console.error(err)
  }
}
