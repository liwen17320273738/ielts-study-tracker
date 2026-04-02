export interface DocEntry {
  slug: string
  title: string
  file: string
}

/** 与仓库 /docs 下的 Markdown 对应，顺序即侧栏顺序 */
export const DOCS_MANIFEST: DocEntry[] = [
  { slug: 'index', title: '学习资料索引', file: 'README.md' },
  { slug: '01-strategy', title: '策略与目标（AI 自媒体 × B2B）', file: '01-strategy-ai-media-b2b-trade.md' },
  { slug: '02-trade-english', title: '外贸英语资源清单', file: '02-foreign-trade-english-resources.md' },
  { slug: '03-eight-week', title: '8 周冲刺节奏', file: '03-eight-week-crash-course.md' },
]

export const DOC_FILE_TO_SLUG: Record<string, string> = Object.fromEntries(
  DOCS_MANIFEST.map(d => [d.file, d.slug]),
)

const docLoaders = import.meta.glob('../../docs/*.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>

export async function loadDocRaw(filename: string): Promise<string> {
  const match = Object.entries(docLoaders).find(
    ([path]) => path.replace(/\\/g, '/').split('/').pop() === filename,
  )
  if (!match) throw new Error(`Doc not found: ${filename}`)
  return match[1]() as Promise<string>
}
