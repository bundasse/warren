<script setup>
import { ref, computed } from 'vue';
import ReviewComponent from '@/components/ReviewComponent.vue';
import ReviewWriteComponent from '@/components/ReviewWriteComponent.vue';

const monthList = [
    { name: 'January', days:31},
    { name: 'Febrary', days:28},
    { name: 'March', days:31},
    { name: 'April', days:30},
    { name: 'May', days:31},
    { name: 'June', days:30},
    { name: 'July', days:31},
    { name: 'August', days:31},
    { name: 'Septemper', days:30},
    { name: 'October', days:31},
    { name: 'November', days:30},
    { name: 'December', days:31},
];
const weekDay = [{name:'SUN'},{name:'MON'},{name:'TUE'},{name:'WED'},{name:'THU'},{name:'FRI'},{name:'SAT'}]
const today = new Date();
const year = today.getFullYear()
const month = today.getMonth()
const date = today.getDate()
const nowMonth = ref(month)
const nowYear = ref(year)
const selectedDate = ref(year+'-'+month+'-'+date)

function setMonth(value) {
    if(nowMonth.value == 11 && value == 1){
        nowYear.value += 1
        nowMonth.value = 0
    }
    else if(nowMonth.value == 0 && value == -1){
        nowYear.value -= 1
        nowMonth.value = 11
    }else{
         nowMonth.value = nowMonth.value + Number(value);
    }
}

const getDateArray = computed(() => {
    const firstDate =  new Date(nowYear.value + '-' + (nowMonth.value+1)+'-01')
    const firstDay = firstDate.getDay()
    let arr = []
    for(let i=0 ; i<firstDay; i++){
        arr.push(null)
    }
    for(let i=0; i<monthList[nowMonth.value].days; i++){
        arr.push((i+1).toString())
    }
    return arr
})

function getWeekFontColor(num) {
    switch (num) {
        case 0:
            return 'color: red';
        case 6:
            return 'color: blue';
        default:
            return 'color: black';
    }
}

function calendarDate(weeknum, daynum) {
    return getDateArray.value[(weeknum-1)*7 + (daynum-1)] == null? '': getDateArray.value[(weeknum-1)*7 + (daynum-1)]
}

function setDate(y,m,d) {
    selectedDate.value = y+'-'+m+'-'+d;
}
</script>
<template>
    <div>
        <div class="d-flex reviewViewWrapper">
            <div class="calendarWrapper">
                <div class="d-flex calendarController">
                    <div class="d-flex">
                        <h3>{{ nowMonth+1 }}</h3>
                        <div class="d-flex flex-column">
                            <span>{{ nowYear }}</span>
                            <span>
                                {{ monthList[nowMonth].name }}
                            </span>
                        </div>
                    </div>
                    <div class="d-flex calendarButton">
                        <button @click="setMonth(-1)" class="btnCalendar">◀</button>
                        <button @click="setMonth(+1)" class="btnCalendar">▶</button>
                    </div>
                </div>
        
                <table class="calendarTable">
                    <thead>
                        <tr>
                            <td v-for="daynum in 7" :key="daynum">
                                <span :style="getWeekFontColor(daynum-1)">
                                    {{ weekDay[(daynum-1)].name }}
                                </span>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="weeknum in Math.ceil(getDateArray.length /7)" :key="weeknum">
                            <td v-for="daynum in 7" :key="daynum">
                                <div style="height: 100%;" :style="((calendarDate(weeknum,daynum) == date) && (nowMonth == month) && (nowYear == year)) && 'background: cornsilk;'" @click="setDate(nowYear,nowMonth,calendarDate(weeknum,daynum))">
                                    <span style="font-size: 14px;">
                                        {{ calendarDate(weeknum,daynum) }}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <ReviewWriteComponent v-if="selectedDate == (year+'-'+month+'-'+date)"/>
            <ReviewComponent v-else />
        </div>
    </div>
</template>

<style>

.reviewViewWrapper{
    gap: 20px;
}
.calendarWrapper{
    width: 400px;
}
.calendarController{
    justify-content: space-between;
    align-items: end;
}

.calendarButton{
    gap:8px;
}
.calendarButton .btnCalendar{
    padding: 2px 12px;
    outline: none;
    box-shadow: none;
    border: 0;
    border-radius: 4px;
    background:var(--bg-color);
    color: gold;
}

.calendarTable{
    width: 100%;
    border-collapse: collapse;
}
.calendarTable thead td{
    background-color: rgb(247, 212, 125);
    padding: 4px 2px;
    text-align: center;
    font-size: 14px;

}
.calendarTable thead td span{
    font-weight: 600;

}
.calendarTable tbody tr,td{
    border:1px solid rgb(247, 212, 125);

}
.calendarTable tbody td{
    width: 14%;
    padding: 1px 2px;
    height: 54px;
}
</style>