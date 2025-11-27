<script setup>
import { ref } from 'vue';
const banners = ref([{link:'',img:''}])
const isAdmin = ref(true)

function copyCode(type) {
    let val = ''
    if(type == 'link'){
        val = 'http://img.gif'
    }else if(type == 'script'){
        val = '<a href =""></a>'
    }
    navigator.clipboard.writeText(val)
    .then(() => {
        alert('클립보드에 복사되었습니다.');
    })
    
}
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
                <button @click="copyCode('link')"><i class="bx bx-clip"></i></button>
                <button @click="copyCode('script')"><i class="bx bx-clipboard-code"></i></button>
            </div>
        </div>
        <div class="bannerList">
            <div v-for="(e,i) in banners" :key="i">
                <img :src="e.link" :alt="e.img">
            </div>
        </div>
    </div>
</template>