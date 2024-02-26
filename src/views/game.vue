<template>
    <div class="game-style">
    <header>
        <div class="back" @click="goBack">
            <img src="../assets/img/back.png" style="width: 60px; height: 60px;margin-left: 25px;margin-top: 25px;"/>
        </div>
        <div class="degree">
            难度<br/>
            <span style="font-size: 40px;">{{ level.name === 'Self' ? '`${level.row}` × `${level.column}`' : level.name }}</span>
        </div>
        <div class="bestRecord">
            最佳纪录<br/>
            <span style="font-size: 40px;">{{ store.records[level.name] !== 0 ? store.records[level.name] : '暂无' }}</span>
        </div>
        <div class="leftBombNum" >
            剩余雷数<br/>
            <span style="font-size: 40px;">{{ isGameOver ? 'GAME OVER' : leftBombNum }}</span>
        </div>
        <div class="number">
           {{ time }} 
        </div>
        <div class="rules">
            RULES: 
            <div>
                鼠标单击探查  右键单击标记地雷/取消标记
            <img src="../assets/img/horn.png" style="height: 20px;" />
            注意不要点开熊熊炸弹  
            <img src="../assets/img/bomb.png" style="height: 20px;" /> 
            </div>
        </div>
        <div class="restart" @click="doStartGame">
            <img src="../assets/img/restart.png" style="width: 60px;height: 60px;"/>
        </div>
    </header>
    <span>最佳纪录： {{ store.records[level] !== 0 ? store.records[level] : '暂无' }}</span>

    <div id="game-grid" :class="{'game-over' : isGameOver}" :style="gridStyle">
        <grid-item 
            v-for="(item,index) in grid" 
            ref="gridItems"
            class="grid-item" 
            :count="item.count" 
            :is-bomb="item.isBomb"
            @open="onItemOpen(item,index)"
            @flag="onItemFlag($event,item,index,)"
            @open-all="onItemOpenAll(item,index)"
        >
            {{ item ? 1 : '' }}
        </grid-item>
    </div>
    </div>
</template>

<script setup>
import { ref , computed} from 'vue'
import GridItem from '../components/grid-item.vue'
import JSConfetti from 'js-confetti'
import { Levels } from '../data'
import { useStore } from '../store/counter'
import router from '@/router'

const store = useStore();

let isRealStart = false  //判断用户是否有过点击
let interval   //计时器
const level = store.degree
console.log(level)
const row = ref(10)
const column = ref(10)
const bombNum = ref(10)
const isGameOver = ref(false)
const grid = ref(null)
const gridItems = ref([])
const opened = ref(0)  //计数器
const time = ref(0)
const isSuccess = ref(false)
const isFail = ref(false)
const total = computed(() => {
    return row.value * column.value
})
const leftBombNum = ref(bombNum.value)



const gridStyle = computed(() => {
    if(level === 'Easy') {
        const long = '5rem'
        return `--row:${row.value};--column:${column.value};--long:${long}`
    }
    else
        return `--row:${row.value};--column:${column.value}`
})

//成功的烟花
const jsConfetti = new JSConfetti()

// 另一种方法：将数组前n个值为1，其余为0，利用随机排序的方法即可获得
// a.sort(function () { return Math.random() > 0.5 ? 1 : -1})
function doStartGame() {
    opened.value = time.value = 0
    isSuccess.value = isFail.value = null
    isGameOver.value = isRealStart =  false
    leftBombNum.value = bombNum.value
    const arr = []
    for(let i = 0;i < total.value ; i++){
        arr.push(0)
    }
    grid.value = arr.map(() => {
        return {
            isBomb: false,
            count: 0,
        }
    })
    //重置每个小格子
    console.log(gridItems)
    if (event) {
        for (const item of gridItems.value) {
            item.reset()
        }
    }
}

