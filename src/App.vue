<script setup lang="ts">
import { ref } from 'vue'
import Dashboard from './components/Dashboard.vue'
import DailyCheckin from './components/DailyCheckin.vue'
import WeeklyPlan from './components/WeeklyPlan.vue'
import MockExams from './components/MockExams.vue'
import Vocabulary from './components/Vocabulary.vue'
import Resources from './components/Resources.vue'
import Templates from './components/Templates.vue'
import { useTracker } from './stores/tracker'

const { currentDay, currentWeek } = useTracker()

const currentPage = ref('dashboard')

const navItems = [
  { key: 'dashboard', label: '学习概览', icon: '📊' },
  { key: 'checkin', label: '今日打卡', icon: '✅' },
  { key: 'weekly', label: '周计划', icon: '📅' },
  { key: 'mockexam', label: '模考记录', icon: '📝' },
  { key: 'vocab', label: '词汇本', icon: '📚' },
  { key: 'resources', label: '学习资源', icon: '🔗' },
  { key: 'templates', label: '写作口语模板', icon: '📋' },
]
</script>

<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1>雅思7分冲刺</h1>
        <p>3个月备考计划</p>
      </div>
      <nav class="sidebar-nav">
        <div
          v-for="item in navItems"
          :key="item.key"
          class="nav-item"
          :class="{ active: currentPage === item.key }"
          @click="currentPage = item.key"
        >
          <span class="icon">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </div>
      </nav>
      <div class="sidebar-footer">
        <div>Day {{ currentDay }} / 84</div>
        <div>第 {{ currentWeek }} 周 / 12</div>
      </div>
    </aside>

    <main class="main-content">
      <Dashboard v-if="currentPage === 'dashboard'" @navigate="currentPage = $event" />
      <DailyCheckin v-if="currentPage === 'checkin'" />
      <WeeklyPlan v-if="currentPage === 'weekly'" />
      <MockExams v-if="currentPage === 'mockexam'" />
      <Vocabulary v-if="currentPage === 'vocab'" />
      <Resources v-if="currentPage === 'resources'" />
      <Templates v-if="currentPage === 'templates'" />
    </main>
  </div>
</template>
