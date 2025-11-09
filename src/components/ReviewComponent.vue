<script setup>
import { ref } from 'vue';
const reviewType = ref('0')

const starValueArr = ref([false,false,false,false,false])
function setStar(num) {
    let idx = num -1
    if(starValueArr.value[idx] == false){
        for(let i=0; i<=idx; i++){
            starValueArr.value[i] = true
        }
    }else{
        for(let i=4; i>idx; i--){
            starValueArr.value[i] = false
        }
    }
}
</script>
<template>
    <div>
        <div class="reviewInfoWrapper">
            <template v-if="reviewType == '0'"></template>
            <img src="https://placehold.co/200x280/orange/white" alt="" width="200" height="280">
            <div class="reviewInfo">
                <h4>Title</h4>
                <ul class="reviewStar">
                    <li v-for="num in 5" :key="num"><div class="star" :style="starValueArr[num-1] == true ? 'color: goldenrod;':'color: lightgray;'" @click="setStar(num)">★</div></li>
                </ul>
            </div>
        </div>
        <div class="reviewContentsWrapper">
            <h5 class="reviewContentsTitle"></h5>
            <p class="reviewContentsText"></p>
        </div>
    </div>
</template>

<style>
.reviewInfoWrapper{
    display: flex;
    flex-wrap: wrap;
}

.reviewInfo{
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.reviewInfo h4{
    font-size: 2rem;
    font-weight: 600;
}

.reviewStar{
    display: flex;
    gap: 4px;
}

.reviewStar .star{
    font-size: 28px;
    cursor: pointer;
}
</style>