//确保用户第一次点击不会踩雷
function doRealStartGame(clicked) {
    let bomb = bombNum.value
    while(1 && bomb){
        const index = Math.random() * total.value >> 0
        if (grid.value[index].isBomb || index === clicked) {
            continue;
        }
        grid.value[index].isBomb = true;
        bomb--;
    }
    grid.value.forEach((item , index) => {
        const x = index % column.value;
        const y = index / column.value >> 0; //双大于号是位运算，到0取整
        //判断周围雷的数量
        let count = 0;
        for(let i = Math.max(0,y-1); i < Math.min(y+2 , row.value) ; i++){
            for(let j = Math.max(x-1,0);j < Math.min(x+2, column.value) ; j++){
                if(grid.value[i * column.value + j].isBomb && !(i === y && j === x)){
                    count++;
                }
            }
        }
        item.count = count
    });
    isRealStart = true; 
    //开启计时器
    interval = setInterval(() => { 
        time.value += 1;
    }, 1000)
}

function stopGame(isWin = false) {
    isGameOver.value = true;
    clearInterval(interval)
    if (isWin) {
        isSuccess.value = isWin
        jsConfetti.addConfetti({
            confettiNumber : 500
        })
        if (time.value < store.records[level.value] || store.records[level.value] === 0) {
            store.setRecord(level.value, time.value)
        }
    } else {
        isFail.value = true
    }
}
function onItemOpen(item,index) {
    if (!isRealStart) {
        doRealStartGame(index)
    }
    //如果是雷，游戏结束
    if (grid.value[index].isBomb){
        //展开所有雷
        openAllBomb()   
        stopGame()
        return;
    }
    opened.value += 1
    if (opened.value >= total.value - bombNum.value){
        return stopGame(true)
    }
    //不是雷，调用递归开启方块
    openGridItem(item,index)
}

function openAllBomb() {
    grid.value.forEach((item,index) => {
        const gridItem = gridItems.value[index]
        if(item.isBomb) {
            gridItem.open()
        }
        else if(!item.isBomb && gridItem.isFlag){
            gridItem.noBombFlag()
        }
    })
}
function onItemFlag(num,item,index) {
    if(num) leftBombNum.value -= 1;
    else leftBombNum.value += 1;
}

function openGridItem(item,index) {
    if(item.count) {
        return;
    }
    const x = index % column.value
    const y = index / column.value >> 0

    for ( let i = Math.max(0,y-1); i < Math.min(y+2 , row.value);i++){
        for ( let j = Math.max(0,x-1);j < Math.min(x+2, column.value);j++){
            if (i === y && j ===x) continue
            const gridItem = gridItems.value[i * column.value + j]
            gridItem.open()
        }
    } 
}

//双击展开
function onItemOpenAll(item,index) {
    if (item.count === 0) return;
    const x = index % column.value
    const y = index / column.value >> 0
    const itemsToOpen = []
    let count = 0;
    for(let i = Math.max(0 , y-1); i < Math.min(y+2 , row.value); i++){
        for(let j = Math.max(0 , x-1); j < Math.min(x+2 , column.value); j++){
            if (i === x && j === y) continue
            const gridItem = gridItems.value[i * column.value + j]
            //判断是否插旗数与count相同，不然不允许展开
            if(gridItem.isFlag) {
                count++;
            } else {
                itemsToOpen.push(gridItem)
            }
        }
    }
    if (count === item.count) {
        for(const gridItem of itemsToOpen) {
            gridItem.open()
        }
    }
}

//返回主页
function goBack() {
    isRealStart = false  //判断用户是否有过点击
    clearInterval(interval)
    isGameOver.value = false
    grid.value = null
    gridItems.value = ''
    isSuccess.value = false
    isFail.value = false
    router.push('/')
}

//监听难度选择
function onLevelChange() {
    console.log(level.name)
    if(level.name === '') {
        router.push('/')
    }
    else if(level.name === 'Self'){
        row.value = level.row
        column.value = level.column
        bombNum.value = level.bombNum
    }
    else {
        row.value = Levels[level.name].row
        column.value = Levels[level.name].column
        bombNum.value = Levels[level.name].bombNum
    }
    doStartGame(true)
}

onLevelChange();
</script>

<style scoped>
.game-style {
    height: 100vh;
    /* background: url("../assets/img/gameBG.jpg") center center no-repeat;  */
    background-color: black;
    background-size: 100% 100%;
}
</style>