<script setup>
/**
 * 뜨개(Yarn) 페이지.
 * 원래 한 줄짜리 껍데기였던 페이지를 최소 구성으로 채웠다.
 * 완성작 목록은 나중에 컬렉션을 추가해 확장할 수 있도록 안내만 둔다.
 */
const works = [
  {
    title: '머플러',
    yarn: '울 100% · 4.0mm',
    note: '처음 끝까지 완성한 작품. 게이지가 울퉁불퉁하지만 애착이 간다.',
  },
  {
    title: '손목 워머',
    yarn: '아크릴 혼방 · 3.5mm',
    note: '남은 실로 만든 빠른 프로젝트. 선물용으로 여러 개 떴다.',
  },
]

const tools = ['4.0mm 대바늘', '3.5mm 코바늘', '돗바늘', '줄자', '실 절단기']
</script>

<template>
  <div class="yarnView">
    <div class="viewHeader">
      <h3 class="viewTitle">
        <i class="bx bx-price-tag-alt"></i>
        Knit · 뜨개
      </h3>
      <a class="outLink" href="https://buttersc.one/@couque_dasse" target="_blank" rel="noopener">
        <i class="bx bx-planet"></i>
        진행 기록 보기
      </a>
    </div>

    <p class="intro">
      실과 바늘로 만든 것들을 모아두는 페이지입니다. 작품 사진은 차차 채워나갈 예정이에요.
    </p>

    <ul class="workList">
      <li v-for="work in works" :key="work.title" class="workItem">
        <div class="workHead">
          <h4 class="workTitle">{{ work.title }}</h4>
          <span class="workYarn">{{ work.yarn }}</span>
        </div>
        <p class="workNote">{{ work.note }}</p>
      </li>
    </ul>

    <section class="toolSection">
      <h4 class="toolTitle">자주 쓰는 도구</h4>
      <ul class="toolList">
        <li v-for="tool in tools" :key="tool">{{ tool }}</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.yarnView {
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
  overflow-y: auto;
}

.viewHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.viewTitle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-weight: 600;
}

.outLink {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--bg-color);
}

.outLink:hover {
  text-decoration: underline;
}

.intro {
  font-size: 13px;
  color: #555;
  line-height: 1.7;
}

.workList {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.workItem {
  border: 1px solid rgb(247, 212, 125);
  background: #fffdf6;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.workHead {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.workTitle {
  font-size: 14px;
  font-weight: 600;
}

.workYarn {
  font-size: 11px;
  color: #999;
}

.workNote {
  font-size: 12px;
  line-height: 1.7;
  color: #555;
}

.toolSection {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.toolTitle {
  font-size: 13px;
  font-weight: 600;
}

.toolList {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.toolList li {
  font-size: 11px;
  padding: 3px 10px;
  border: 1px solid rgb(247, 212, 125);
  border-radius: 999px;
  color: #666;
}
</style>
