import { defaultConfig, t, type SiteConfig } from '@explainer/config'
import { Icon } from '@iconify/react'

export interface FooterProps {
  config?: SiteConfig
  locale?: string
  appUrlOverrides?: Partial<Record<string, string>>
}

export function Footer({ config = defaultConfig, locale: localeProp, appUrlOverrides }: FooterProps) {
  const locale = localeProp ?? config.defaultLocale
  const blogUrl = appUrlOverrides?.blog ?? '/'
  const { footer, name } = config

  const copyrightText = t(locale, footer.copyright).replace('{year}', String(new Date().getFullYear()))
  const builtWithParts = t(locale, footer.builtWith).split('{icon}')

  return (
    <footer className="mt-12 border-t pt-12 pb-8">
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-[1.6fr_1fr]">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-[4px] border border-primary/20 bg-primary/10 text-primary">
              <Icon icon="lucide:book-open" className="size-5" />
            </span>
            <span className="text-base font-bold text-foreground">{name}</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            {t(locale, footer.description)}
          </p>
        </div>

        {/* Resources */}
        <div>
          <h4 className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            {t(locale, footer.columns.resources)}
          </h4>
          <ul className="space-y-1">
            {footer.links.resources.map((link) => {
              const href = link.appId === 'blog' ? blogUrl : link.href
              return (
                <li key={link.label}>
                  <a
                    href={href}
                    className="inline-flex items-center gap-1.5 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {t(locale, link.label)}
                    {link.external && <Icon icon="lucide:arrow-up-right" className="size-3.5" />}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t pt-6 font-mono text-[11px] uppercase tracking-[0.04em] text-muted-foreground sm:flex-row">
        <p>{copyrightText}</p>
        <p className="flex items-center gap-1.5">
          {builtWithParts[0]} ❤️ {builtWithParts[1]}
        </p>
      </div>
    </footer>
  )
}
