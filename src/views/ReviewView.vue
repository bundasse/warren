<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { reviewApi } from '@/api'
import {
  MONTH_NAMES,
  WEEK_DAYS,
  addMonths,
  buildCalendarDays,
  chunkByWeek,
  pad2,
  todayKey,
} from '@/utils/date'
import ReviewComponent from '@/components/ReviewComponent.vue'
import ReviewWriteComponent from '@/components/ReviewWriteComponent.vue'
import PasswordModal from '@/components/PasswordModal.vue'
import { verifyAdminPassword } from '@/config/admin'

const today = todayKey()
const [todayYear, todayMonth] = today.split('-').map(Number)

const nowYear = ref(todayYear)
const nowMonth = ref(todayMonth) // 1-based
const selectedDate = ref(today)

const reviews = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const isWriting = ref(false)

const monthLabel = computed(() => MONTH_NAMES[nowMonth.value - 1])
const weeks = computed(() => chunkByWeek(buildCalendarDays(nowYear.value, nowMonth.value)))

/** dateKey -> review 매핑 (달력에 리뷰 있는 날을 표시하기 위함) */
const reviewByDate = computed(() => {
  const map = {}
  reviews.value.forEach((review) => {
    map[review.dateKey] = review
  })
  return map
})

const selectedReview = computed(() => reviewByDate.value[selectedDate.value] ?? null)

function dateKeyOf(day) {
  return `${nowYear.value}-${pad2(nowMonth.value)}-${pad2(day)}`
}

function changeMonth(delta) {
  const moved = addMonths(nowYear.value, nowMonth.value, delta)
  nowYear.value = moved.year
  nowMonth.value = moved.month
}

function isToday(day) {
  return dateKeyOf(day) === today
}

/** 썸네일 로드에 실패한 날짜 키 모음 */
const brokenThumbs = ref({})

function markThumbBroken(dateKey) {
  brokenThumbs.value = { ...brokenThumbs.value, [dateKey]: true }
}

/** 해당 날짜의 리뷰 (달력 셀 표시용) */
function reviewOf(day) {
  return reviewByDate.value[dateKeyOf(day)] ?? null
}

/** 달력 셀에 표시할 썸네일 URL. 이미지가 없거나 깨졌으면 빈 문자열 */
function thumbOf(day) {
  const key = dateKeyOf(day)
  const review = reviewByDate.value[key]
  if (!review?.imageUrl || brokenThumbs.value[key]) return ''
  return review.imageUrl
}

function selectDate(day) {
  if (!day) return
  selectedDate.value = dateKeyOf(day)
  isWriting.value = false
}

async function loadReviews() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    reviews.value = await reviewApi.list()
  } catch (error) {
    console.error('[review] 목록 조회 실패', error)
    errorMessage.value = '리뷰를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

function startWriting() {
  isWriting.value = true
}

function cancelWriting() {
  isWriting.value = false
}

async function onSaved() {
  isWriting.value = false
  await loadReviews()
}

/* 삭제: 사이트 주인 비밀번호를 확인한 뒤 삭제한다. */
const modalOpen = ref(false)
const modalError = ref('')

function openDeleteModal() {
  modalError.value = ''
  modalOpen.value = true
}

async function confirmDelete(password) {
  const review = selectedReview.value
  if (!review) return
  if (!verifyAdminPassword(password)) {
    modalError.value = '비밀번호가 일치하지 않습니다.'
    return
  }
  modalOpen.value = false
  try {
    await reviewApi.remove(review.id)
    await loadReviews()
  } catch (error) {
    console.error('[review] 삭제 실패', error)
    errorMessage.value = '삭제에 실패했습니다.'
  }
}

// 선택 날짜가 바뀌면 작성 모드를 해제한다.
watch(selectedDate, () => {
  isWriting.value = false
})

onMounted(loadReviews)
</script>

<template>
  <div class="reviewView">
    <div class="reviewViewWrapper">
      <div class="calendarWrapper">
        <div class="calendarController">
          <div class="calendarTitle">
            <h3>{{ nowMonth }}</h3>
            <div class="calendarSubTitle">
              <span>{{ nowYear }}</span>
              <span>{{ monthLabel }}</span>
            </div>
          </div>
          <div class="calendarButton">
            <button type="button" class="btnCalendar" @click="changeMonth(-1)">◀</button>
            <button type="button" class="btnCalendar" @click="changeMonth(1)">▶</button>
          </div>
        </div>

        <table class="calendarTable">
          <thead>
            <tr>
              <td v-for="(weekDay, index) in WEEK_DAYS" :key="weekDay">
                <span :class="`weekDay-${index}`">{{ weekDay }}</span>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(week, weekIndex) in weeks" :key="weekIndex">
              <td v-for="(day, dayIndex) in week" :key="dayIndex">
                <button
                  v-if="day"
                  type="button"
                  class="dayCell"
                  :class="{
                    today: isToday(day),
                    selected: dateKeyOf(day) === selectedDate,
                    hasReview: Boolean(reviewOf(day)),
                    hasThumb: Boolean(thumbOf(day)),
                  }"
                  @click="selectDate(day)"
                >
                  <img
                    v-if="thumbOf(day)"
                    class="dayThumb"
                    :src="thumbOf(day)"
                    alt=""
                    @error="markThumbBroken(dateKeyOf(day))"
                  />
                  <span class="dayNumber">{{ day }}</span>
                  <i v-if="reviewOf(day) && !thumbOf(day)" class="bx bxs-star dayStar"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="detail">
        <p v-if="isLoading" class="detailMessage">불러오는 중…</p>
        <p v-else-if="errorMessage" class="detailError">{{ errorMessage }}</p>

        <ReviewWriteComponent
          v-else-if="isWriting"
          :date-key="selectedDate"
          :date-label="selectedDate"
          :editing="selectedReview"
          @saved="onSaved"
          @cancel="cancelWriting"
        />

        <template v-else>
          <div class="detailHeader">
            <p class="detailDate">{{ selectedDate }}</p>
            <div class="detailButtons">
              <button v-if="selectedReview" type="button" class="btnGhost" @click="openDeleteModal">
                <i class="bx bx-trash"></i>
                삭제
              </button>
              <button type="button" class="btnPrimary" @click="startWriting">
                <i class="bx" :class="selectedReview ? 'bx-edit' : 'bx-plus'"></i>
                {{ selectedReview ? '수정' : '리뷰 쓰기' }}
              </button>
            </div>
          </div>
          <ReviewComponent :review="selectedReview" :date-label="selectedDate" />
        </template>
      </div>
    </div>

    <PasswordModal
      v-model:open="modalOpen"
      title="리뷰 삭제"
      message="리뷰를 삭제하려면 비밀번호를 입력하세요."
      confirm-text="삭제"
      :error="modalError"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.reviewView {
  height: 100%;
  min-height: 0;
}

