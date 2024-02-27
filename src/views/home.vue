<template>
<div class="home">
    <div class="logo">
      <img src="../assets/img/logo.png" />
    </div>
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
      <div class="box" @click="modalShow = true">
        <img src="../assets/img/Self.png" />
      </div>
    </div>
    <selfModal v-if="modalShow" @close="modalShow = false"/>
</div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from '@/store/counter';
import selfModal from '@/components/self-modal.vue';
import router from '@/router';

const store = useStore()

const modalShow = ref(false)

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
  right: 200px;
}
.box {
  position: relative;
  margin: 10px;
}
.logo {
  position: absolute;
  margin: 10px;
  right: 80px;
  top: 100px;
}
.logo img {
  height: 400px;
}
.highlight {
  border-color: blue; /* Highlight color */
}
</style>