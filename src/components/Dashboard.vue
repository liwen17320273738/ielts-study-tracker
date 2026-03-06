<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useTracker } from '../stores/tracker'
import { studyPlan } from '../data/studyPlan'
import * as echarts from 'echarts'

const emit = defineEmits<{ (e: 'navigate', page: string): void }>()

const {
  currentDay, currentWeek, totalStudyHours,
  completionRate, todayCompletionRate, streakDays,
  weeklyHours, getWeekCompletionRate, isTaskDone
} = useTracker()

const chartRef = ref<HTMLElement>()
const pieRef = ref<HTMLElement>()

function getTodayTasks() {
  for (const week of studyPlan) {
    for (const day of week.days) {
      if (day.day === currentDay.value) return day
    }
  }
  return studyPlan[0].days[0]
}

function getCurrentPhase() {
  const week = studyPlan.find(w => w.week === currentWeek.value)
  return week?.phase || '基础重建'
}

function getPhaseColor(phase: string) {
  const colors: Record<string, string> = {
    '基础重建': '#4f8cff',
    '专项突破': '#f59e0b',
    '冲刺模考': '#ef4444'
  }
  return colors[phase] || '#4f8cff'
}

function initCharts() {
  if (chartRef.value) {
    const chart = echarts.init(chartRef.value)
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { top: 30, right: 20, bottom: 30, left: 50 },
      xAxis: {
        type: 'category',
        data: Array.from({ length: 12 }, (_, i) => `第${i + 1}周`),
        axisLabel: { color: '#9ca3b8', fontSize: 11 },
        axisLine: { lineStyle: { color: '#2d3148' } }
      },
      yAxis: {
        type: 'value',
        name: '小时',
        nameTextStyle: { color: '#9ca3b8' },
        axisLabel: { color: '#9ca3b8' },
        splitLine: { lineStyle: { color: '#2d3148' } }
      },
      series: [
        {
          type: 'bar',
          data: weeklyHours.value.map((h, i) => ({
            value: h,
            itemStyle: {
              color: i + 1 === currentWeek.value
                ? '#4f8cff'
                : h > 0 ? '#4ade80' : '#2d3148',
              borderRadius: [4, 4, 0, 0]
            }
          })),
          barWidth: '50%'
        },
        {
          type: 'line',
          data: Array(12).fill(17.5),
          lineStyle: { color: '#ef4444', type: 'dashed', width: 1 },
          symbol: 'none',
          tooltip: { show: false }
        }
      ]
    })
    window.addEventListener('resize', () => chart.resize())
  }

  if (pieRef.value) {
    const pie = echarts.init(pieRef.value)
    const weekRates = studyPlan.map(w => ({
      name: `第${w.week}周`,
      value: getWeekCompletionRate(w.week)
    }))
    pie.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
      series: [{
        type: 'pie',
        radius: ['55%', '80%'],
        center: ['50%', '50%'],
        label: { show: false },
        data: weekRates.map((r, i) => ({
          ...r,
          itemStyle: {
            color: i + 1 <= currentWeek.value
              ? (r.value > 50 ? '#4ade80' : r.value > 0 ? '#f59e0b' : '#2d3148')
              : '#1a1d28'
          }
        }))
      }]
    })
    window.addEventListener('resize', () => pie.resize())
  }
}

onMounted(() => {
  setTimeout(initCharts, 100)
})
</script>

