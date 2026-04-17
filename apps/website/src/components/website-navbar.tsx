import type { NavbarLink } from '@explainer/ui'
import { MobileMenu, MobileNavLinks, Navbar, getAppLinks } from '@explainer/ui'

interface WebsiteNavbarProps {
  appUrlOverrides?: Partial<Record<string, string>>
}

export function WebsiteNavbar({ appUrlOverrides }: WebsiteNavbarProps) {
  const appLinks = getAppLinks('website', appUrlOverrides)

  const websiteLinks: NavbarLink[] = [
    { label: 'Projects', href: '#projects' },
    { label: 'Expertise', href: '#expertise' },
    { label: 'Blog', href: '#blog' },
  ]

  return (
    <Navbar
      brand="Nathael Bonnal"
      brandIcon=""
      currentApp="website"
      appUrlOverrides={appUrlOverrides}
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
