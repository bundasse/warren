<script setup>
import { ref } from 'vue';

const comment = ref([{idx:1, text:'ssss', writer:'토끼파행동대장'}])
</script>

<template>
  <div class="row h-100">
    <div class="col-3">
      로고이미지 화면
    </div>
    <div class="col-3"></div>
    <div class="col-3">
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
