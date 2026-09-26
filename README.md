# warren

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

> 이 프로젝트는 Vue 3 + Vite 기반의 개인 홈페이지입니다. 아래는 개편 이후의 구조와 운영 메모입니다.

---

## 프로젝트 구조

```
src/
  api/                 데이터 접근 계층 (mock ↔ Firestore 전환)
    index.js           단일 진입점. guestbookApi / picApi / reviewApi / bannerApi 노출
    mock.js            개발용 localStorage 백엔드
    firestore.js       실제 Firestore 백엔드
  components/
    PasswordModal.vue  비밀번호 확인 모달 (삭제/관리자 모드)
    StarRating.vue     별점 입력/표시 공용 컴포넌트
    PicWriteComponent.vue      낙서 작성/수정 폼
    ReviewComponent.vue        리뷰 읽기
    ReviewWriteComponent.vue   리뷰 작성/수정 폼
  utils/date.js        날짜 유틸 (YYYY-MM-DD 키, 달력 셀 계산)
  views/               MainView(방명록) / PicView / ReviewView / LinkView
                       / ProfileView / YarnView / NotFoundView
```

## 데이터 백엔드 전환 (mock → Firestore)

뷰는 `@/api`의 API 객체만 사용하므로, 백엔드를 바꿔도 뷰 코드는 수정할 필요가 없다.

1. Firebase 콘솔에서 프로젝트를 만들고 Firestore를 활성화한다.
2. `.env`에 실제 값을 채운다 (`.env.example` 참고).
   ```
   VITE_USE_MOCK=false
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
3. 개발 서버를 재시작한다.

`VITE_USE_MOCK`을 비워두면 Firebase 키가 채워졌는지 여부로 자동 판단한다.

## Firestore 컬렉션

| 컬렉션 | 필드 |
| --- | --- |
| `guestbook` | `name`, `password`, `comment`, `createdAt` |
| `pic` | `name`, `password`, `imageUrl`, `comment`, `createdAt`, `updatedAt` |
| `review` | `dateKey`(`YYYY-MM-DD`), `title`, `imageUrl`, `rating`, `head`, `contents`, `createdAt` |
| `banner` | `imageUrl`, `linkUrl`, `createdAt` |

### 보안 규칙 예시

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{collection}/{docId} {
      allow read: if true;
      allow create: if true;
      // 비밀번호를 모르면 수정/삭제하지 못하도록 하려면 서버 검증(Cloud Functions)이 필요하다.
      allow update, delete: if true;
    }
  }
}
```

> ⚠️ 현재 비밀번호 검증은 **클라이언트에서만** 이루어진다. 방문자가 임의로 수정/삭제 요청을 보낼 수 있으므로, 실제 공개 서비스로 운영할 때는 Cloud Functions 등 서버 검증을 추가하는 것을 권장한다.

## 이미지

별도 Storage 업로드 없이 **외부 이미지 URL**을 입력받는 방식이다. 깨진 이미지는 카드 안에 빈 자리표시자로 표시된다.

## 개발 메모

- mock 데이터를 비우려면 브라우저 콘솔에서 다음을 실행한다.
  ```js
  localStorage.clear() // 또는 devtools > Application > Local Storage에서 삭제
  ```
- 관리자/리뷰 삭제 비밀번호는 `LinkView.vue`, `ReviewView.vue`의 `ADMIN_PASSWORD` 상수다.

