<script setup>
/**
 * TRPG 페이지.
 * 직접 만든 툴과 시나리오를 백업해 두는 페이지. (Yarn 페이지와 같은 구성)
 */
const scenarios = [
  {
    title: '장서의 밤',
    system: 'CoC 7th',
    status: '완성',
    players: '3인',
    note: '폐관된 도서관에서 벌어지는 하룻밤. 핸드아웃 4종과 광기표 포함.',
  },
  {
    title: '겨울 편지',
    system: 'CoC 6th',
    status: '작업 중',
    players: '2인',
    note: '눈 내리는 산장에서의 추리극. NPC 대사와 엔딩 분기 정리 중.',
  },
]

const tools = [
  { name: '광기 카드 세트', description: '무작위 광기를 뽑을 수 있는 인쇄용 카드 모음.' },
  { name: '세션 제로 체크리스트', description: '세션 시작 전 확인할 항목을 정리한 문서.' },
  { name: '주사위 굴림 기록표', description: '세션 중 굴림 결과를 빠르게 적는 양식.' },
]
</script>

<template>
  <div class="trpgView">
    <div class="viewHeader">
      <h3 class="viewTitle">
        <i class="bx bx-dice-5"></i>
        TRPG
      </h3>
      <a class="outLink" href="https://buttersc.one/@couque_dasse" target="_blank" rel="noopener">
        <i class="bx bx-planet"></i>
        진행 기록 보기
      </a>
    </div>

    <p class="intro">
      직접 만든 시나리오와 툴을 백업해 두는 페이지입니다. 파일은 차차 정리해서 올릴 예정이에요.
    </p>

    <section class="section">
      <h4 class="sectionTitle">
        <i class="bx bx-book-content"></i>
        시나리오 백업
      </h4>
      <ul class="cardList">
        <li v-for="scenario in scenarios" :key="scenario.title" class="card">
          <div class="cardHead">
            <h5 class="cardTitle">{{ scenario.title }}</h5>
            <span class="status" :class="scenario.status === '완성' ? 'done' : 'wip'">
              {{ scenario.status }}
            </span>
          </div>
          <p class="cardMeta">{{ scenario.system }} · {{ scenario.players }}</p>
          <p class="cardNote">{{ scenario.note }}</p>
        </li>
      </ul>
    </section>

    <section class="section">
      <h4 class="sectionTitle">
        <i class="bx bx-cog"></i>
        만든 툴
      </h4>
      <ul class="toolList">
        <li v-for="tool in tools" :key="tool.name" class="toolItem">
          <i class="bx bx-file toolIcon"></i>
          <div class="toolText">
            <p class="toolName">{{ tool.name }}</p>
            <p class="toolDesc">{{ tool.description }}</p>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.trpgView {
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

.section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sectionTitle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
}

.cardList {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.card {
  border: 1px solid rgb(247, 212, 125);
  background: #fffdf6;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cardHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.cardTitle {
  font-size: 14px;
  font-weight: 600;
}

.status {
  flex-shrink: 0;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid;
}

.status.done {
  color: var(--bg-color);
  border-color: var(--bg-color);
}

.status.wip {
  color: #b08a2e;
  border-color: #e2c574;
}

.cardMeta {
  font-size: 11px;
  color: #999;
}

.cardNote {
  font-size: 12px;
  line-height: 1.7;
  color: #555;
}

.toolList {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.toolItem {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  border: 1px solid rgb(247, 212, 125);
  background: #fffdf6;
  padding: 8px 10px;
}

.toolIcon {
  font-size: 16px;
  color: #b08a2e;
  margin-top: 1px;
}

.toolText {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toolName {
  font-size: 12px;
  font-weight: 600;
}

.toolDesc {
  font-size: 11px;
  color: #666;
}
</style>
