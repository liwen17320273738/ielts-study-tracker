<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

const emit = defineEmits<{
  (e: 'complete', minutes: number): void
}>()

const durations = [25, 15, 5]
const breakDuration = 5

const selectedDuration = ref(25)
const totalSeconds = ref(selectedDuration.value * 60)
const isRunning = ref(false)
const isBreak = ref(false)
const completedCount = ref(0)

let timer: ReturnType<typeof setInterval> | null = null

const displayMinutes = computed(() => String(Math.floor(totalSeconds.value / 60)).padStart(2, '0'))
const displaySeconds = computed(() => String(totalSeconds.value % 60).padStart(2, '0'))

const currentTotal = computed(() => (isBreak.value ? breakDuration : selectedDuration.value) * 60)
const progress = computed(() => {
  const total = currentTotal.value
  if (total === 0) return 0
  return ((total - totalSeconds.value) / total) * 100
})

const circumference = 2 * Math.PI * 90
const strokeDashoffset = computed(() => circumference * (1 - progress.value / 100))

function selectDuration(d: number) {
  if (isRunning.value) return
  selectedDuration.value = d
  reset()
}

function start() {
  if (timer) return
  isRunning.value = true
  timer = setInterval(() => {
    if (totalSeconds.value <= 0) {
      clearInterval(timer!)
      timer = null
      isRunning.value = false
      if (!isBreak.value) {
        completedCount.value++
        emit('complete', selectedDuration.value)
        isBreak.value = true
        totalSeconds.value = breakDuration * 60
      } else {
        isBreak.value = false
        totalSeconds.value = selectedDuration.value * 60
      }
      return
    }
    totalSeconds.value--
  }, 1000)
}

function pause() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  isRunning.value = false
}

function reset() {
  pause()
  isBreak.value = false
  totalSeconds.value = selectedDuration.value * 60
}

function toggle() {
  isRunning.value ? pause() : start()
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="pomodoro">
    <div class="pomodoro-header">🍅 番茄钟</div>

    <div class="duration-tabs">
      <button
        v-for="d in durations"
        :key="d"
        class="tab-btn"
        :class="{ active: selectedDuration === d && !isBreak }"
        :disabled="isRunning"
        @click="selectDuration(d)"
      >
        {{ d }} 分钟
      </button>
    </div>

    <div class="timer-ring-wrapper">
      <svg class="timer-ring" viewBox="0 0 200 200">
        <circle
          class="ring-bg"
          cx="100" cy="100" r="90"
          fill="none"
          stroke="var(--border-color)"
          stroke-width="6"
        />
        <circle
          class="ring-progress"
          cx="100" cy="100" r="90"
          fill="none"
          :stroke="isBreak ? 'var(--accent-green)' : 'var(--accent-blue)'"
          stroke-width="6"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="strokeDashoffset"
          transform="rotate(-90 100 100)"
        />
      </svg>
      <div class="timer-display">
        <div class="timer-status">{{ isBreak ? '休息中' : '专注中' }}</div>
        <div class="timer-digits">{{ displayMinutes }}:{{ displaySeconds }}</div>
      </div>
    </div>

    <div class="controls">
      <button class="ctrl-btn" @click="toggle">
        {{ isRunning ? '⏸ 暂停' : '▶ 开始' }}
      </button>
      <button class="ctrl-btn secondary" @click="reset">↺ 重置</button>
    </div>

    <div class="completed-count">
      已完成 <span class="count-num">{{ completedCount }}</span> 个番茄
    </div>
  </div>
</template>

<style scoped>
.pomodoro {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  margin-top: 12px;
}

.pomodoro-header {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.duration-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.tab-btn {
  flex: 1;
  padding: 8px 0;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tab-btn.active {
  background: var(--accent-blue);
  color: #fff;
  border-color: var(--accent-blue);
}

.timer-ring-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 20px;
}

.timer-ring {
  width: 100%;
  height: 100%;
}

.ring-progress {
  transition: stroke-dashoffset 0.4s ease;
}

.timer-display {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.timer-status {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.timer-digits {
  font-size: 40px;
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  letter-spacing: 2px;
}

.controls {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 16px;
}

.ctrl-btn {
  padding: 10px 28px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background: var(--accent-blue);
  color: #fff;
  transition: opacity 0.2s;
}

.ctrl-btn:hover {
  opacity: 0.85;
}

.ctrl-btn.secondary {
  background: var(--bg-primary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.completed-count {
  text-align: center;
  font-size: 13px;
  color: var(--text-secondary);
}

.count-num {
  font-size: 18px;
  font-weight: 700;
  color: var(--accent-green);
  margin: 0 2px;
}
</style>
