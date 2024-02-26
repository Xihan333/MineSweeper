<template>
 <div class="self-card">
    <h2 class="title">自定义难度</h2>
    <div class="row-input">
        列数
        <input placeholder="请输入9-30的整数" v-model="row"/>
    </div>
    <div class="column-input">
        行数
        <input placeholder="请输入9-16的整数" v-model="column"/>
    </div>
    <div class="bomb-input">
        雷数
        <input placeholder="请输入少于row*column/2的整数" v-model="bombNum"/>
    </div>
    <input type="button" value="取消" class="cancelBtn" @click="emit('close')"/>
    <input type="button" value="确认" class="submitBtn" @click="selfSubmit"/> 
 </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from '@/store/counter';
import router from '@/router';

const row = ref()
const column = ref()
const bombNum = ref()

const store = useStore()
const emit = defineEmits(['close' ])

function selfSubmit() {
    if (row.value < 9 || row.value > 30) {
        alert('列数不符合规定')
        return
    }
    if (column.value < 9 || column.value > 16) {
        alert('行数不符合规定')
        return
    }
    if (bombNum.value < 0)  {
        alert('请输入正确的地雷数')
        return
    }
    else if ( bombNum.value > row.value*column.value/2 ) {
        alert('不建议雷数超过总格数的一半')
        return
    }

    store.setDegree('Self',column.value,row.value,bombNum.value)
    console.log(store.degree)
    router.push('/game')
    console.log()
    // emit('close')
}
</script>

<style scoped>
.self-card {
    color: #d7afc4;
    text-align: center;
    background-color: #050c32;
    border-radius: 5px;
    border: 2px solid #d7afc4;
    width: 500px;
    height: 350px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.row-input,.column-input,.bomb-input {
    font-size: 20px;
    margin: 20px;
}

.row-input input,.column-input input,.bomb-input input{
    width: 300px;
    height: 30px;
}

.cancelBtn {
    color: #050c32;
    width: 150px;
    height: 40px;
    border: 2px solid #d7afc4;
    border-radius: 5px;
    margin: 30px;
}

.submitBtn {
    width: 150px;
    height: 40px;
    background-color: #d7afc4;
    border-radius: 5px;
    margin: 30px;
}
</style>