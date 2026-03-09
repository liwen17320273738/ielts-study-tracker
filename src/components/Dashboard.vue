<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useTracker, getDayDate, getDayWeekday } from '../stores/tracker'
import { PLAN_START } from '../stores/tracker'
import { studyPlan, mockExams } from '../data/studyPlan'
import * as echarts from 'echarts'
import dayjs from 'dayjs'

const emit = defineEmits<{ (e: 'navigate', page: string): void }>()

const {
  currentDay, currentWeek, totalStudyHours,
  completionRate, todayCompletionRate, streakDays,
  weeklyHours, getWeekCompletionRate, isTaskDone,
  getStudyMinutes, getMockExam
} = useTracker()

const examDate = dayjs(PLAN_START).add(83, 'day')
const daysUntilExam = computed(() => examDate.diff(dayjs(), 'day'))
const examPassed = computed(() => daysUntilExam.value < 0)
const encouragement = computed(() => {
  const d = daysUntilExam.value
  if (d > 60) return '稳扎稳打'
  if (d > 30) return '加速冲刺'
  if (d > 7) return '最后冲刺'
  return '决战时刻'
})

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

// 热力图数据：84 天 = 12 周 × 7 天
const heatmapData = computed(() => {
  const cells = []
  const today = dayjs()
  for (let d = 1; d <= 84; d++) {
    const date = dayjs(PLAN_START).add(d - 1, 'day')
    const minutes = getStudyMinutes(d)
    const isToday = date.isSame(today, 'day')
    cells.push({ day: d, date: date.format('YYYY-MM-DD'), minutes, isToday })
  }
  return cells
})

function getHeatColor(minutes: number): string {
  if (minutes <= 0) return '#1a1d28'
  if (minutes <= 30) return 'rgba(74,222,128,0.2)'
  if (minutes <= 60) return 'rgba(74,222,128,0.4)'
  if (minutes <= 120) return 'rgba(74,222,128,0.6)'
  if (minutes <= 180) return 'rgba(74,222,128,0.8)'
  return '#4ade80'
}

// 薄弱环节分析
const weaknessAnalysis = computed(() => {
  const subjects = ['listening', 'reading', 'writing', 'speaking'] as const
  const labels: Record<string, string> = {
    listening: '听力', reading: '阅读', writing: '写作', speaking: '口语'
  }
  const sums = { listening: 0, reading: 0, writing: 0, speaking: 0 }
  let count = 0

  for (const exam of mockExams) {
    const record = getMockExam(exam.id)
    if (record.listening != null && record.reading != null &&
        record.writing != null && record.speaking != null) {
      sums.listening += record.listening
      sums.reading += record.reading
      sums.writing += record.writing
      sums.speaking += record.speaking
      count++
    }
  }

  if (count === 0) return null

  const avgs = subjects.map(s => ({
    key: s,
    label: labels[s],
    avg: Math.round((sums[s] / count) * 10) / 10
  }))
  const weakest = avgs.reduce((a, b) => a.avg < b.avg ? a : b)
  return { avgs, weakest, count }
})

onMounted(() => {
  setTimeout(initCharts, 100)
})
</script>

