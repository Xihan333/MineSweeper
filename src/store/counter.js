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

  return { records , setRecord }
})
