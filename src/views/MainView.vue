<script setup>
import { ref } from 'vue';

const comment = ref([{idx:1, text:'ssss', writer:'토끼파행동대장'}])
</script>

<template>
  <div>
    <div class="">
      로고이미지 화면
    </div>
    <div class="">
      방명록
      <ul>
        <li v-for="(e,i) in comment" :key="i">
          <p>{{ e.writer }}</p>
          <div>
            {{ e.text }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
