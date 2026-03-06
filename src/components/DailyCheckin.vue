<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTracker } from '../stores/tracker'
import { studyPlan } from '../data/studyPlan'

const tracker = useTracker()
const selectedDay = ref(tracker.currentDay.value)

const allDays = computed(() => {
  const days: { day: number; date: string; weekday: string; week: number }[] = []
  for (const w of studyPlan) {
    for (const d of w.days) {
      days.push({ day: d.day, date: d.date, weekday: d.weekday, week: w.week })
    }
  }
  return days
})

const currentDayData = computed(() => {
  for (const w of studyPlan) {
    for (const d of w.days) {
      if (d.day === selectedDay.value) return { ...d, week: w.week, phase: w.phase }
    }
  }
  return null
})

const dayCompRate = computed(() => tracker.getDayCompletionRate(selectedDay.value))

const studyMinutes = ref(tracker.getStudyMinutes(selectedDay.value))
const notes = ref(tracker.getNotes(selectedDay.value))
const mood = ref(tracker.getMood(selectedDay.value))

function prev() {
  if (selectedDay.value > 1) {
    saveCurrentState()
    selectedDay.value--
    loadDayState()
  }
}

function next() {
  if (selectedDay.value < 84) {
    saveCurrentState()
    selectedDay.value++
    loadDayState()
  }
}

function goToday() {
  saveCurrentState()
  selectedDay.value = tracker.currentDay.value
  loadDayState()
}

function loadDayState() {
  studyMinutes.value = tracker.getStudyMinutes(selectedDay.value)
  notes.value = tracker.getNotes(selectedDay.value)
  mood.value = tracker.getMood(selectedDay.value)
}

function saveCurrentState() {
  tracker.setStudyMinutes(selectedDay.value, studyMinutes.value)
  tracker.setNotes(selectedDay.value, notes.value)
  if (mood.value) tracker.setMood(selectedDay.value, mood.value as any)
}

function onToggleTask(taskId: string) {
  tracker.toggleTask(selectedDay.value, taskId)
}

function selectMood(m: string) {
  mood.value = m
  tracker.setMood(selectedDay.value, m as any)
}

function onMinutesChange() {
  tracker.setStudyMinutes(selectedDay.value, studyMinutes.value)
}

function onNotesBlur() {
  tracker.setNotes(selectedDay.value, notes.value)
}
</script>

<template>
  <div>
    <div class="page-title">每日打卡</div>

    <div class="day-nav">
      <button @click="prev" :disabled="selectedDay <= 1">← 前一天</button>
      <div class="day-info">
        <div class="day-num">Day {{ selectedDay }}</div>
        <div class="day-date" v-if="currentDayData">
          {{ currentDayData.date }} {{ currentDayData.weekday }}
          <span v-if="selectedDay === tracker.currentDay.value"
            style="color: var(--accent-green); margin-left: 4px">· 今天</span>
        </div>
      </div>
      <button @click="next" :disabled="selectedDay >= 84">后一天 →</button>
      <button v-if="selectedDay !== tracker.currentDay.value" @click="goToday"
        style="background: var(--accent-blue); border-color: var(--accent-blue); color: #fff">
        回到今天
      </button>
    </div>

    <div class="two-col" v-if="currentDayData">
      <div>
        <div class="card">
          <div class="card-title">
            <span>🎯</span>
            {{ currentDayData.theme }}
          </div>
          <div style="color: var(--accent-blue); font-size: 13px; margin-bottom: 16px">
            重点：{{ currentDayData.focus }}
          </div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px">
            <span style="font-size: 12px; color: var(--text-secondary)">
              第{{ currentDayData.week }}周 · {{ currentDayData.phase }}
            </span>
            <span style="margin-left: auto; font-size: 14px; font-weight: 600;"
              :style="{ color: dayCompRate === 100 ? 'var(--accent-green)' : 'var(--accent-blue)' }">
              {{ dayCompRate }}%
            </span>
          </div>
          <div class="progress-bar" style="margin-bottom: 16px">
            <div class="progress-fill" :style="{
              width: dayCompRate + '%',
              background: dayCompRate === 100 ? 'var(--accent-green)' : 'var(--accent-blue)'
            }"></div>
          </div>

          <ul class="task-list">
            <li
              v-for="task in currentDayData.tasks"
              :key="task.id"
              class="task-item"
              :class="{ done: tracker.isTaskDone(selectedDay, task.id) }"
              @click="onToggleTask(task.id)"
            >
              <div class="task-checkbox" :class="{ checked: tracker.isTaskDone(selectedDay, task.id) }">
                <span v-if="tracker.isTaskDone(selectedDay, task.id)">✓</span>
              </div>
              <span class="task-tag" :class="'tag-' + task.category">{{ task.category }}</span>
              <span class="task-content">{{ task.content }}</span>
              <span class="task-duration" v-if="task.duration">{{ task.duration }}min</span>
            </li>
          </ul>

          <div v-if="currentDayData.tasks.length === 0"
            style="text-align: center; padding: 40px 0; color: var(--text-secondary)">
            🎉 考试日！加油！
          </div>
        </div>
      </div>

      <div>
        <div class="card">
          <div class="card-title"><span>⏱️</span> 学习时长</div>
          <div style="display: flex; align-items: center; gap: 12px">
            <el-input-number
              v-model="studyMinutes"
              :min="0"
              :max="600"
              :step="15"
              size="large"
              @change="onMinutesChange"
              style="width: 180px"
            />
            <span style="color: var(--text-secondary)">分钟</span>
            <span style="margin-left: auto; font-size: 18px; font-weight: 700; color: var(--accent-green)">
              {{ (studyMinutes / 60).toFixed(1) }}h
            </span>
          </div>
        </div>

        <div class="card">
          <div class="card-title"><span>😊</span> 今日状态</div>
          <div class="mood-selector">
            <span class="mood-btn" :class="{ selected: mood === 'great' }" @click="selectMood('great')">😊</span>
            <span class="mood-btn" :class="{ selected: mood === 'ok' }" @click="selectMood('ok')">😐</span>
            <span class="mood-btn" :class="{ selected: mood === 'tired' }" @click="selectMood('tired')">😫</span>
          </div>
        </div>

        <div class="card">
          <div class="card-title"><span>📝</span> 今日笔记</div>
          <el-input
            v-model="notes"
            type="textarea"
            :rows="5"
            placeholder="记录今日收获、错题、问题..."
            @blur="onNotesBlur"
          />
        </div>

        <div class="card">
          <div class="card-title"><span>📅</span> 快速跳转</div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px">
            <span
              v-for="d in allDays"
              :key="d.day"
              style="width: 30px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 4px; font-size: 11px; cursor: pointer; transition: all 0.15s"
              :style="{
                background: d.day === selectedDay ? 'var(--accent-blue)' :
                  tracker.getDayCompletionRate(d.day) === 100 ? 'rgba(74,222,128,0.2)' :
                  tracker.getDayCompletionRate(d.day) > 0 ? 'rgba(245,158,11,0.15)' :
                  'var(--bg-primary)',
                color: d.day === selectedDay ? '#fff' :
                  d.day === tracker.currentDay.value ? 'var(--accent-green)' :
                  'var(--text-secondary)',
                fontWeight: d.day === tracker.currentDay.value || d.day === selectedDay ? '700' : '400'
              }"
              @click="saveCurrentState(); selectedDay = d.day; loadDayState()"
            >
              {{ d.day }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
