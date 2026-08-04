import { useEffect, useState } from 'react';
import { useTranslations } from '../i18n/utils';
import { getTagLabel } from '../lib/tags';

interface TagFilterProps {
  tags: { name: string; count: number }[]
  initialTags?: string[]
  locale?: string
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function readURL() {
  const params = new URLSearchParams(window.location.search)
  const tags = params.get('tags')?.split(',').filter(Boolean) ?? []
  const q = params.get('q') ?? ''
  return { tags, q }
}

function writeURL(selectedTags: string[], query: string) {
  const params = new URLSearchParams()
  if (selectedTags.length > 0) params.set('tags', selectedTags.join(','))
  if (query) params.set('q', query)
  const search = params.toString()
  const url = `${window.location.pathname}${search ? `?${search}` : ''}`
  window.history.replaceState(null, '', url)
}

export function TagFilter({ tags, initialTags = [], locale: initialLocale = 'en' }: TagFilterProps) {
  const [locale, setLocale] = useState(initialLocale)
  const t = useTranslations(locale)
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags)
  const [query, setQuery] = useState<string>('')

  useEffect(() => {
    const { tags: urlTags, q } = readURL()
    if (urlTags.length > 0) setSelectedTags(urlTags)
    if (q) setQuery(q)

    const preDetected = (window as any).__detectedLocale
    if (preDetected && preDetected !== initialLocale) setLocale(preDetected)

    const handleLocaleChange = (e: Event) => {
      setLocale((e as CustomEvent<{ locale: string }>).detail.locale)
    }
    window.addEventListener('locale:change', handleLocaleChange)
    return () => window.removeEventListener('locale:change', handleLocaleChange)
  }, [])

  // View-transition navigations update the URL without a full reload, so the
  // mount effect alone can miss ?tags=. Re-sync the filter from the URL after
  // every navigation (astro:page-load fires on initial load and each transition).
  useEffect(() => {
    const syncFromURL = () => {
      const { tags: urlTags, q } = readURL()
      setSelectedTags(urlTags)
      setQuery(q)
    }
    document.addEventListener('astro:page-load', syncFromURL)
    return () => document.removeEventListener('astro:page-load', syncFromURL)
  }, [])

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const [visibleCount, setVisibleCount] = useState<number | null>(null)
  const hasActiveFilter = selectedTags.length > 0 || query.trim().length > 0

  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>('[data-tags]')
    const normalizedQuery = query.toLowerCase().trim()
    let count = 0

    cards.forEach((card) => {
      const cardTags: string[] = JSON.parse(card.dataset.tags ?? '[]')
      const matchesTags =
        selectedTags.length === 0 || cardTags.some((t) => selectedTags.includes(t))

      const matchesQuery =
        !normalizedQuery ||
        (card.dataset.title ?? '').toLowerCase().includes(normalizedQuery) ||
        (card.dataset.description ?? '').toLowerCase().includes(normalizedQuery)

      const visible = matchesTags && matchesQuery
      card.hidden = !visible
      if (visible && card.style.display !== 'none') count++
    })

    setVisibleCount(count)
    writeURL(selectedTags, query)
    window.dispatchEvent(new Event('tags:filter'))
  }, [selectedTags, query, locale])

  return (
    <>
      <div className="mb-10 space-y-5">
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('tagFilter.placeholder')}
            className="w-full rounded-[3px] border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedTags([])}
            className={`cursor-pointer rounded-[3px] border px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors ${
              selectedTags.length === 0
                ? 'border-primary bg-primary text-white'
                : 'border-border text-muted-foreground hover:border-primary/35 hover:bg-primary/5 hover:text-foreground'
            }`}
          >
            {t('tagFilter.all')}
          </button>
          {tags.map((tag) => {
            const active = selectedTags.includes(tag.name)
            return (
              <button
                key={tag.name}
                type="button"
                onClick={() => toggleTag(tag.name)}
                className={`cursor-pointer rounded-[3px] border px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors ${
                  active
                    ? 'border-primary bg-primary text-white'
                    : 'border-border text-muted-foreground hover:border-primary/35 hover:bg-primary/5 hover:text-foreground'
                }`}
              >
                {getTagLabel(tag.name)}
              </button>
            )
          })}
        </div>
      </div>

      {hasActiveFilter && visibleCount === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-[4px] border border-dashed border-border py-20">
          <svg className="size-10 text-muted-foreground/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
            <path d="M8 11h6" />
          </svg>
          <p className="text-muted-foreground text-lg">{t('index.noResults')}</p>
        </div>
      )}
    </>
  )
}
