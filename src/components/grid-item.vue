<template>
    <div class="grid-item" @click="onClick" 
        :class="{'opened':isOpen}"
        @contextmenu="onRightClick"
        @dblclick="onDoubleClick"
    >
        <template v-if="isFlag">
            <img src="../assets/img/horn.png" style="width: 100%;"/>
        </template>
        <template v-else-if="flagNotBomb">
            <img src="../assets/img/flagNotBomb.png" style="width: 100%;height: 100%;"/>
        </template>
        <template v-else-if="isOpen">
            <template v-if="isBlast">
                <img src="../assets/img/bomb.png" style="width: 100%;height: 100%;background-color:#d7afc4;" />
            </template>
            <template v-else-if="isBomb">
                <img src="../assets/img/bomb.png" style="width: 100%;height: 100%;background-color:black;" />
            </template>
            <template v-else-if="count">
                <div color="white">
                    {{ count }}
                </div>
            </template>
            <template v-else>
                <div style="background-color: #3b3b3b;width: 100%;height: 100%;"></div>
            </template>
        </template>
    </div>
</template>

<script setup>
import { toRefs,ref } from 'vue';

const emit = defineEmits(['flag' , 'open' , 'openAll'])
const props = defineProps({
    count : Number,
    isBomb : Boolean,
})

const { count , isBomb } = toRefs(props)
//是否点开
const isOpen = ref(false)
//是否插旗
const isFlag = ref(false)
//插了旗但不是雷
const flagNotBomb = ref(false)
//炸了
const isBlast = ref(false)
function onClick() {
    open()
}

function open() {
    if(isOpen.value || isFlag.value) return;
    isOpen.value = true
    emit('open')
}

function onRightClick(event) {
    if(isOpen.value) return;
    //禁用浏览器默认操作
    event.preventDefault()
    isFlag.value = !isFlag.value
    emit('flag',isFlag.value)
}

function reset() {
    isFlag.value = false;
    isOpen.value = false;
    flagNotBomb.value = false;
    isBlast.value = false;
}

//双击操作
function onDoubleClick(event) {
    event.preventDefault()
    if(!isOpen.value) return;  //方块未展开
    emit('openAll')
}

function noBombFlag() {
    flagNotBomb.value = true
    isFlag.value = false
}

function blast() {
    isBlast.value = true
}
//将reset暴露给父组件
defineExpose({
    reset,open,isFlag,noBombFlag,blast
})
</script>

