<template>
    <header>
        <button type="button" @click="doStartGame">开始游戏</button>
        <div class="flex" @change="onLevelChange">
            <label v-for="(config, key) in Levels" :key="key">
                <input type="radio" name="level" :value="key" v-model="level" />
                {{ key }}
            </label>
        </div>
        <div>
            <strong>{{ time }} s</strong>  /
            <span>最佳纪录： {{ store.records[level] !== 0 ? store.records[level] : '暂无' }}</span>
        </div>
    </header>

    <div id="game-grid" :class="{'game-over' : isGameOver}" :style="gridStyle">
        <grid-item 
            v-for="(item,index) in grid" 
            ref="gridItems"
            class="grid-item" 
            :count="item.count" 
            :is-bomb="item.isBomb"
            @open="onItemOpen(item,index)"
            @flag="onItemFlag(item,index)"
            @open-all="onItemOpenAll(item,index)"
        >
            {{ item ? 1 : '' }}
        </grid-item>
    </div>
</template>

<script setup>
import { ref , computed} from 'vue'
import GridItem from '../components/grid-item.vue'
import JSConfetti from 'js-confetti'
import { Levels } from '../data'
import { useStore } from '../store/counter'

const store = useStore();

let isRealStart = false  //判断用户是否有过点击
let interval   //计时器
const level = ref('Easy')
const row = ref(10)
const column = ref(10)
const bombNum = ref(10)
const isGameOver = ref(false)
const grid = ref(null)
const gridItems = ref()
const opened = ref(0)  //计数器
const time = ref(0)
const isSuccess = ref(false)
const isFail = ref(false)
const total = computed(() => {
    return row.value * column.value
})



const gridStyle = computed(() => {
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
function onItemFlag(item,index) {

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

//监听难度选择
function onLevelChange() {
    console.log(level.value)
    console.log(Levels['Easy'])
    row.value = Levels[level.value].row
    column.value = Levels[level.value].column
    bombNum.value = Levels[level.value].bombNum
    doStartGame(true)
}

doStartGame();
</script>

<!-- <style scoped>
/* 相当于全局变量 */
:root {
    --row: 10;
    --column: 10;
}
#game-grid {
    /* 布局模式 */
    display:grid;
    /* 重复10行 */
    grid-template-rows: repeat(var(--row),2rem); 
    grid-template-columns: repeat(var(--column),2rem);
}

header, .flex {
    display: flex;
}


.game-over {
    /* 禁止用户鼠标事件 */
    pointer-events: none;
}

.grid-item {
    border: solid 1px #eee;
    justify-content: center;
    display: flex;
    cursor: pointer;
    align-items: center;
}

.grid-item:not(.opened) {
    background-color: #ddd;
    border-top-color: #eee;
    border-left-color: #eee;
    border-right-color: #ccc;
    border-bottom-color: #ccc;
}
</style> -->