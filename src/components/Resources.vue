<script setup lang="ts">
import { ref, computed } from 'vue'
import { resources, budget } from '../data/resources'

const totalBudget = budget.reduce((sum, b) => sum + b.cost, 0)
const searchQuery = ref('')
const filterPriority = ref<'all' | '必备' | '推荐' | '可选'>('all')

const totalResources = computed(() => resources.reduce((sum, g) => sum + g.items.length, 0))
const totalCategories = resources.length

const filteredResources = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return resources
    .map(group => ({
      ...group,
      items: group.items.filter(item => {
        const matchSearch = !q || item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
        const matchPriority = filterPriority.value === 'all' || item.priority === filterPriority.value
        return matchSearch && matchPriority
      })
    }))
    .filter(group => group.items.length > 0)
})
</script>

<template>
  <div>
    <div class="page-title">学习资源</div>

    <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 20px">
      <div class="stat-card">
        <div class="label">资源总数</div>
        <div class="value" style="color: var(--accent-blue)">{{ totalResources }}</div>
        <div class="sub">{{ totalCategories }} 个分类</div>
      </div>
      <div class="stat-card">
        <div class="label">必备资源</div>
        <div class="value" style="color: var(--accent-red)">{{ resources.reduce((s, g) => s + g.items.filter(i => i.priority === '必备').length, 0) }}</div>
        <div class="sub">优先掌握</div>
      </div>
      <div class="stat-card">
        <div class="label">推荐预算</div>
        <div class="value" style="color: var(--accent-orange)">¥{{ totalBudget }}</div>
        <div class="sub">{{ budget.length }} 项开销</div>
      </div>
    </div>

    <div class="card" style="margin-bottom: 24px">
      <div class="card-title"><span>💰</span> 推荐预算</div>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px">
        <div v-for="b in budget" :key="b.item"
          style="display: flex; justify-content: space-between; padding: 10px 14px; background: var(--bg-primary); border-radius: 8px">
          <span style="font-size: 14px">{{ b.item }}</span>
          <span style="font-weight: 600; color: var(--accent-orange)">¥{{ b.cost }}</span>
        </div>
      </div>
      <div style="text-align: right; margin-top: 12px; font-size: 16px; font-weight: 700; color: var(--accent-blue)">
        合计约 ¥{{ totalBudget }}
      </div>
    </div>

    <div class="card" style="margin-bottom: 20px">
      <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap">
        <el-input
          v-model="searchQuery"
          placeholder="搜索资源名称或描述..."
          style="flex: 1; min-width: 200px"
          clearable
        />
        <div class="week-tabs" style="margin-bottom: 0">
          <div class="week-tab" :class="{ active: filterPriority === 'all' }" @click="filterPriority = 'all'">全部</div>
          <div class="week-tab" :class="{ active: filterPriority === '必备' }" @click="filterPriority = '必备'" style="color: var(--accent-red)">必备</div>
          <div class="week-tab" :class="{ active: filterPriority === '推荐' }" @click="filterPriority = '推荐'" style="color: var(--accent-orange)">推荐</div>
          <div class="week-tab" :class="{ active: filterPriority === '可选' }" @click="filterPriority = '可选'">可选</div>
        </div>
      </div>
    </div>

    <div v-for="group in filteredResources" :key="group.title" class="resource-group">
      <div class="card">
        <h3 class="card-title">
          <span>{{ group.icon }}</span>
          {{ group.title }}
          <span style="margin-left: auto; font-size: 12px; color: var(--text-secondary); font-weight: 400">{{ group.items.length }} 项</span>
        </h3>
        <div v-for="item in group.items" :key="item.name" class="resource-item">
          <span class="resource-badge" :class="'badge-' + item.priority">{{ item.priority }}</span>
          <div style="flex: 1">
            <div style="font-size: 14px; font-weight: 500">
              <a v-if="item.url" :href="item.url" target="_blank">{{ item.name }}</a>
              <span v-else>{{ item.name }}</span>
            </div>
            <div class="desc">{{ item.description }}</div>
          </div>
          <span v-if="item.cost" style="font-size: 12px; color: var(--accent-orange); flex-shrink: 0">
            {{ item.cost }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="filteredResources.length === 0" style="text-align: center; padding: 60px 0; color: var(--text-secondary)">
      没有找到匹配的资源
    </div>
  </div>
</template>
