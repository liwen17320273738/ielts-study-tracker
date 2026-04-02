<script setup lang="ts">
import { ref } from 'vue'
import Dashboard from './components/Dashboard.vue'
import DailyCheckin from './components/DailyCheckin.vue'
import WeeklyPlan from './components/WeeklyPlan.vue'
import MockExams from './components/MockExams.vue'
import Vocabulary from './components/Vocabulary.vue'
import Achievements from './components/Achievements.vue'
import Resources from './components/Resources.vue'
import DocsArchive from './components/DocsArchive.vue'
import Templates from './components/Templates.vue'
import { useTracker } from './stores/tracker'

const { currentDay, currentWeek, needsAuth, submitBackendLogin } = useTracker()

const currentPage = ref('dashboard')

const loginPassword = ref('')
const loginBusy = ref(false)
const loginError = ref('')

async function onLoginSubmit() {
  loginError.value = ''
  loginBusy.value = true
  try {
    const ok = await submitBackendLogin(loginPassword.value)
    if (!ok) loginError.value = '密码错误或未同步，请重试'
    else loginPassword.value = ''
  } finally {
    loginBusy.value = false
  }
}

const navItems = [
  { key: 'dashboard', label: '学习概览', icon: '📊' },
  { key: 'checkin', label: '今日打卡', icon: '✅' },
  { key: 'weekly', label: '周计划', icon: '📅' },
  { key: 'mockexam', label: '模考记录', icon: '📝' },
  { key: 'vocab', label: '词汇本', icon: '📚' },
  { key: 'achievements', label: '成就奖励', icon: '🏆' },
  { key: 'resources', label: '学习资源', icon: '🔗' },
  { key: 'docs', label: '外贸英语', icon: '📄' },
  { key: 'templates', label: '写作口语模板', icon: '📋' },
]
</script>

<template>
  <div v-if="needsAuth" class="login-gate">
    <div class="login-card">
      <h1 class="login-title">📚 雅思打卡</h1>
      <p class="login-hint">输入密码以同步学习数据（与后端 TRACKER_PASSWORD 一致）</p>
      <form class="login-form" @submit.prevent="onLoginSubmit">
        <input
          v-model="loginPassword"
          type="password"
          class="login-input"
          placeholder="密码"
          autocomplete="current-password"
          :disabled="loginBusy"
        />
        <button type="submit" class="login-btn" :disabled="loginBusy">
          {{ loginBusy ? '登录中…' : '登录' }}
        </button>
      </form>
      <p v-if="loginError" class="login-err">{{ loginError }}</p>
    </div>
  </div>
  <div v-else class="app-layout">
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
      <Achievements v-if="currentPage === 'achievements'" />
      <Resources v-if="currentPage === 'resources'" />
      <DocsArchive v-if="currentPage === 'docs'" />
      <Templates v-if="currentPage === 'templates'" />
    </main>
  </div>
</template>

<style scoped>
.login-gate {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(ellipse at top, #1a1d35 0%, var(--bg-primary) 55%);
  padding: 24px;
}
.login-card {
  width: 100%;
  max-width: 380px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 40px 32px;
  box-shadow: var(--shadow);
  text-align: center;
}
.login-title {
  font-size: 22px;
  margin-bottom: 8px;
  font-weight: 700;
}
.login-hint {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 24px;
  line-height: 1.5;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-align: left;
}
.login-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 15px;
  outline: none;
}
.login-input:focus {
  border-color: var(--accent-blue);
}
.login-input:disabled {
  opacity: 0.65;
}
.login-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
.login-btn:hover:not(:disabled) {
  filter: brightness(1.06);
}
.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.login-err {
  margin-top: 14px;
  font-size: 14px;
  color: var(--accent-red);
}
</style>
