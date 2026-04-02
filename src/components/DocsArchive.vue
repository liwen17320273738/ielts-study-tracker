<script setup lang="ts">
import { ref, watch } from 'vue'
import { marked } from 'marked'
import { DOCS_MANIFEST, DOC_FILE_TO_SLUG, loadDocRaw } from '../data/docsArchive'

const currentSlug = ref(DOCS_MANIFEST[0]!.slug)
const html = ref('')
const loading = ref(false)
const loadError = ref('')

marked.use({
  gfm: true,
  breaks: true,
})

/** marked 的自定义 Renderer 在 use() 合并后 this.parser 可能未绑定，改为对成品 HTML 处理外链 */
function externalLinksNewTab(html: string): string {
  return html.replace(
    /<a href="(https?:\/\/[^"]+)"/gi,
    '<a href="$1" target="_blank" rel="noopener noreferrer"',
  )
}

async function renderDoc(slug: string) {
  const entry = DOCS_MANIFEST.find(d => d.slug === slug)
  if (!entry) return
  loading.value = true
  loadError.value = ''
  try {
    const raw = await loadDocRaw(entry.file)
    const out = await marked.parse(raw)
    const str = typeof out === 'string' ? out : String(out)
    html.value = externalLinksNewTab(str)
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : '加载失败'
    html.value = ''
  } finally {
    loading.value = false
  }
}

function onContentClick(e: MouseEvent) {
  const a = (e.target as HTMLElement).closest('a')
  if (!a) return
  let href = (a.getAttribute('href') || '').trim()
  href = href.split('#')[0].split('?')[0]
  const file = href.replace(/^.*\//, '')
  if (!file.toLowerCase().endsWith('.md')) return
  const slug = DOC_FILE_TO_SLUG[file]
  if (!slug) return
  e.preventDefault()
  currentSlug.value = slug
}

watch(currentSlug, renderDoc, { immediate: true })
</script>

<template>
  <div class="docs-page">
    <div class="page-title">外贸英语</div>
    <p class="docs-intro">
      内容来自仓库 <code>docs/</code> 下的 Markdown；外贸英语资源清单中<strong>免费</strong>与<strong>付费/可能付费</strong>已分节标注（政策以各站为准）。
    </p>

    <div class="docs-shell card">
      <aside class="docs-nav">
        <div
          v-for="doc in DOCS_MANIFEST"
          :key="doc.slug"
          class="docs-nav-item"
          :class="{ active: currentSlug === doc.slug }"
          @click="currentSlug = doc.slug"
        >
          {{ doc.title }}
        </div>
      </aside>

      <div class="docs-body">
        <div v-if="loading" class="docs-loading">加载中…</div>
        <div v-else-if="loadError" class="docs-error">{{ loadError }}</div>
        <div
          v-else
          class="docs-content"
          @click="onContentClick"
          v-html="html"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.docs-page {
  max-width: 1200px;
  margin: 0 auto;
}

.docs-intro {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 20px;
  line-height: 1.6;
}

.docs-intro code {
  font-size: 13px;
  padding: 2px 6px;
  background: var(--bg-primary);
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.docs-shell {
  display: flex;
  gap: 0;
  min-height: 520px;
  padding: 0;
  overflow: hidden;
}

.docs-nav {
  width: 260px;
  flex-shrink: 0;
  background: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  padding: 12px 0;
}

.docs-nav-item {
  padding: 10px 16px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  border-left: 3px solid transparent;
  line-height: 1.45;
  transition: background 0.15s, color 0.15s;
}

.docs-nav-item:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.docs-nav-item.active {
  color: var(--accent-blue);
  background: var(--bg-hover);
  border-left-color: var(--accent-blue);
  font-weight: 600;
}

.docs-body {
  flex: 1;
  min-width: 0;
  padding: 24px 28px 32px;
  overflow: auto;
  max-height: calc(100vh - 140px);
}

.docs-loading,
.docs-error {
  color: var(--text-secondary);
  padding: 24px 0;
}

.docs-error {
  color: var(--accent-red);
}

.docs-content :deep(h1) {
  font-size: 1.55rem;
  margin: 0 0 16px;
  font-weight: 700;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 10px;
}

.docs-content :deep(h2) {
  font-size: 1.2rem;
  margin: 28px 0 12px;
  color: var(--text-primary);
}

.docs-content :deep(h3) {
  font-size: 1.05rem;
  margin: 20px 0 8px;
}

.docs-content :deep(p),
.docs-content :deep(li) {
  line-height: 1.65;
  color: var(--text-secondary);
  font-size: 14px;
}

.docs-content :deep(p) {
  margin: 0 0 12px;
}

.docs-content :deep(strong) {
  color: var(--text-primary);
}

.docs-content :deep(a) {
  color: var(--accent-blue);
  text-decoration: none;
}

.docs-content :deep(a:hover) {
  text-decoration: underline;
}

.docs-content :deep(blockquote) {
  margin: 12px 0;
  padding: 10px 16px;
  border-left: 4px solid var(--accent-purple);
  background: var(--bg-primary);
  border-radius: 0 8px 8px 0;
  color: var(--text-secondary);
}

.docs-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin: 16px 0;
}

.docs-content :deep(th),
.docs-content :deep(td) {
  border: 1px solid var(--border-color);
  padding: 8px 10px;
  text-align: left;
}

.docs-content :deep(th) {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-weight: 600;
}

.docs-content :deep(tr:nth-child(even) td) {
  background: rgba(0, 0, 0, 0.12);
}

.docs-content :deep(ul),
.docs-content :deep(ol) {
  margin: 8px 0 12px;
  padding-left: 1.4em;
}

.docs-content :deep(code) {
  font-size: 0.9em;
  padding: 2px 6px;
  background: var(--bg-primary);
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.docs-content :deep(pre) {
  margin: 14px 0;
  padding: 14px 16px;
  background: var(--bg-primary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  overflow-x: auto;
}

.docs-content :deep(pre code) {
  border: none;
  padding: 0;
  background: none;
}
</style>
