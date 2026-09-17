const assert = require("node:assert/strict")
const test = require("node:test")

const Holidays = require("../Holidays.js")

test("bundled 2026 schedule includes holidays and makeup workdays", () => {
  const days = Holidays.bundledYear(2026)

  assert.deepEqual(days["2026-09-25"], { name: "中秋节", isOffDay: true })
  assert.deepEqual(days["2026-09-20"], { name: "国庆节", isOffDay: false })
  assert.deepEqual(days["2026-10-10"], { name: "国庆节", isOffDay: false })
})

test("payload parser indexes valid upstream records", () => {
  const parsed = Holidays.parsePayload(JSON.stringify({
    year: 2027,
    days: [
      { name: "元旦", date: "2027-01-01", isOffDay: true },
      { name: "元旦", date: "2027-01-03", isOffDay: false },
      { name: "broken", date: "01-04", isOffDay: true }
    ]
  }))

  assert.equal(parsed.year, 2027)
  assert.equal(Object.keys(parsed.days).length, 2)
  assert.equal(Holidays.marker(parsed.days["2027-01-01"]), "休")
  assert.equal(Holidays.marker(parsed.days["2027-01-03"]), "班")
  assert.equal(Holidays.description(parsed.days["2027-01-03"]), "元旦 · 调休上班")
})

test("malformed payloads fail closed", () => {
  assert.deepEqual(Holidays.parsePayload("not json"), { year: 0, days: {} })
  assert.deepEqual(Holidays.bundledYear(2027), {})
})