.reviewViewWrapper {
  display: flex;
  gap: 20px;
  height: 100%;
}

.calendarWrapper {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.calendarController {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.calendarTitle {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.calendarTitle h3 {
  font-size: 22px;
  font-weight: 700;
  color: var(--bg-color);
}

.calendarSubTitle {
  display: flex;
  flex-direction: column;
  font-size: 11px;
  line-height: 1.3;
  color: #777;
}

.calendarButton {
  display: flex;
  gap: 8px;
}

.btnCalendar {
  padding: 2px 12px;
  border: 0;
  border-radius: 4px;
  background: var(--bg-color);
  color: gold;
  cursor: pointer;
}

.calendarTable {
  width: 100%;
  border-collapse: collapse;
}

.calendarTable thead td {
  background-color: rgb(247, 212, 125);
  padding: 4px 2px;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
}

.calendarTable thead td .weekDay-0 {
  color: red;
}

.calendarTable thead td .weekDay-6 {
  color: blue;
}

.calendarTable tbody td {
  width: 14%;
  padding: 0;
  height: 52px;
  border: 1px solid rgb(247, 212, 125);
}

.dayCell {
  position: relative;
  width: 100%;
  height: 100%;
  border: 0;
  background: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1px;
  color: inherit;
  overflow: hidden;
}

.dayCell:hover {
  background: #fffbe8;
}

.dayCell.today {
  background: cornsilk;
}

.dayCell.selected {
  background: var(--bg-color);
  color: gold;
}

/* 리뷰 이미지가 있는 날: 셀을 이미지로 채운다 (비율 유지 = contain) */
.dayCell.hasThumb {
  background: #fffaf0;
}

.dayThumb {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.dayCell.selected.hasThumb {
  background: #fffaf0;
  outline: 2px solid var(--bg-color);
  outline-offset: -2px;
}

.dayNumber {
  font-size: 13px;
}

/* 이미지 위에서는 날짜를 좌상단 배지로 띄워 가독성을 확보한다. */
.dayCell.hasThumb .dayNumber {
  position: absolute;
  top: 1px;
  left: 2px;
  z-index: 1;
  font-size: 11px;
  line-height: 1.3;
  padding: 0 3px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.8);
  color: #333;
}

.dayStar {
  font-size: 10px;
  color: goldenrod;
}

.dayCell.selected .dayStar {
  color: gold;
}

.detail {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detailHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid rgb(247, 212, 125);
  padding-bottom: 6px;
}

.detailDate {
  font-size: 13px;
  font-weight: 600;
}

.detailButtons {
  display: flex;
  gap: 8px;
}

.detailMessage,
.detailError {
  font-size: 12px;
}

.detailError {
  color: crimson;
}

.btnGhost,
.btnPrimary {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  border: 1px solid black;
  font-size: 12px;
  cursor: pointer;
}

.btnGhost {
  background: white;
}

.btnPrimary {
  background: var(--bg-color);
  border-color: var(--bg-color);
  color: gold;
  font-weight: 500;
}
</style>