<template>
  <div>
    <div class="page-title">学习概览</div>

    <div class="countdown-banner" v-if="!examPassed">
      <div class="countdown-main">
        <span class="countdown-number">{{ daysUntilExam }}</span>
        <span class="countdown-label">天</span>
      </div>
      <div class="countdown-text">距考试还有 {{ daysUntilExam }} 天</div>
      <div class="countdown-encourage">{{ encouragement }}</div>
    </div>
    <div class="countdown-banner finished" v-else>
      <div class="countdown-text">考试已结束</div>
    </div>

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
            {{ getDayDate(currentDay) }} {{ getDayWeekday(currentDay) }}
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

    <!-- 学习热力图 -->
    <div class="card heatmap-card">
      <div class="card-title"><span>🔥</span> 学习热力图</div>
      <div class="heatmap-wrapper">
        <div class="heatmap-y-labels">
          <span v-for="d in ['一', '二', '三', '四', '五', '六', '日']" :key="d">周{{ d }}</span>
        </div>
        <div class="heatmap-grid-area">
          <div class="heatmap-grid">
            <div
              v-for="cell in heatmapData"
              :key="cell.day"
              class="heatmap-cell"
              :class="{ 'heatmap-today': cell.isToday }"
              :style="{ backgroundColor: getHeatColor(cell.minutes) }"
              :title="`${cell.date}：${cell.minutes} 分钟`"
            ></div>
          </div>
          <div class="heatmap-x-labels">
            <span v-for="w in 12" :key="w">第{{ w }}周</span>
          </div>
        </div>
      </div>
      <div class="heatmap-legend">
        <span class="heatmap-legend-label">少</span>
        <span class="heatmap-legend-box" style="background: #1a1d28"></span>
        <span class="heatmap-legend-box" style="background: rgba(74,222,128,0.2)"></span>
        <span class="heatmap-legend-box" style="background: rgba(74,222,128,0.4)"></span>
        <span class="heatmap-legend-box" style="background: rgba(74,222,128,0.6)"></span>
        <span class="heatmap-legend-box" style="background: rgba(74,222,128,0.8)"></span>
        <span class="heatmap-legend-box" style="background: #4ade80"></span>
        <span class="heatmap-legend-label">多</span>
      </div>
    </div>

    <!-- 薄弱环节分析 -->
    <div class="card weakness-card">
      <div class="card-title"><span>🎯</span> 薄弱环节分析</div>
      <template v-if="weaknessAnalysis">
        <div class="weakness-bars">
          <div v-for="item in weaknessAnalysis.avgs" :key="item.key" class="weakness-row">
            <span class="weakness-label">{{ item.label }}</span>
            <div class="weakness-track">
              <div
                class="weakness-fill"
                :style="{
                  width: (item.avg / 9 * 100) + '%',
                  background: item.key === weaknessAnalysis.weakest.key ? '#ef4444' : '#4f8cff'
                }"
              ></div>
            </div>
            <span class="weakness-score" :style="{ color: item.key === weaknessAnalysis.weakest.key ? '#ef4444' : '#4f8cff' }">
              {{ item.avg }}
            </span>
          </div>
        </div>
        <div class="weakness-tip">
          ⚠️ 你的{{ weaknessAnalysis.weakest.label }}相对薄弱（平均 {{ weaknessAnalysis.weakest.avg }} 分），建议每天多投入 30 分钟
        </div>
      </template>
      <div v-else class="weakness-empty">
        还没有模考数据，完成第一次模考后这里会显示分析
      </div>
    </div>
  </div>
</template>

<style scoped>
.countdown-banner {
  background: linear-gradient(135deg, #4f46e5, #7c3aed, #6366f1);
  border-radius: 12px;
  padding: 24px 32px;
  margin-bottom: 20px;
  text-align: center;
  color: #fff;
  position: relative;
  overflow: hidden;
}

.countdown-banner::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.12) 0%, transparent 60%);
  pointer-events: none;
}

.countdown-banner.finished {
  background: linear-gradient(135deg, #6b7280, #4b5563);
}

.countdown-main {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.countdown-number {
  font-size: 56px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -2px;
}

.countdown-label {
  font-size: 24px;
  font-weight: 600;
}

.countdown-text {
  font-size: 16px;
  margin-top: 4px;
  opacity: 0.9;
}

.countdown-encourage {
  display: inline-block;
  margin-top: 8px;
  padding: 4px 16px;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 2px;
}

/* 热力图 */
.heatmap-card {
  margin-top: 20px;
}

.heatmap-wrapper {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.heatmap-y-labels {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding-top: 2px;
  flex-shrink: 0;
}

.heatmap-y-labels span {
  height: 14px;
  line-height: 14px;
  font-size: 10px;
  color: var(--text-secondary);
  text-align: right;
}

.heatmap-grid-area {
  flex: 1;
  min-width: 0;
}

.heatmap-grid {
  display: grid;
  grid-template-rows: repeat(7, 14px);
  grid-auto-flow: column;
  grid-auto-columns: 14px;
  gap: 3px;
}

.heatmap-cell {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  transition: transform 0.15s;
}

.heatmap-cell:hover {
  transform: scale(1.4);
  z-index: 1;
}

.heatmap-today {
  outline: 2px solid #4f8cff;
  outline-offset: 1px;
}

.heatmap-x-labels {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 14px;
  gap: 3px;
  margin-top: 6px;
}

.heatmap-x-labels span {
  font-size: 9px;
  color: var(--text-secondary);
  text-align: center;
  white-space: nowrap;
}

.heatmap-legend {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 12px;
}

.heatmap-legend-label {
  font-size: 11px;
  color: var(--text-secondary);
}

.heatmap-legend-box {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 3px;
}

/* 薄弱环节分析 */
.weakness-card {
  margin-top: 20px;
}

.weakness-bars {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 8px;
}

.weakness-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.weakness-label {
  width: 36px;
  font-size: 14px;
  color: var(--text-primary);
  flex-shrink: 0;
}

.weakness-track {
  flex: 1;
  height: 20px;
  background: var(--border-color);
  border-radius: 10px;
  overflow: hidden;
}

.weakness-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.6s ease;
}

.weakness-score {
  width: 32px;
  text-align: right;
  font-size: 15px;
  font-weight: 700;
  flex-shrink: 0;
}

.weakness-tip {
  margin-top: 16px;
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  font-size: 14px;
  color: #fca5a5;
  line-height: 1.6;
}

.weakness-empty {
  padding: 32px 0;
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
}
</style>
