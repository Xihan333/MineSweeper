import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { Levels } from '@/data'

const LOCAL_KEY = 'minesweeper'

export const useStore = defineStore('store', () => {
  const local = localStorage.getItem(LOCAL_KEY)
  const defaultData = local
    ? JSON.parse(local)
    : Object.keys(Levels)
      .reduce((acc , level) => {
        acc[level] = 0;
        return acc;
      }, {})
  const records = reactive(defaultData)

  function setRecord(level,time) {
    records[level] = time;
    localStorage.setItem(LOCAL_KEY, JSON.stringify(records))
  }

  const degree = ref({
    name:'Self',
    row:12,
    column:10,
    bombNum:50,
  })

  function setDegree(name,row=10,column=10,bombNum=10) {
    degree.value.name = name
    degree.value.row = row
    degree.value.column = column
    degree.value.bombNum = bombNum
  }

  return { records , setRecord , degree, setDegree }
})
