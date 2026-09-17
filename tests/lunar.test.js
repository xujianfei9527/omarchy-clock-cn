const assert = require("node:assert/strict")
const test = require("node:test")

const Lunar = require("../Lunar.js")

test("formats familiar lunar dates", () => {
  assert.equal(Lunar.description(2026, 1, 17), "农历正月初一")
  assert.equal(Lunar.description(2026, 8, 17), "农历八月初七")
  assert.equal(Lunar.description(2026, 8, 25), "农历八月十五")
})

test("marks leap lunar months", () => {
  assert.equal(Lunar.description(2023, 2, 22), "农历闰二月初一")
})

test("returns no label outside the supported range", () => {
  assert.equal(Lunar.description(1899, 11, 31), "")
})
