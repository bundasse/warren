<script setup>
import { ref } from 'vue'
const starValueArr = ref([false,false,false,false,false])

const txtTitleValue = ref('')
const txtHeadValue = ref('')
const txtContentsValue = ref('')

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
        <div>
            <label for="fileUpload">이미지</label><input type="file" name="" id="fileUpload">
        </div>
        <div>
            <label for="txtTitle"></label>
            <input type="text" name="" id="txtTitle" v-model="txtTitleValue" />
        </div>
        <div>
            <ul class="reviewStar">
                <li v-for="num in 5" :key="num"><div class="star" :style="starValueArr[num-1] == true ? 'color: goldenrod;':'color: lightgray;'" @click="setStar(num)">★</div></li>
            </ul>
        </div>
        <div>
            <input type="text" name="" id="txtHead" v-model="txtHeadValue">
            <textarea name="" id="txtContents" rows="5" v-model="txtContentsValue"></textarea>
        </div>
    </div>
</template>

<style>
.reviewStar{
    display: flex;
    gap: 4px;
}

.reviewStar .star{
    font-size: 28px;
    cursor: pointer;
}
</style>