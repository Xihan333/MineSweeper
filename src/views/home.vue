<template>
<div class="home">
    <div class="container">
      <div class="box" @click="goGame('Easy')">
        <img src="../assets/img/Esay.png" />
      </div>
      <div class="box" @click="goGame('Medium')">
        <img src="../assets/img/Medium.png" />
      </div>
      <div class="box" @click="goGame('Hard')">
        <img src="../assets/img/Hard.png" />
      </div>
      <div class="box">
        <img src="../assets/img/Self.png" />
      </div>
    </div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from '@/store/counter';
import router from '@/router';

const store = useStore()

function goGame(item) {
  store.setDegree(item)
  router.push('/game')
}
</script>

<style scoped>
.home {
  display: flex;
  /* justify-content: center; */
  /* align-items: center; */
  /* width: 100%; */
  height: 100vh;
  background: url("../assets/img/2.png") center center no-repeat;
  background-size: 100% 100%;
}.container {
  position: absolute;
  bottom: 100px;
  right: 150px;
}
.box {
  position: relative;
  margin: 10px;
}
.highlight {
  border-color: blue; /* Highlight color */
}
</style>