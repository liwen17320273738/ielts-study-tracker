<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTracker } from '../stores/tracker'

const tracker = useTracker()

interface Achievement {
  id: string
  icon: string
  name: string
  description: string
  category: 'streak' | 'hours' | 'vocab' | 'exam'
  threshold: number
  unit: string
}

const achievements: Achievement[] = [
  { id: 's3', icon: '🔥', name: '初心者', description: '连续打卡 3 天', category: 'streak', threshold: 3, unit: '天' },
  { id: 's7', icon: '🔥', name: '坚持者', description: '连续打卡 7 天', category: 'streak', threshold: 7, unit: '天' },
  { id: 's14', icon: '🔥', name: '毅力王', description: '连续打卡 14 天', category: 'streak', threshold: 14, unit: '天' },
  { id: 's30', icon: '🔥', name: '习惯大师', description: '连续打卡 30 天', category: 'streak', threshold: 30, unit: '天' },
  { id: 's60', icon: '🔥', name: '铁人', description: '连续打卡 60 天', category: 'streak', threshold: 60, unit: '天' },
  { id: 's84', icon: '👑', name: '完美备考', description: '连续打卡 84 天（全程）', category: 'streak', threshold: 84, unit: '天' },

  { id: 'h10', icon: '⏰', name: '起步', description: '累计学习 10 小时', category: 'hours', threshold: 10, unit: '小时' },
  { id: 'h50', icon: '⏰', name: '投入', description: '累计学习 50 小时', category: 'hours', threshold: 50, unit: '小时' },
  { id: 'h100', icon: '⏰', name: '百时', description: '累计学习 100 小时', category: 'hours', threshold: 100, unit: '小时' },
  { id: 'h150', icon: '⏰', name: '学霸', description: '累计学习 150 小时', category: 'hours', threshold: 150, unit: '小时' },
  { id: 'h200', icon: '⏰', name: '极致', description: '累计学习 200 小时', category: 'hours', threshold: 200, unit: '小时' },

  { id: 'v100', icon: '📚', name: '入门', description: '掌握 100 词', category: 'vocab', threshold: 100, unit: '词' },
  { id: 'v500', icon: '📚', name: '积累', description: '掌握 500 词', category: 'vocab', threshold: 500, unit: '词' },
  { id: 'v1000', icon: '📚', name: '丰富', description: '掌握 1000 词', category: 'vocab', threshold: 1000, unit: '词' },
  { id: 'v1500', icon: '📚', name: '词汇达人', description: '掌握 1500 词', category: 'vocab', threshold: 1500, unit: '词' },
  { id: 'v2000', icon: '📚', name: '词霸', description: '掌握 2000 词', category: 'vocab', threshold: 2000, unit: '词' },

  { id: 'e1', icon: '📝', name: '首考', description: '完成第 1 次模考', category: 'exam', threshold: 1, unit: '次' },
  { id: 'e6', icon: '📈', name: '突破6', description: '模考达到 6 分', category: 'exam', threshold: 6, unit: '分' },
  { id: 'e65', icon: '📈', name: '冲击6.5', description: '模考达到 6.5 分', category: 'exam', threshold: 6.5, unit: '分' },
  { id: 'e7', icon: '🏆', name: '目标达成', description: '模考达到 7 分', category: 'exam', threshold: 7, unit: '分' },
]

const categories = [
  { key: 'streak' as const, label: '打卡成就', accent: 'var(--accent-orange)' },
  { key: 'hours' as const, label: '学时成就', accent: 'var(--accent-blue)' },
  { key: 'vocab' as const, label: '词汇成就', accent: 'var(--accent-green)' },
  { key: 'exam' as const, label: '模考成就', accent: 'var(--accent-purple)' },
]

function getExamCount(): number {
  let count = 0
  for (let i = 1; i <= 10; i++) {
    const exam = tracker.getMockExam(i)
    if (exam.total != null && exam.total > 0) count++
  }
  return count
}

function getBestExamScore(): number {
  let best = 0
  for (let i = 1; i <= 10; i++) {
    const exam = tracker.getMockExam(i)
    if (exam.total != null && exam.total > best) best = exam.total
  }
  return best
}

function getCurrentValue(a: Achievement): number {
  switch (a.category) {
    case 'streak': return tracker.streakDays.value
    case 'hours': return tracker.totalStudyHours.value
    case 'vocab': return tracker.vocabMasteredCount()
    case 'exam':
      if (a.id === 'e1') return getExamCount()
      return getBestExamScore()
  }
}

function isUnlocked(a: Achievement): boolean {
  return getCurrentValue(a) >= a.threshold
}

function getProgress(a: Achievement): number {
  return Math.min(100, Math.round(getCurrentValue(a) / a.threshold * 100))
}

const unlockedCount = computed(() => achievements.filter(a => isUnlocked(a)).length)
const totalCount = achievements.length
const overallProgress = computed(() => Math.round(unlockedCount.value / totalCount * 100))

function getAchievementsByCategory(cat: string) {
  return achievements.filter(a => a.category === cat)
}

