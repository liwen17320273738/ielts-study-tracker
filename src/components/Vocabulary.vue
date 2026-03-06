<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTracker } from '../stores/tracker'
import { vocabularyLists } from '../data/vocabulary'

const tracker = useTracker()
const selectedList = ref(1)
const showMeaning = ref(true)
const filterMode = ref<'all' | 'mastered' | 'unmastered'>('all')

const currentList = computed(() => vocabularyLists.find(l => l.id === selectedList.value)!)

const filteredWords = computed(() => {
  const words = currentList.value.words
  if (filterMode.value === 'mastered') return words.filter(w => tracker.isVocabMastered(w.word))
  if (filterMode.value === 'unmastered') return words.filter(w => !tracker.isVocabMastered(w.word))
  return words
})

const listStats = computed(() => {
  return vocabularyLists.map(list => {
    const total = list.words.length
    const mastered = list.words.filter(w => tracker.isVocabMastered(w.word)).length
    return { ...list, total, mastered, rate: Math.round(mastered / total * 100) }
  })
})

const totalMastered = computed(() => tracker.vocabMasteredCount())
const totalWords = computed(() => vocabularyLists.reduce((sum, l) => sum + l.words.length, 0))
</script>

<template>
  <div>
    <div class="page-title">词汇本</div>

    <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 20px">
      <div class="stat-card">
        <div class="label">已掌握</div>
        <div class="value" style="color: var(--accent-green)">{{ totalMastered }}</div>
        <div class="sub">共 {{ totalWords }} 词</div>
        <div class="progress-bar" style="margin-top: 8px">
          <div class="progress-fill" :style="{ width: (totalMastered / totalWords * 100) + '%', background: 'var(--accent-green)' }"></div>
        </div>
      </div>
      <div class="stat-card">
        <div class="label">掌握率</div>
        <div class="value" style="color: var(--accent-blue)">{{ Math.round(totalMastered / totalWords * 100) }}%</div>
        <div class="sub">点击单词标记掌握</div>
      </div>
      <div class="stat-card">
        <div class="label">待学习</div>
        <div class="value" style="color: var(--accent-orange)">{{ totalWords - totalMastered }}</div>
        <div class="sub">加油！</div>
      </div>
    </div>

    <div class="card">
      <div style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; align-items: center">
        <div
          v-for="stat in listStats"
          :key="stat.id"
          class="week-tab"
          :class="{ active: selectedList === stat.id }"
          @click="selectedList = stat.id"
        >
          {{ stat.category }}
          <span style="font-size: 11px; opacity: 0.7; margin-left: 4px">{{ stat.rate }}%</span>
        </div>

        <div style="margin-left: auto; display: flex; gap: 8px">
          <button
            @click="showMeaning = !showMeaning"
            style="padding: 5px 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-secondary); cursor: pointer; font-size: 12px"
          >
            {{ showMeaning ? '隐藏释义' : '显示释义' }}
          </button>
          <select v-model="filterMode"
            style="padding: 5px 10px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-secondary); cursor: pointer; font-size: 12px">
            <option value="all">全部</option>
            <option value="mastered">已掌握</option>
            <option value="unmastered">未掌握</option>
          </select>
        </div>
      </div>

      <div style="margin-bottom: 16px; display: flex; align-items: center; gap: 12px">
        <span style="font-size: 15px; font-weight: 600">{{ currentList.title }} - {{ currentList.category }}</span>
        <div class="progress-bar" style="flex: 1">
          <div class="progress-fill" :style="{
            width: listStats.find(l => l.id === selectedList)!.rate + '%',
            background: 'var(--accent-green)'
          }"></div>
        </div>
        <span style="font-size: 13px; color: var(--text-secondary)">
          {{ listStats.find(l => l.id === selectedList)!.mastered }}/{{ listStats.find(l => l.id === selectedList)!.total }}
        </span>
      </div>

      <div class="vocab-grid">
        <div
          v-for="word in filteredWords"
          :key="word.word"
          class="vocab-word"
          :class="{ mastered: tracker.isVocabMastered(word.word) }"
          @click="tracker.toggleVocab(word.word)"
        >
          <span style="width: 16px; height: 16px; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 10px; flex-shrink: 0"
            :style="{
              background: tracker.isVocabMastered(word.word) ? 'var(--accent-green)' : 'var(--border-color)',
              color: tracker.isVocabMastered(word.word) ? '#000' : 'transparent'
            }">✓</span>
          <span class="en">{{ word.word }}</span>
          <span class="cn" v-if="showMeaning">{{ word.meaning }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
