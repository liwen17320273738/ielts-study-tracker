<script setup lang="ts">
import { ref } from 'vue'
import { templates } from '../data/resources'

const activeTab = ref('task1')
</script>

<template>
  <div>
    <div class="page-title">写作 & 口语模板</div>

    <div class="week-tabs" style="margin-bottom: 24px">
      <div class="week-tab" :class="{ active: activeTab === 'task1' }" @click="activeTab = 'task1'">✍️ Task 1</div>
      <div class="week-tab" :class="{ active: activeTab === 'task2' }" @click="activeTab = 'task2'">✍️ Task 2</div>
      <div class="week-tab" :class="{ active: activeTab === 'part1' }" @click="activeTab = 'part1'">🗣️ Part 1</div>
      <div class="week-tab" :class="{ active: activeTab === 'part2' }" @click="activeTab = 'part2'">🗣️ Part 2</div>
      <div class="week-tab" :class="{ active: activeTab === 'part3' }" @click="activeTab = 'part3'">🗣️ Part 3</div>
      <div class="week-tab" :class="{ active: activeTab === 'connectors' }" @click="activeTab = 'connectors'">🔗 连接词</div>
    </div>

    <!-- Task 1 -->
    <div v-if="activeTab === 'task1'">
      <div class="card">
        <div class="card-title"><span>📊</span> Task 1 图表类模板</div>

        <div class="template-section">
          <h4 style="font-size: 14px; margin-bottom: 8px; color: var(--accent-blue)">开头段（改写题目）</h4>
          <div class="template-block">{{ templates.writing.task1.intro }}</div>
        </div>

        <div class="template-section">
          <h4 style="font-size: 14px; margin-bottom: 8px; color: var(--accent-blue)">概述（Overall）</h4>
          <div class="template-block">{{ templates.writing.task1.overview }}</div>
        </div>

        <div class="template-section">
          <h4 style="font-size: 14px; margin-bottom: 8px; color: var(--accent-blue)">主体段1（主要数据）</h4>
          <div class="template-block">{{ templates.writing.task1.body1 }}</div>
        </div>

        <div class="template-section">
          <h4 style="font-size: 14px; margin-bottom: 8px; color: var(--accent-blue)">主体段2（对比/次要数据）</h4>
          <div class="template-block">{{ templates.writing.task1.body2 }}</div>
        </div>

        <div class="template-section">
          <h4 style="font-size: 14px; margin-bottom: 8px; color: var(--accent-green)">同义替换词</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px">
            <div v-for="(syns, word) in templates.writing.task1.synonyms" :key="word"
              style="padding: 10px 14px; background: var(--bg-primary); border-radius: 8px">
              <span style="font-weight: 600; color: var(--accent-orange)">{{ word }}</span>
              <span style="color: var(--text-secondary)"> → </span>
              <span style="color: var(--accent-blue)">{{ syns.join(' / ') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Task 2 -->
    <div v-if="activeTab === 'task2'">
      <div class="card">
        <div class="card-title"><span>📝</span> Task 2 大作文模板</div>

        <div class="template-section">
          <h4 style="font-size: 14px; margin-bottom: 8px; color: var(--accent-blue)">开头段（4句）</h4>
          <div class="template-block">{{ templates.writing.task2.intro.join('\n') }}</div>
        </div>

        <div class="template-section">
          <h4 style="font-size: 14px; margin-bottom: 8px; color: var(--accent-blue)">主体段（论点+论据+例子）</h4>
          <div class="template-block">{{ templates.writing.task2.body.join('\n') }}</div>
        </div>

        <div class="template-section">
          <h4 style="font-size: 14px; margin-bottom: 8px; color: var(--accent-orange)">让步段（可选）</h4>
          <div class="template-block">{{ templates.writing.task2.concession.join('\n') }}</div>
        </div>

        <div class="template-section">
          <h4 style="font-size: 14px; margin-bottom: 8px; color: var(--accent-green)">结尾段（3句）</h4>
          <div class="template-block">{{ templates.writing.task2.conclusion.join('\n') }}</div>
        </div>
      </div>
    </div>

    <!-- Part 1 -->
    <div v-if="activeTab === 'part1'">
      <div class="card">
        <div class="card-title"><span>💬</span> 口语 Part 1 常见话题模板</div>

        <div class="template-section" v-for="(tmpl, key) in templates.speaking.part1" :key="key">
          <h4 style="font-size: 14px; margin-bottom: 8px; color: var(--accent-blue)">
            {{ key === 'work' ? '工作/学习' : key === 'hometown' ? '家乡' : '爱好' }}
          </h4>
          <div class="template-block">{{ tmpl }}</div>
        </div>
      </div>
    </div>

    <!-- Part 2 -->
    <div v-if="activeTab === 'part2'">
      <div class="card">
        <div class="card-title"><span>🎤</span> 口语 Part 2 陈述模板（2分钟）</div>

        <div class="template-section" v-for="(tmpl, key) in templates.speaking.part2" :key="key">
          <h4 style="font-size: 14px; margin-bottom: 8px; color: var(--accent-blue)">
            {{ key === 'person' ? '人物类' : key === 'place' ? '地点类' : key === 'event' ? '事件类' : '物品类' }}
          </h4>
          <div class="template-block">{{ tmpl }}</div>
        </div>
      </div>
    </div>

    <!-- Part 3 -->
    <div v-if="activeTab === 'part3'">
      <div class="card">
        <div class="card-title"><span>🧠</span> 口语 Part 3 深入讨论模板</div>

        <div class="template-section" v-for="(phrases, key) in templates.speaking.part3" :key="key">
          <h4 style="font-size: 14px; margin-bottom: 8px; color: var(--accent-blue)">
            {{ key === 'opinion' ? '表达观点' : key === 'reason' ? '给出理由' : key === 'example' ? '举例说明' : key === 'contrast' ? '对比观点' : '不确定时应对' }}
          </h4>
          <div style="display: flex; flex-direction: column; gap: 6px">
            <div v-for="(p, i) in phrases" :key="i" class="template-block" style="margin-bottom: 0; padding: 10px 14px">
              {{ p }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Connectors -->
    <div v-if="activeTab === 'connectors'">
      <div class="card">
        <div class="card-title"><span>🔗</span> 高分连接词 & 句型</div>

        <div class="template-section" v-for="(words, key) in templates.connectors" :key="key">
          <h4 style="font-size: 14px; margin-bottom: 8px; color: var(--accent-blue)">
            {{ key === 'sequence' ? '顺序' : key === 'addition' ? '递进' : key === 'contrast' ? '转折' : key === 'cause' ? '因果' : key === 'emphasis' ? '强调' : '复杂句型' }}
          </h4>
          <div style="display: flex; flex-wrap: wrap; gap: 8px">
            <span v-for="(w, i) in words" :key="i"
              style="padding: 6px 14px; background: var(--bg-primary); border-radius: 6px; font-size: 13px; color: var(--accent-blue)">
              {{ w }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
