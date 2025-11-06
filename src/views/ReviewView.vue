<script setup>
import { ref } from 'vue';

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

function setMonth(value) {
    nowMonth.value = nowMonth.value + Number(value);
}

function getWeekFontColor(num) {
    switch (num) {
        case 0:
            return 'red';
        case 6:
            return 'blue';
        default:
            return 'black';
    }
}
</script>
<template>
    <div>
        <div>
            <h3>{{ nowMonth+1 }}</h3>
            <div class="d-flex flex-column">
                <span>{{ year }}</span>
                <span>
                    {{ monthList[nowMonth].name }} {{ date }}
                </span>
            </div>
            <button @click="setMonth(-1)" class="btnCalendar">◀</button>
            <button @click="setMonth(+1)" class="btnCalendar">▶</button>
        </div>

        <table>
            <thead>
                <tr>
                    <td v-for="daynum in 7" :key="daynum">
                        <span :style="getWeekFontColor(daynum)">
                            {{ weekDay[daynum].name }}
                        </span>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td v-for="daynum in 7" :key="daynum">
                        
                        {{ daynum }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>