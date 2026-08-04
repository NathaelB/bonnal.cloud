export interface TagDef {
  en: string
}

/**
 * Central tag registry. Posts reference tags by UID (like `author`),
 * and the label is resolved at render time.
 */
export const tags: Record<string, TagDef> = {
  ai: { en: 'AI' },
  architecture: { en: 'Architecture' },
  backend: { en: 'Backend' },
  career: { en: 'Career' },
  dart: { en: 'Dart' },
  development: { en: 'Development' },
  environment: { en: 'Environment' },
  ferrislabs: { en: 'FerrisLabs' },
  hot_reload: { en: 'Hot Reload' },
  open_source: { en: 'Open Source' },
  opinion: { en: 'Opinion' },
  rust: { en: 'Rust' },
  security: { en: 'Security' },
  sovereignty: { en: 'Sovereignty' },
  tools: { en: 'Tools' },
}

/** Resolve a tag UID to its label (falls back to the raw uid). */
export function getTagLabel(uid: string): string {
  const tag = tags[uid]
  if (!tag) return uid
  return tag.en ?? uid
}
