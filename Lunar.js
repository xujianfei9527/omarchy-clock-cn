// Offline Gregorian-to-Chinese-lunar conversion for calendar tooltips.
//
// The compact year table stores regular-month lengths, leap-month position,
// and leap-month length for 1900-2100. It was generated from the ICU Chinese
// calendar shipped on this system, then verified date-by-date against ICU.

var BASE_YEAR = 1900
var BASE_DATE_UTC = Date.UTC(1900, 0, 31)
var MS_PER_DAY = 86400000

var LUNAR_INFO = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, // 1900-1909
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x18da3, 0x095b0, 0x14977, // 1910-1919
  0x04970, 0x0a4b0, 0x1b0b6, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, // 1920-1929
  0x06566, 0x0d4a0, 0x0ea50, 0x16a95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, // 1930-1939
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, // 1940-1949
  0x06ca0, 0x0b550, 0x15355, 0x04db0, 0x025b0, 0x18573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, // 1950-1959
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, // 1960-1969
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, // 1970-1979
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x1ad47, 0x0ab60, 0x09570, // 1980-1989
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096e5, 0x092e0, // 1990-1999
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, // 2000-2009
  0x0a950, 0x0b4a0, 0x0bca4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x05270, 0x0a930, // 2010-2019
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4f0, 0x05260, 0x0ea65, 0x0d520, // 2020-2029
  0x0daa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, // 2030-2039
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, // 2040-2049
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, // 2050-2059
  0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, // 2060-2069
  0x092d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, // 2070-2079
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, // 2080-2089
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, // 2090-2099
  0x0d520 // 2100
]

var MONTH_NAMES = ["", "正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "冬月", "腊月"]
var DAY_DIGITS = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"]
var DAY_PREFIXES = ["初", "十", "廿", "三"]

function yearInfo(year) {
  var index = Number(year) - BASE_YEAR
  return index >= 0 && index < LUNAR_INFO.length ? LUNAR_INFO[index] : 0
}

function leapMonth(year) {
  return yearInfo(year) & 0xf
}

function leapDays(year) {
  if (leapMonth(year) === 0) return 0
  return (yearInfo(year) & 0x10000) !== 0 ? 30 : 29
}

function monthDays(year, month) {
  if (month < 1 || month > 12 || yearInfo(year) === 0) return 0
  return (yearInfo(year) & (0x10000 >> month)) !== 0 ? 30 : 29
}

function yearDays(year) {
  if (yearInfo(year) === 0) return 0
  var total = 348
  for (var mask = 0x8000; mask > 0x8; mask >>= 1)
    if ((yearInfo(year) & mask) !== 0) total++
  return total + leapDays(year)
}

function fromSolar(year, month, day) {
  var offset = Math.floor((Date.UTC(Number(year), Number(month), Number(day)) - BASE_DATE_UTC) / MS_PER_DAY)
  if (!isFinite(offset) || offset < 0) return null

  var lunarYear = BASE_YEAR
  while (lunarYear < BASE_YEAR + LUNAR_INFO.length) {
    var daysThisYear = yearDays(lunarYear)
    if (offset < daysThisYear) break
    offset -= daysThisYear
    lunarYear++
  }
  if (lunarYear >= BASE_YEAR + LUNAR_INFO.length) return null

  var leap = leapMonth(lunarYear)
  var lunarMonth = 1
  var isLeap = false

  while (lunarMonth <= 12) {
    var daysThisMonth = isLeap ? leapDays(lunarYear) : monthDays(lunarYear, lunarMonth)
    if (offset < daysThisMonth) break
    offset -= daysThisMonth

    if (leap === lunarMonth && !isLeap) {
      isLeap = true
    } else {
      isLeap = false
      lunarMonth++
    }
  }

  if (lunarMonth > 12) return null
  return {
    year: lunarYear,
    month: lunarMonth,
    day: offset + 1,
    isLeap: isLeap
  }
}

function dayName(day) {
  var value = Math.round(Number(day))
  if (value === 10) return "初十"
  if (value === 20) return "二十"
  if (value === 30) return "三十"
  if (value < 1 || value > 30) return ""
  return DAY_PREFIXES[Math.floor(value / 10)] + DAY_DIGITS[value % 10]
}

function description(year, month, day) {
  var lunar = fromSolar(year, month, day)
  if (!lunar) return ""
  return "农历" + (lunar.isLeap ? "闰" : "") + MONTH_NAMES[lunar.month] + dayName(lunar.day)
}

if (typeof module !== "undefined") {
  module.exports = {
    fromSolar: fromSolar,
    description: description,
    dayName: dayName,
    leapMonth: leapMonth,
    monthDays: monthDays,
    yearDays: yearDays
  }
}
