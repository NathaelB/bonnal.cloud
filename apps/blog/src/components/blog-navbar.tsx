import type { NavbarLink } from '@explainer/ui'
import { MobileMenu, MobileNavLinks, Navbar, getAppLinks } from '@explainer/ui'
import { useTranslations } from '../i18n/utils'

interface BlogNavbarProps {
  activePath: string
  appUrlOverrides?: Partial<Record<string, string>>
}

export function BlogNavbar({ activePath, appUrlOverrides }: BlogNavbarProps) {
  const appLinks = getAppLinks('blog', appUrlOverrides)
  const t = useTranslations('en')

  const blogLinks: NavbarLink[] = [
    { label: t('nav.allArticles'), href: '/', icon: 'lucide:newspaper' },
    { label: t('nav.rss'), href: '/rss.xml', icon: 'lucide:rss' },
  ]

  return (
    <Navbar
      currentApp="blog"
      appUrlOverrides={appUrlOverrides}
      brandHref={appUrlOverrides?.website ?? '/'}
      brandBadge
      variant="segmented"
      links={blogLinks}
      activePath={activePath}
      leftSlot={
        <MobileMenu>
          <MobileNavLinks
            links={blogLinks}
            appLinks={appLinks}
            activePath={activePath}
          />
        </MobileMenu>
      }
    />
  )
}
