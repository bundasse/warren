<script setup>
/**
 * 리뷰 읽기 전용 컴포넌트.
 * 선택한 날짜에 리뷰가 있으면 보여주고, 없으면 안내 문구를 보여준다.
 */
import { ref, watch } from 'vue'
import StarRating from '@/components/StarRating.vue'

const props = defineProps({
  review: { type: Object, default: null },
  dateLabel: { type: String, default: '' },
})

const imageError = ref(false)

watch(
  () => props.review,
  () => {
    imageError.value = false
  },
)
</script>

<template>
  <div class="reviewRead">
    <template v-if="review">
      <div class="reviewInfoWrapper">
        <div class="reviewThumb">
          <img
            v-if="review.imageUrl && !imageError"
            :src="review.imageUrl"
            :alt="review.title"
            @error="imageError = true"
          />
          <div v-else class="reviewThumbEmpty">
            <i class="bx bx-image-alt"></i>
          </div>
        </div>
        <div class="reviewInfo">
          <p class="reviewDate">{{ dateLabel }}</p>
          <h4 class="reviewTitle">{{ review.title || '제목 없음' }}</h4>
          <StarRating :model-value="Number(review.rating) || 0" readonly size="24px" />
        </div>
      </div>
      <div class="reviewContentsWrapper">
        <h5 class="reviewContentsTitle">{{ review.head }}</h5>
        <p class="reviewContentsText">{{ review.contents }}</p>
      </div>
    </template>
    <p v-else class="reviewEmpty">이 날짜에는 아직 리뷰가 없습니다.</p>
  </div>
</template>

<style scoped>
.reviewRead {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.reviewInfoWrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.reviewThumb {
  width: 160px;
  flex-shrink: 0;
}

.reviewThumb img {
  width: 100%;
  display: block;
  object-fit: cover;
}

.reviewThumbEmpty {
  height: 210px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed rgb(247, 212, 125);
  color: #bbb;
  font-size: 26px;
}

.reviewInfo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reviewDate {
  font-size: 12px;
  color: #999;
}

.reviewTitle {
  font-size: 22px;
  font-weight: 600;
}

.reviewContentsWrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.reviewContentsTitle {
  font-size: 14px;
  font-weight: 600;
}

.reviewContentsText {
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
  color: #444;
}

.reviewEmpty {
  font-size: 12px;
  color: #888;
  padding: 20px 0;
}
</style>
