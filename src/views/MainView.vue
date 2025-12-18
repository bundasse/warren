<script setup>
import { ref } from 'vue';

const comment = ref([{idx:1, text:'ssss', writer:'토끼파행동대장'}])
const txtName = ref('')
const txtPassword = ref('')
const txtContents = ref('')
</script>

<template>
  <div class="row h-100">
    <div class="col-3">
      WARREN
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
      <div>
        <label for="txtName">이름</label>
        <input type="text" id="txtName" v-model="txtName">
        <label for="txtName">비밀번호</label>
        <input type="text" id="txtPassword" v-model="txtPassword">
        <label for="txtContents"></label>
        <textarea name="" id="txtContents" v-model="txtContents"></textarea>
      </div>
    </div>
  </div>
</template>
