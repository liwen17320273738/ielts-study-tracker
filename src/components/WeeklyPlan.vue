<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTracker } from '../stores/tracker'
import { studyPlan } from '../data/studyPlan'

const tracker = useTracker()
const selectedWeek = ref(tracker.currentWeek.value)

const weekData = computed(() => studyPlan.find(w => w.week === selectedWeek.value)!)

function getPhaseStyle(phase: string) {
  const map: Record<string, { bg: string; color: string }> = {
    '基础重建': { bg: 'rgba(79,140,255,0.15)', color: 'var(--accent-blue)' },
    '专项突破': { bg: 'rgba(245,158,11,0.15)', color: 'var(--accent-orange)' },
    '冲刺模考': { bg: 'rgba(239,68,68,0.15)', color: 'var(--accent-red)' },
  }
  return map[phase] || map['基础重建']
}

function totalDayMinutes(dayNum: number) {
  const day = weekData.value.days.find(d => d.day === dayNum)
  if (!day) return 0
  return day.tasks.reduce((sum, t) => sum + t.duration, 0)
}
</script>

<template>
  <div>
    <div class="page-title">周计划</div>

    <div class="week-tabs">
      <div
        v-for="w in studyPlan"
        :key="w.week"
        class="week-tab"
        :class="{
          active: selectedWeek === w.week,
          current: tracker.currentWeek.value === w.week && selectedWeek !== w.week
        }"
        @click="selectedWeek = w.week"
      >
        第{{ w.week }}周
        <span v-if="tracker.getWeekCompletionRate(w.week) === 100" style="margin-left: 4px">✓</span>
      </div>
    </div>

    <div class="card" v-if="weekData">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        <span class="page-title" style="margin-bottom: 0">第{{ weekData.week }}周</span>
        <span
          style="padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 600"
          :style="{ background: getPhaseStyle(weekData.phase).bg, color: getPhaseStyle(weekData.phase).color }"
        >{{ weekData.phase }}</span>
        <span style="font-size: 13px; color: var(--text-secondary); margin-left: auto">{{ weekData.dateRange }}</span>
      </div>

      <div style="padding: 12px 16px; background: var(--bg-primary); border-radius: 8px; margin-bottom: 16px">
        <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: var(--accent-blue)">🎯 {{ weekData.goal }}</div>
        <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px">
          <span style="font-size: 12px; color: var(--text-secondary)">完成率</span>
          <div class="progress-bar" style="flex: 1">
            <div class="progress-fill" :style="{
              width: tracker.getWeekCompletionRate(weekData.week) + '%',
              background: tracker.getWeekCompletionRate(weekData.week) === 100 ? 'var(--accent-green)' : 'var(--accent-blue)'
            }"></div>
          </div>
          <span style="font-size: 13px; font-weight: 600"
            :style="{ color: tracker.getWeekCompletionRate(weekData.week) === 100 ? 'var(--accent-green)' : 'var(--accent-blue)' }">
            {{ tracker.getWeekCompletionRate(weekData.week) }}%
          </span>
        </div>
      </div>

      <div style="margin-bottom: 20px">
        <div style="font-size: 13px; font-weight: 600; margin-bottom: 8px">本周目标</div>
        <div v-for="(t, i) in weekData.weeklyTargets" :key="i"
          style="display: flex; align-items: center; gap: 8px; padding: 4px 0; font-size: 13px; color: var(--text-secondary)">
          <span style="color: var(--accent-blue)">•</span> {{ t }}
        </div>
      </div>

      <div v-if="weekData.mockExam"
        style="padding: 10px 16px; background: rgba(239,68,68,0.1); border-radius: 8px; margin-bottom: 20px; display: flex; align-items: center; gap: 8px">
        <span>📝</span>
        <span style="font-size: 13px; color: var(--accent-red)">本周模考：{{ weekData.mockExam }}</span>
      </div>
    </div>

    <div v-if="weekData" v-for="day in weekData.days" :key="day.day" class="card">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px">
        <span style="font-size: 16px; font-weight: 700; color: var(--accent-blue)">Day {{ day.day }}</span>
        <span style="font-size: 13px; color: var(--text-secondary)">{{ day.date }} {{ day.weekday }}</span>
        <span
          v-if="day.day === tracker.currentDay.value"
          style="padding: 2px 8px; background: rgba(74,222,128,0.2); color: var(--accent-green); border-radius: 4px; font-size: 11px; font-weight: 600"
        >今天</span>
        <span style="margin-left: auto; font-size: 12px; color: var(--text-secondary)">
          {{ day.theme }} · {{ totalDayMinutes(day.day) }}min
        </span>
      </div>

      <div style="font-size: 13px; color: var(--accent-blue); margin-bottom: 12px">{{ day.focus }}</div>

      <ul class="task-list">
        <li
          v-for="task in day.tasks"
          :key="task.id"
          class="task-item"
          :class="{ done: tracker.isTaskDone(day.day, task.id) }"
          @click="tracker.toggleTask(day.day, task.id)"
        >
          <div class="task-checkbox" :class="{ checked: tracker.isTaskDone(day.day, task.id) }">
            <span v-if="tracker.isTaskDone(day.day, task.id)">✓</span>
          </div>
          <span class="task-tag" :class="'tag-' + task.category">{{ task.category }}</span>
          <span class="task-content">{{ task.content }}</span>
          <span class="task-duration" v-if="task.duration">{{ task.duration }}min</span>
        </li>
      </ul>

      <div v-if="day.tasks.length === 0"
        style="text-align: center; padding: 20px 0; color: var(--text-secondary); font-size: 20px">
        🎉 考试日！加油！
      </div>

      <div class="progress-bar" style="margin-top: 8px">
        <div class="progress-fill" :style="{
          width: tracker.getDayCompletionRate(day.day) + '%',
          background: tracker.getDayCompletionRate(day.day) === 100 ? 'var(--accent-green)' : 'var(--accent-blue)'
        }"></div>
      </div>
    </div>
  </div>
</template>
