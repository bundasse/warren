/**
 * 날짜 관련 공통 유틸.
 *
 * 프로젝트 내부 규칙
 * - 화면에 보여주는 요일/월 이름은 사람이 읽는 값(0-based month는 사용하지 않음)
 * - 저장/비교에 쓰는 날짜 문자열은 항상 `YYYY-MM-DD` (zero-padding)
 */

export const WEEK_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

/** 숫자를 2자리 문자열로 만든다. pad2(9) === '09' */
export function pad2(value) {
  return String(value).padStart(2, '0')
}

/** Date 객체를 `YYYY-MM-DD` 문자열로 만든다. (내부용) */
function toDateKey(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

/** 오늘 날짜를 `YYYY-MM-DD` 문자열로 반환한다. */
export function todayKey() {
  return toDateKey(new Date())
}

/** 해당 연/월(1-based)의 마지막 날(28~31, 윤년 반영)을 반환한다. (내부용) */
function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate()
}

/**
 * 달력 셀 배치용 배열을 만든다.
 * 앞쪽 빈 칸은 null, 이후 1일~말일이 들어간다.
 * @param {number} year
 * @param {number} month 1-based
 * @returns {(number|null)[]}
 */
export function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month - 1, 1).getDay()
  const total = daysInMonth(year, month)
  const cells = Array.from({ length: firstDay }, () => null)
  for (let day = 1; day <= total; day += 1) {
    cells.push(day)
  }
  return cells
}

/**
 * 달력 셀 배열을 7개 단위(주)로 나눈다.
 * @param {(number|null)[]} cells
 * @returns {(number|null)[][]}
 */
export function chunkByWeek(cells) {
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }
  return weeks
}

/**
 * 연/월을 delta만큼 이동한다. (1-based month)
 * @param {number} year
 * @param {number} month 1-based
 * @param {number} delta
 */
export function addMonths(year, month, delta) {
  const base = new Date(year, month - 1 + delta, 1)
  return { year: base.getFullYear(), month: base.getMonth() + 1 }
}

/** 표시용 날짜/시간 문자열을 만든다. */
export function formatDateTime(value) {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ${pad2(
    date.getHours(),
  )}:${pad2(date.getMinutes())}`
}
