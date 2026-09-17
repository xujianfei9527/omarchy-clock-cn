// Chinese statutory holiday and makeup-workday data for the calendar panel.
// Runtime updates come from NateScarlet/holiday-cn, whose records link back
// to the State Council notices. Keep the current year's official schedule
// bundled so the calendar remains useful while offline.

var BUNDLED_2026 = [
  ["2026-01-01", "元旦", true],
  ["2026-01-02", "元旦", true],
  ["2026-01-03", "元旦", true],
  ["2026-01-04", "元旦", false],
  ["2026-02-14", "春节", false],
  ["2026-02-15", "春节", true],
  ["2026-02-16", "春节", true],
  ["2026-02-17", "春节", true],
  ["2026-02-18", "春节", true],
  ["2026-02-19", "春节", true],
  ["2026-02-20", "春节", true],
  ["2026-02-21", "春节", true],
  ["2026-02-22", "春节", true],
  ["2026-02-23", "春节", true],
  ["2026-02-28", "春节", false],
  ["2026-04-04", "清明节", true],
  ["2026-04-05", "清明节", true],
  ["2026-04-06", "清明节", true],
  ["2026-05-01", "劳动节", true],
  ["2026-05-02", "劳动节", true],
  ["2026-05-03", "劳动节", true],
  ["2026-05-04", "劳动节", true],
  ["2026-05-05", "劳动节", true],
  ["2026-05-09", "劳动节", false],
  ["2026-06-19", "端午节", true],
  ["2026-06-20", "端午节", true],
  ["2026-06-21", "端午节", true],
  ["2026-09-20", "国庆节", false],
  ["2026-09-25", "中秋节", true],
  ["2026-09-26", "中秋节", true],
  ["2026-09-27", "中秋节", true],
  ["2026-10-01", "国庆节", true],
  ["2026-10-02", "国庆节", true],
  ["2026-10-03", "国庆节", true],
  ["2026-10-04", "国庆节", true],
  ["2026-10-05", "国庆节", true],
  ["2026-10-06", "国庆节", true],
  ["2026-10-07", "国庆节", true],
  ["2026-10-10", "国庆节", false]
]

function indexDays(days) {
  var indexed = {}
  if (!Array.isArray(days)) return indexed

  for (var i = 0; i < days.length; i++) {
    var source = days[i]
    var date = ""
    var name = ""
    var isOffDay = false

    if (Array.isArray(source)) {
      date = String(source[0] || "")
      name = String(source[1] || "")
      isOffDay = source[2] === true
    } else if (source && typeof source === "object") {
      date = String(source.date || "")
      name = String(source.name || "")
      isOffDay = source.isOffDay === true
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || name === "") continue
    indexed[date] = { name: name, isOffDay: isOffDay }
  }

  return indexed
}

function bundledYear(year) {
  return Number(year) === 2026 ? indexDays(BUNDLED_2026) : {}
}

function parsePayload(raw) {
  try {
    var payload = JSON.parse(String(raw || ""))
    var year = Math.round(Number(payload.year))
    if (!isFinite(year) || year < 2000 || year > 2200 || !Array.isArray(payload.days))
      return { year: 0, days: {} }
    return { year: year, days: indexDays(payload.days) }
  } catch (e) {
    return { year: 0, days: {} }
  }
}

function marker(entry) {
  return entry ? (entry.isOffDay ? "休" : "班") : ""
}

function description(entry) {
  if (!entry) return ""
  return entry.name + (entry.isOffDay ? " · 放假" : " · 调休上班")
}

if (typeof module !== "undefined") {
  module.exports = {
    indexDays: indexDays,
    bundledYear: bundledYear,
    parsePayload: parsePayload,
    marker: marker,
    description: description
  }
}
