import { ref, computed, onUnmounted } from 'vue'
import { studyPlan } from '../data/studyPlan'
import dayjs from 'dayjs'
import { fetchState, saveStateToServer } from '../api'

const STORAGE_KEY = 'ielts-tracker'
export const PLAN_START = '2026-03-05'

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export function getDayDate(day: number): string {
  const d = dayjs(PLAN_START).add(day - 1, 'day')
  return `${d.month() + 1}月${d.date()}日`
}

export function getDayWeekday(day: number): string {
  return WEEKDAYS[dayjs(PLAN_START).add(day - 1, 'day').day()]
}

interface DayRecord {
  completedTasks: string[]
  studyMinutes: number
  notes: string
  mood: 'great' | 'ok' | 'tired' | ''
}

interface MockExamRecord {
  id: number
  listening: number | null
  reading: number | null
  writing: number | null
  speaking: number | null
  total: number | null
  date: string | null
  notes: string
}

interface TrackerState {
  days: Record<number, DayRecord>
  mockExams: Record<number, MockExamRecord>
  masteredVocab: string[]
}

function loadState(): TrackerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { days: {}, mockExams: {}, masteredVocab: [] }
}

function saveState(s: TrackerState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
}

function backendToFrontend(data: Record<string, any>): TrackerState {
  const days: Record<number, DayRecord> = {}
  if (data.checkins) {
    for (const [key, val] of Object.entries(data.checkins as Record<string, any>)) {
      days[Number(key)] = {
        completedTasks: val.tasks ? Object.keys(val.tasks).filter(k => val.tasks[k]) : [],
        studyMinutes: val.studyMinutes || 0,
        notes: val.notes || '',
        mood: val.mood || '',
      }
    }
  }
  const mockExams: Record<number, MockExamRecord> = {}
  if (data.mockExamScores) {
    for (const [key, val] of Object.entries(data.mockExamScores as Record<string, any>)) {
      mockExams[Number(key)] = { ...val, id: Number(key) }
    }
  }
  const masteredVocab: string[] = data.vocabMastered
    ? Object.keys(data.vocabMastered).filter(k => data.vocabMastered[k])
    : []
  return { days, mockExams, masteredVocab }
}

function frontendToBackend(s: TrackerState): Record<string, any> {
  const checkins: Record<string, any> = {}
  for (const [key, val] of Object.entries(s.days)) {
    const dayNum = Number(key)
    const tasks: Record<string, boolean> = {}
    for (const taskId of val.completedTasks) tasks[taskId] = true
    checkins[key] = {
      dayNumber: dayNum,
      tasks,
      studyMinutes: val.studyMinutes,
      notes: val.notes,
      mood: val.mood,
      date: dayjs(PLAN_START).add(dayNum - 1, 'day').format('YYYY-MM-DD'),
    }
  }
  const mockExamScores: Record<string, any> = {}
  for (const [key, val] of Object.entries(s.mockExams)) {
    mockExamScores[key] = { ...val }
  }
  const vocabMastered: Record<string, boolean> = {}
  for (const word of s.masteredVocab) vocabMastered[word] = true
  return { checkins, mockExamScores, vocabMastered, startDate: PLAN_START }
}

let _debounceTimer: ReturnType<typeof setTimeout> | null = null
function debouncedSaveToBackend() {
  if (_debounceTimer) clearTimeout(_debounceTimer)
  _debounceTimer = setTimeout(() => {
    saveStateToServer(frontendToBackend(state.value)).catch(err => {
      console.warn('保存到后端失败:', err)
    })
  }, 500)
}

let _backendLoaded = false
async function loadFromBackend() {
  if (_backendLoaded) return
  _backendLoaded = true
  try {
    const data = await fetchState()
    state.value = backendToFrontend(data)
    saveState(state.value)
  } catch (err) {
    console.warn('从后端加载失败，使用 localStorage:', err)
  }
}

const state = ref<TrackerState>(loadState())

function persist() {
  saveState(state.value)
  debouncedSaveToBackend()
}

function getDayRecord(day: number): DayRecord {
  if (!state.value.days[day]) {
    state.value.days[day] = { completedTasks: [], studyMinutes: 0, notes: '', mood: '' }
  }
  return state.value.days[day]
}

function getDayTasks(day: number) {
  for (const week of studyPlan) {
    for (const d of week.days) {
      if (d.day === day) return d.tasks
    }
  }
  return []
}

const now = ref(dayjs())
let _timer: ReturnType<typeof setInterval> | null = null
function ensureTimer() {
  if (_timer) return
  _timer = setInterval(() => { now.value = dayjs() }, 60_000)
}

