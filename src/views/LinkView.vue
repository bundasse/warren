<script setup>
import { ref } from 'vue';
const banners = ref([{link:'',img:''}])
const isAdmin = ref(true)
</script>
<template>
    <div>
        <div v-if="isAdmin">
            <label for="txtLink">링크주소</label>
            <input type="text" id="txtLink">
            <label for="txtImg">이미지주소</label>
            <input type="text" id="txtImg">
            <button><i class="bx bx-plus"></i>추가</button>
        </div>
        <div class="myBanner">
            <img src="" alt="">
            <div>
                <span>image Link: </span>
                <button><i class="bx bx-clip"></i></button>
                <button><i class="bx bx-clipboard-code"></i></button>
            </div>
        </div>
        <div class="bannerList">
            <div v-for="(e,i) in banners" :key="i">
                <img :src="e.link" :alt="e.img">
            </div>
        </div>
    </div>
</template>