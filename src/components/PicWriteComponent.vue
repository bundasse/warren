<script setup>
import { ref } from 'vue';
const txtName= ref('')
const txtPassword = ref('')
const txtComments = ref('')

function saveCommand() {
    const data = {
        name: txtName.value,
        password: txtPassword.value,
        comment: txtComments.value
    }
    console.log(data)
}
function cancelCommand() {
    console.log('cancel');
}
</script>

<template>
    <div>
        <img src="https://placehold.co/900x280/orange/white" alt="" style="max-width: 500px;">
        <div>
            <div>
                <div>
                    <label for="txtPicName">이름</label>    
                    <input type="text" id="txtPicName" v-model="txtName">
                </div>
                <div>
                    <label for="txtPicPassword">비밀번호</label>
                    <input type="password" id="txtPicPassword" v-model="txtPassword">
                </div>
            </div>
            <div>코멘트</div>
            <textarea id="txtPicComments" v-model="txtComments"></textarea>
            <div class="d-flex buttons">
                <button @click="saveCommand">저장</button>
                <button @click="cancelCommand">취소</button>
            </div>
        </div>
    </div>
</template>