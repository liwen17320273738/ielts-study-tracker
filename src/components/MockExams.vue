<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTracker } from '../stores/tracker'
import { mockExams } from '../data/studyPlan'
import * as echarts from 'echarts'

const tracker = useTracker()
const chartRef = ref<HTMLElement>()

const exams = ref(mockExams.map(e => ({
  ...e,
  ...tracker.getMockExam(e.id)
})))

function saveExam(exam: typeof exams.value[0]) {
  if (exam.listening !== null && exam.reading !== null) {
    const l = exam.listening || 0
    const r = exam.reading || 0
    const w = exam.writing || 0
    const s = exam.speaking || 0
    const count = [l, r, w, s].filter(v => v > 0).length
    exam.total = count > 0 ? Math.round((l + r + w + s) / count * 2) / 2 : null
  }
  tracker.saveMockExam(exam as any)
  initChart()
}

function initChart() {
  if (!chartRef.value) return
  const chart = echarts.getInstanceByDom(chartRef.value) || echarts.init(chartRef.value)
  const scored = exams.value.filter(e => e.total !== null && e.total! > 0)
  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['总分', '听力', '阅读', '写作', '口语'], textStyle: { color: '#9ca3b8' }, top: 0 },
    grid: { top: 40, right: 20, bottom: 30, left: 40 },
    xAxis: {
      type: 'category',
      data: scored.map(e => e.source),
      axisLabel: { color: '#9ca3b8', fontSize: 11, rotate: 30 },
      axisLine: { lineStyle: { color: '#2d3148' } }
    },
    yAxis: {
      type: 'value', min: 4, max: 9,
      axisLabel: { color: '#9ca3b8' },
      splitLine: { lineStyle: { color: '#2d3148' } }
    },
    series: [
      { name: '总分', type: 'line', data: scored.map(e => e.total), lineStyle: { width: 3 }, itemStyle: { color: '#4f8cff' }, symbol: 'circle', symbolSize: 8 },
      { name: '听力', type: 'line', data: scored.map(e => e.listening), lineStyle: { width: 1 }, itemStyle: { color: '#4ade80' }, symbol: 'circle', symbolSize: 5 },
      { name: '阅读', type: 'line', data: scored.map(e => e.reading), lineStyle: { width: 1 }, itemStyle: { color: '#f59e0b' }, symbol: 'circle', symbolSize: 5 },
      { name: '写作', type: 'line', data: scored.map(e => e.writing), lineStyle: { width: 1 }, itemStyle: { color: '#a78bfa' }, symbol: 'circle', symbolSize: 5 },
      { name: '口语', type: 'line', data: scored.map(e => e.speaking), lineStyle: { width: 1 }, itemStyle: { color: '#f472b6' }, symbol: 'circle', symbolSize: 5 },
    ]
  })
}

onMounted(() => setTimeout(initChart, 100))
</script>

<template>
  <div>
    <div class="page-title">模考记录</div>

    <div class="card">
      <div class="card-title"><span>📈</span> 成绩趋势</div>
      <div ref="chartRef" class="chart-container" style="height: 280px"></div>
      <div style="text-align: center; font-size: 11px; color: var(--text-secondary); margin-top: 8px">
        目标趋势：第4周 5.5-6分 → 第8周 6.5分 → 第12周 7分
      </div>
    </div>

    <div class="card" v-for="exam in exams" :key="exam.id">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px">
        <span style="font-size: 16px; font-weight: 700; color: var(--accent-blue)">模考 #{{ exam.id }}</span>
        <span style="font-size: 13px; color: var(--accent-orange)">{{ exam.source }}</span>
        <span style="font-size: 12px; color: var(--text-secondary)">第{{ exam.week }}周</span>
        <span v-if="exam.total" style="margin-left: auto; font-size: 20px; font-weight: 700"
          :style="{ color: exam.total >= 7 ? 'var(--accent-green)' : exam.total >= 6 ? 'var(--accent-blue)' : 'var(--accent-orange)' }">
          {{ exam.total }}分
        </span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 12px">
        <div v-for="skill in [
          { key: 'listening', label: '听力', color: 'var(--accent-green)' },
          { key: 'reading', label: '阅读', color: 'var(--accent-orange)' },
          { key: 'writing', label: '写作', color: 'var(--accent-purple)' },
          { key: 'speaking', label: '口语', color: 'var(--accent-pink)' },
        ]" :key="skill.key"
          style="background: var(--bg-primary); border-radius: 8px; padding: 12px; text-align: center">
          <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 6px">{{ skill.label }}</div>
          <el-input-number
            v-model="(exam as any)[skill.key]"
            :min="0"
            :max="9"
            :step="0.5"
            :precision="1"
            size="small"
            controls-position="right"
            @change="saveExam(exam)"
            style="width: 100%"
          />
        </div>
      </div>

      <div style="display: flex; gap: 12px">
        <el-input
          v-model="exam.notes"
          placeholder="备注（错题分析、改进计划...）"
          @blur="saveExam(exam)"
          size="small"
        />
      </div>
    </div>
  </div>
</template>
