<template>
  <div class="notFound">
    <p class="code">404</p>
    <p class="message">찾을 수 없는 페이지입니다.</p>
    <RouterLink to="/" class="homeLink">
      <i class="bx bx-home"></i>
      방명록으로 돌아가기
    </RouterLink>
  </div>
</template>

<style scoped>
.notFound {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.code {
  font-size: 56px;
  font-weight: 700;
  color: var(--bg-color);
}

.message {
  font-size: 14px;
}

.homeLink {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  border: 1px solid black;
  font-size: 13px;
}
</style>
