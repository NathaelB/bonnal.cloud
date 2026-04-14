import type { NavbarLink } from '@explainer/ui'
import { MobileMenu, MobileNavLinks, Navbar, getAppLinks } from '@explainer/ui'

interface WebsiteNavbarProps {
  appUrlOverrides?: Partial<Record<string, string>>
}

export function WebsiteNavbar({ appUrlOverrides }: WebsiteNavbarProps) {
  const appLinks = getAppLinks('website', appUrlOverrides).filter((link) => link.id !== 'docs')

  const websiteLinks: NavbarLink[] = [
    { label: 'Projects', href: '#projects' },
    { label: 'Expertise', href: '#expertise' },
    { label: 'Blog', href: '#blog' },
  ]

  return (
    <Navbar
      brand="Nathael Bonnal"
      currentApp="website"
      appUrlOverrides={appUrlOverrides}
      excludedAppIds={['docs']}
      links={websiteLinks}
      showThemeToggle={false}
      leftSlot={
        <MobileMenu>
          <MobileNavLinks
            links={websiteLinks}
            appLinks={appLinks}
          />
        </MobileMenu>
      }
    />
  )
}
