import { ref, computed } from 'vue'
import { studyPlan } from '../data/studyPlan'
import dayjs from 'dayjs'

const STORAGE_KEY = 'ielts-tracker'
const PLAN_START = '2025-03-05'

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

function saveState(state: TrackerState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

const state = ref<TrackerState>(loadState())

function persist() {
  saveState(state.value)
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

export function useTracker() {
  const currentDay = computed(() => {
    const diff = dayjs().diff(dayjs(PLAN_START), 'day')
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
    if (tasks.length === 0) return 100
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
    return total === 0 ? 100 : Math.round(done / total * 100)
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
