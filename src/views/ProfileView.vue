<script setup>
/**
 * 프로필 페이지.
 * 원래 주석 처리돼 있던 라우트를 복구하고, 소개 섹션을 채웠다.
 */
const profileImage = 'https://placehold.co/160x160/4d7e41/ffffff?text=Dasse'

const activities = [
  {
    icon: 'bx-dice-5',
    title: 'TRPG',
    description: '시나리오를 쓰고 굴리는 것을 좋아합니다. 주로 판타지/미스터리 계열을 즐깁니다.',
  },
  {
    icon: 'bx-price-tag-alt',
    title: 'Knit',
    description:
      '실과 바늘로 천천히 무언가를 만드는 시간을 좋아합니다. 완성품은 뜨개 페이지에 정리합니다.',
  },
  {
    icon: 'bx-user-circle',
    title: 'OC',
    description: '직접 만든 캐릭터들의 설정과 그림을 모아둡니다. 낙서 페이지에서 만나볼 수 있어요.',
  },
]

// 기본 클래스: 기본 아이콘은 'bx', 브랜드 아이콘은 'bxl' (폰트가 다름)
const links = [
  { base: 'bxl', icon: 'bx-twitter-x', label: 'X (트위터)', url: 'https://x.com/couque_dasse' },
  {
    base: 'bx',
    icon: 'bx-planet',
    label: '연합우주(버터스콘)',
    url: 'https://buttersc.one/@couque_dasse',
  },
]
</script>

<template>
  <div class="profileView">
    <section class="profileHead">
      <img class="profilePic" :src="profileImage" alt="다스 프로필 이미지" />
      <div class="profileIntro">
        <h3 class="profileName">다스 Dasse</h3>
        <p class="profileTagline">그림 · 리뷰 · TRPG · 뜨개를 모아두는 개인 홈페이지</p>
        <ul class="profileLinks">
          <li v-for="link in links" :key="link.url">
            <a :href="link.url" target="_blank" rel="noopener">
              <i :class="[link.base, link.icon]"></i>
              {{ link.label }}
            </a>
          </li>
        </ul>
      </div>
    </section>

    <section class="profileContents">
      <article v-for="activity in activities" :key="activity.title" class="activity">
        <h4 class="activityTitle">
          <i class="bx" :class="activity.icon"></i>
          {{ activity.title }}
        </h4>
        <p class="activityText">{{ activity.description }}</p>
      </article>
    </section>
  </div>
</template>

<style scoped>
.profileView {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  overflow-y: auto;
}

.profileHead {
  display: flex;
  align-items: center;
  gap: 20px;
}

.profilePic {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 2px solid var(--bg-color);
  object-fit: cover;
  flex-shrink: 0;
}

.profileIntro {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.profileName {
  font-size: 22px;
  font-weight: 700;
}

.profileTagline {
  font-size: 13px;
  color: #555;
}

.profileLinks {
  display: flex;
  gap: 12px;
  margin-top: 2px;
}

.profileLinks a {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  border-bottom: 1px solid transparent;
}

.profileLinks a:hover {
  color: var(--bg-color);
  border-bottom-color: var(--bg-color);
}

.profileContents {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.activity {
  border: 1px solid rgb(247, 212, 125);
  background: #fffdf6;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.activityTitle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
}

.activityText {
  font-size: 12px;
  line-height: 1.7;
  color: #555;
}
</style>