// ========== 自我奖励系统 ==========

interface Reward {
  id: number
  name: string
  conditionType: 'streak' | 'hours' | 'exam'
  conditionValue: number
  createdAt: string
}

const REWARDS_KEY = 'ielts-rewards'

function loadRewards(): Reward[] {
  try {
    const raw = localStorage.getItem(REWARDS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

function saveRewards() {
  localStorage.setItem(REWARDS_KEY, JSON.stringify(rewards.value))
}

const rewards = ref<Reward[]>(loadRewards())
const newRewardName = ref('')
const newConditionType = ref<'streak' | 'hours' | 'exam'>('streak')
const newConditionValue = ref(7)

const conditionOptions = [
  { value: 'streak', label: '连续打卡', unit: '天' },
  { value: 'hours', label: '累计学时', unit: '小时' },
  { value: 'exam', label: '模考达到', unit: '分' },
]

function getConditionLabel(type: string): string {
  return conditionOptions.find(o => o.value === type)?.label || ''
}

function getConditionUnit(type: string): string {
  return conditionOptions.find(o => o.value === type)?.unit || ''
}

function isRewardAchieved(r: Reward): boolean {
  switch (r.conditionType) {
    case 'streak': return tracker.streakDays.value >= r.conditionValue
    case 'hours': return tracker.totalStudyHours.value >= r.conditionValue
    case 'exam': return getBestExamScore() >= r.conditionValue
  }
}

function addReward() {
  if (!newRewardName.value.trim()) return
  rewards.value.push({
    id: Date.now(),
    name: newRewardName.value.trim(),
    conditionType: newConditionType.value,
    conditionValue: newConditionValue.value,
    createdAt: new Date().toISOString(),
  })
  newRewardName.value = ''
  newConditionValue.value = 7
  saveRewards()
}

function removeReward(id: number) {
  rewards.value = rewards.value.filter(r => r.id !== id)
  saveRewards()
}

watch(rewards, saveRewards, { deep: true })
</script>

<template>
  <div>
    <div class="page-title">🏆 成就奖励</div>

    <!-- 顶部统计 -->
    <div class="summary-card">
      <div class="summary-left">
        <div class="summary-number">{{ unlockedCount }}<span class="summary-total">/{{ totalCount }}</span></div>
        <div class="summary-label">已解锁成就</div>
      </div>
      <div class="summary-right">
        <div class="overall-progress-bar">
          <div class="overall-progress-fill" :style="{ width: overallProgress + '%' }"></div>
        </div>
        <div class="summary-percent">{{ overallProgress }}%</div>
      </div>
    </div>

    <!-- 分类成就卡片 -->
    <div v-for="cat in categories" :key="cat.key" class="category-section">
      <div class="category-header">
        <span class="category-dot" :style="{ background: cat.accent }"></span>
        <span class="category-label">{{ cat.label }}</span>
        <span class="category-count">
          {{ getAchievementsByCategory(cat.key).filter(a => isUnlocked(a)).length }}
          / {{ getAchievementsByCategory(cat.key).length }}
        </span>
      </div>
      <div class="achievements-grid">
        <div
          v-for="a in getAchievementsByCategory(cat.key)"
          :key="a.id"
          class="achievement-card"
          :class="{ unlocked: isUnlocked(a) }"
          :style="isUnlocked(a) ? { '--glow-color': cat.accent } as any : {}"
        >
          <div class="achievement-icon" :class="{ 'icon-unlocked': isUnlocked(a) }">
            {{ a.icon }}
          </div>
          <div class="achievement-info">
            <div class="achievement-name">{{ a.name }}</div>
            <div class="achievement-desc">{{ a.description }}</div>
            <div class="achievement-progress-wrap">
              <div class="achievement-progress-bar">
                <div
                  class="achievement-progress-fill"
                  :style="{
                    width: getProgress(a) + '%',
                    background: isUnlocked(a) ? cat.accent : 'var(--text-secondary)'
                  }"
                ></div>
              </div>
              <span class="achievement-progress-text">
                {{ getCurrentValue(a) }}/{{ a.threshold }}{{ a.unit }}
              </span>
            </div>
          </div>
          <div v-if="isUnlocked(a)" class="achievement-badge">✓</div>
        </div>
      </div>
    </div>

    <!-- 自我奖励系统 -->
    <div class="reward-section">
      <div class="category-header" style="margin-top: 32px">
        <span class="category-dot" style="background: var(--accent-red)"></span>
        <span class="category-label">我的奖励清单</span>
      </div>

      <div class="reward-form">
        <input
          v-model="newRewardName"
          class="reward-input"
          placeholder="奖励名称（如：吃一顿好的）"
          @keyup.enter="addReward"
        />
        <select v-model="newConditionType" class="reward-select">
          <option v-for="opt in conditionOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
        <input
          v-model.number="newConditionValue"
          type="number"
          class="reward-number"
          min="1"
        />
        <span class="reward-unit">{{ getConditionUnit(newConditionType) }}</span>
        <button class="reward-btn" @click="addReward" :disabled="!newRewardName.trim()">添加</button>
      </div>

      <div v-if="rewards.length === 0" class="reward-empty">
        还没有设置奖励，给自己一些动力吧！
      </div>

      <div v-else class="reward-list">
        <div
          v-for="r in rewards"
          :key="r.id"
          class="reward-item"
          :class="{ achieved: isRewardAchieved(r) }"
        >
          <div class="reward-status">
            <span v-if="isRewardAchieved(r)" class="reward-check">🎉</span>
            <span v-else class="reward-pending">🔒</span>
          </div>
          <div class="reward-info">
            <div class="reward-name">{{ r.name }}</div>
            <div class="reward-condition">
              {{ getConditionLabel(r.conditionType) }} {{ r.conditionValue }} {{ getConditionUnit(r.conditionType) }}
            </div>
          </div>
          <button class="reward-remove" @click="removeReward(r.id)" title="删除">✕</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.summary-card {
  display: flex;
  align-items: center;
  gap: 24px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px 28px;
  margin-bottom: 28px;
}

.summary-left {
  flex-shrink: 0;
}

.summary-number {
  font-size: 42px;
  font-weight: 700;
  color: var(--accent-orange);
  line-height: 1;
}

.summary-total {
  font-size: 22px;
  color: var(--text-secondary);
  font-weight: 400;
}

.summary-label {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.summary-right {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 14px;
}

.overall-progress-bar {
  flex: 1;
  height: 10px;
  background: var(--bg-hover);
  border-radius: 5px;
  overflow: hidden;
}

.overall-progress-fill {
  height: 100%;
  border-radius: 5px;
  background: linear-gradient(90deg, var(--accent-orange), var(--accent-red));
  transition: width 0.5s ease;
}

.summary-percent {
  font-size: 16px;
  font-weight: 600;
  color: var(--accent-orange);
  min-width: 42px;
  text-align: right;
}

/* 分类区块 */
.category-section {
  margin-bottom: 28px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.category-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.category-label {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.category-count {
  margin-left: auto;
  font-size: 13px;
  color: var(--text-secondary);
}

/* 成就卡片网格 */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

.achievement-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 16px;
  position: relative;
  transition: all 0.3s ease;
  opacity: 0.55;
  filter: grayscale(0.8);
}

.achievement-card.unlocked {
  opacity: 1;
  filter: none;
  border-color: var(--glow-color, var(--accent-orange));
  box-shadow:
    0 0 8px -2px var(--glow-color, var(--accent-orange)),
    0 0 20px -6px var(--glow-color, var(--accent-orange));
}

.achievement-icon {
  font-size: 28px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-hover);
  border-radius: 12px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.achievement-icon.icon-unlocked {
  background: rgba(255, 255, 255, 0.08);
  animation: icon-pulse 2s ease-in-out infinite;
}

@keyframes icon-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

.achievement-info {
  flex: 1;
  min-width: 0;
}

.achievement-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.achievement-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.achievement-progress-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.achievement-progress-bar {
  flex: 1;
  height: 4px;
  background: var(--bg-hover);
  border-radius: 2px;
  overflow: hidden;
}

.achievement-progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s ease;
}

.achievement-progress-text {
  font-size: 11px;
  color: var(--text-secondary);
  white-space: nowrap;
  flex-shrink: 0;
}

.achievement-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--accent-green);
  color: #000;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(74, 222, 128, 0.4);
}

/* 奖励系统 */
.reward-section {
  margin-top: 8px;
}

.reward-form {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.reward-input {
  flex: 1;
  min-width: 160px;
  background: var(--bg-hover);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 8px 12px;
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.reward-input:focus {
  border-color: var(--accent-blue);
}

.reward-input::placeholder {
  color: var(--text-secondary);
}

.reward-select {
  background: var(--bg-hover);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 8px 10px;
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  cursor: pointer;
}

.reward-number {
  width: 70px;
  background: var(--bg-hover);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 8px 10px;
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  text-align: center;
}

.reward-unit {
  font-size: 13px;
  color: var(--text-secondary);
}

.reward-btn {
  background: var(--accent-blue);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.reward-btn:hover {
  opacity: 0.85;
}

.reward-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.reward-empty {
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
  padding: 32px 0;
  background: var(--bg-card);
  border: 1px dashed var(--border-color);
  border-radius: 10px;
}

.reward-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reward-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 14px 16px;
  transition: all 0.3s ease;
  opacity: 0.65;
}

.reward-item.achieved {
  opacity: 1;
  border-color: var(--accent-green);
  box-shadow: 0 0 10px -4px var(--accent-green);
}

.reward-status {
  font-size: 22px;
  flex-shrink: 0;
}

.reward-info {
  flex: 1;
}

.reward-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.reward-condition {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.reward-remove {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
  opacity: 0;
}

.reward-item:hover .reward-remove {
  opacity: 1;
}

.reward-remove:hover {
  color: var(--accent-red);
  background: var(--bg-hover);
}
</style>
