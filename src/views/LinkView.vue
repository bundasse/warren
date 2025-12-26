<script setup>
import { ref } from 'vue';
const banners = ref([{link:'',img:''}])
const isAdmin = ref(true)
const txtLinkValue = ref('')
const txtImgValue =ref('')

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
function addBanner() {
    const data = {
        img : txtImgValue.value,
        link: txtLinkValue.value
    }

    txtImgValue.value = '';
    txtLinkValue.value = '';
}
</script>
<template>
    <div>
        <div v-if="isAdmin">
            <label for="txtLink">링크</label>
            <input type="text" id="txtLink" v-model="txtLinkValue">
            <label for="txtImg">이미지</label>
            <input type="text" id="txtImg" v-model="txtImgValue">
            <button @click="addBanner"><i class="bx bx-plus"></i>추가</button>
        </div>
        <div class="myBanner">
            <img src="내배너" alt="">
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