export function useTracker() {
  ensureTimer()
  loadFromBackend()

  const currentDay = computed(() => {
    const diff = now.value.diff(dayjs(PLAN_START), 'day')
    return Math.max(1, Math.min(84, diff + 1))
  })

  const currentWeek = computed(() => Math.ceil(currentDay.value / 7))

  function isTaskDone(day: number, taskId: string): boolean {
    return getDayRecord(day).completedTasks.includes(taskId)
  }

  function toggleTask(day: number, taskId: string) {
    const record = getDayRecord(day)
    const idx = record.completedTasks.indexOf(taskId)
    if (idx >= 0) {
      record.completedTasks.splice(idx, 1)
    } else {
      record.completedTasks.push(taskId)
    }
    persist()
  }

  function getDayCompletionRate(day: number): number {
    const tasks = getDayTasks(day)
    if (tasks.length === 0) return 0
    const done = tasks.filter(t => isTaskDone(day, t.id)).length
    return Math.round(done / tasks.length * 100)
  }

  function getWeekCompletionRate(week: number): number {
    const weekData = studyPlan.find(w => w.week === week)
    if (!weekData) return 0
    let total = 0, done = 0
    for (const day of weekData.days) {
      for (const task of day.tasks) {
        total++
        if (isTaskDone(day.day, task.id)) done++
      }
    }
    return total === 0 ? 0 : Math.round(done / total * 100)
  }

  const todayCompletionRate = computed(() => getDayCompletionRate(currentDay.value))

  const completionRate = computed(() => {
    let total = 0, done = 0
    for (const week of studyPlan) {
      for (const day of week.days) {
        for (const task of day.tasks) {
          total++
          if (isTaskDone(day.day, task.id)) done++
        }
      }
    }
    return total === 0 ? 0 : Math.round(done / total * 100)
  })

  const totalStudyHours = computed(() => {
    let total = 0
    for (const key in state.value.days) {
      total += state.value.days[key].studyMinutes || 0
    }
    return Math.round(total / 60 * 10) / 10
  })

  const weeklyHours = computed(() => {
    return studyPlan.map(week => {
      let mins = 0
      for (const day of week.days) {
        mins += state.value.days[day.day]?.studyMinutes || 0
      }
      return Math.round(mins / 60 * 10) / 10
    })
  })

  const streakDays = computed(() => {
    let streak = 0
    for (let d = currentDay.value; d >= 1; d--) {
      if (getDayCompletionRate(d) > 0 || state.value.days[d]?.studyMinutes > 0) {
        streak++
      } else {
        break
      }
    }
    return streak
  })

  function getStudyMinutes(day: number): number {
    return getDayRecord(day).studyMinutes
  }

  function setStudyMinutes(day: number, minutes: number) {
    getDayRecord(day).studyMinutes = minutes
    persist()
  }

  function getNotes(day: number): string {
    return getDayRecord(day).notes
  }

  function setNotes(day: number, notes: string) {
    getDayRecord(day).notes = notes
    persist()
  }

  function getMood(day: number): string {
    return getDayRecord(day).mood
  }

  function setMood(day: number, mood: 'great' | 'ok' | 'tired') {
    getDayRecord(day).mood = mood
    persist()
  }

  function getMockExam(id: number): Partial<MockExamRecord> {
    return state.value.mockExams[id] || {}
  }

  function saveMockExam(exam: MockExamRecord) {
    state.value.mockExams[exam.id] = { ...exam }
    persist()
  }

  function isVocabMastered(word: string): boolean {
    return state.value.masteredVocab.includes(word)
  }

  function toggleVocab(word: string) {
    const idx = state.value.masteredVocab.indexOf(word)
    if (idx >= 0) {
      state.value.masteredVocab.splice(idx, 1)
    } else {
      state.value.masteredVocab.push(word)
    }
    persist()
  }

  function vocabMasteredCount(): number {
    return state.value.masteredVocab.length
  }

  return {
    currentDay,
    currentWeek,
    totalStudyHours,
    completionRate,
    todayCompletionRate,
    streakDays,
    weeklyHours,
    isTaskDone,
    toggleTask,
    getDayCompletionRate,
    getWeekCompletionRate,
    getStudyMinutes,
    setStudyMinutes,
    getNotes,
    setNotes,
    getMood,
    setMood,
    getMockExam,
    saveMockExam,
    isVocabMastered,
    toggleVocab,
    vocabMasteredCount,
  }
}