<template>
  <div>
    <div class="page-title">学习概览</div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="label">当前进度</div>
        <div class="value" :style="{ color: 'var(--accent-blue)' }">Day {{ currentDay }}</div>
        <div class="sub">第 {{ currentWeek }} 周 · {{ getCurrentPhase() }}</div>
        <div class="progress-bar" style="margin-top: 12px">
          <div class="progress-fill" :style="{ width: (currentDay / 84 * 100) + '%', background: getPhaseColor(getCurrentPhase()) }"></div>
        </div>
      </div>
      <div class="stat-card">
        <div class="label">累计学时</div>
        <div class="value" :style="{ color: 'var(--accent-green)' }">{{ totalStudyHours }}h</div>
        <div class="sub">目标 210 小时</div>
        <div class="progress-bar" style="margin-top: 12px">
          <div class="progress-fill" :style="{ width: Math.min(100, totalStudyHours / 210 * 100) + '%', background: 'var(--accent-green)' }"></div>
        </div>
      </div>
      <div class="stat-card">
        <div class="label">总完成率</div>
        <div class="value" :style="{ color: 'var(--accent-purple)' }">{{ completionRate }}%</div>
        <div class="sub">全部任务</div>
        <div class="progress-bar" style="margin-top: 12px">
          <div class="progress-fill" :style="{ width: completionRate + '%', background: 'var(--accent-purple)' }"></div>
        </div>
      </div>
      <div class="stat-card">
        <div class="label">连续打卡</div>
        <div class="value" :style="{ color: 'var(--accent-orange)' }">{{ streakDays }}天</div>
        <div class="sub">保持住！</div>
      </div>
    </div>

    <div class="two-col">
      <div class="card" @click="emit('navigate', 'checkin')" style="cursor: pointer">
        <div class="card-title">
          <span>✅</span> 今日任务 · Day {{ currentDay }}
          <span style="margin-left: auto; font-size: 13px; color: var(--text-secondary)">
            {{ getTodayTasks().date }} {{ getTodayTasks().weekday }}
          </span>
        </div>
        <div style="margin-bottom: 12px; color: var(--accent-blue); font-size: 13px">
          {{ getTodayTasks().theme }} — {{ getTodayTasks().focus }}
        </div>
        <ul class="task-list">
          <li
            v-for="task in getTodayTasks().tasks"
            :key="task.id"
            class="task-item"
            :class="{ done: isTaskDone(currentDay, task.id) }"
          >
            <div class="task-checkbox" :class="{ checked: isTaskDone(currentDay, task.id) }">
              <span v-if="isTaskDone(currentDay, task.id)">✓</span>
            </div>
            <span class="task-tag" :class="'tag-' + task.category">{{ task.category }}</span>
            <span class="task-content">{{ task.content }}</span>
            <span class="task-duration" v-if="task.duration">{{ task.duration }}min</span>
          </li>
        </ul>
        <div style="text-align: center; margin-top: 16px;">
          <div class="progress-bar">
            <div class="progress-fill" :style="{
              width: todayCompletionRate + '%',
              background: todayCompletionRate === 100 ? 'var(--accent-green)' : 'var(--accent-blue)'
            }"></div>
          </div>
          <div style="font-size: 12px; color: var(--text-secondary); margin-top: 6px">
            今日完成率 {{ todayCompletionRate }}%
          </div>
        </div>
      </div>

      <div>
        <div class="card">
          <div class="card-title"><span>📈</span> 每周学习时长</div>
          <div ref="chartRef" class="chart-container"></div>
          <div style="font-size: 11px; color: var(--text-secondary); margin-top: 8px; text-align: center">
            红色虚线 = 目标 17.5h/周 (每天2.5h)
          </div>
        </div>

        <div class="card">
          <div class="card-title"><span>🎯</span> 关键里程碑</div>
          <div v-for="(ms, i) in [
            { week: 2, label: '词汇2500+', done: currentWeek > 2 },
            { week: 4, label: '模考5.5-6分', done: currentWeek > 4 },
            { week: 8, label: '模考6.5分', done: currentWeek > 8 },
            { week: 10, label: '写作10篇完成', done: currentWeek > 10 },
            { week: 12, label: '正式考试7分！', done: false },
          ]" :key="i" style="display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--border-color);">
            <div style="width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;"
              :style="{
                background: currentWeek >= ms.week ? 'var(--accent-green)' : 'var(--border-color)',
                color: currentWeek >= ms.week ? '#000' : 'var(--text-secondary)'
              }">
              {{ currentWeek >= ms.week ? '✓' : i + 1 }}
            </div>
            <span style="flex: 1; font-size: 14px;">{{ ms.label }}</span>
            <span style="font-size: 12px; color: var(--text-secondary);">第{{ ms.week }}周</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
