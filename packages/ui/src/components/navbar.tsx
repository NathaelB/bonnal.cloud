'use client'

import { Icon } from '@iconify/react'
import * as React from 'react'
import { getAppLinks } from '../lib/app-links'
import { cn } from '../lib/utils'
import { ThemeToggle } from './theme-toggle'

export interface NavbarLink {
  label: string
  href: string
  icon?: string
  external?: boolean
}

export interface NavbarProps {
  brand?: string
  brandHref?: string
  brandIcon?: string
  links?: NavbarLink[]
  /** Current app id — used to highlight the active app link and compute cross-app URLs */
  currentApp: string
  /** Override cross-app URLs (e.g. for local dev) */
  appUrlOverrides?: Partial<Record<string, string>>
  activePath?: string
  maxWidth?: string
  /** Wrap the brand icon in a rounded badge (ferriskey-style) */
  brandBadge?: boolean
  /** Visual style of the cross-app links: 'default' inline, 'segmented' pill group */
  variant?: 'default' | 'segmented'
  /** Breakpoint at which desktop nav links are shown ('md' | 'lg'), default 'md' */
  breakpoint?: 'md' | 'lg'
  /** Extra controls rendered to the left of the brand (e.g. mobile menu) */
  leftSlot?: React.ReactNode
  /** Extra controls rendered between the nav and the theme toggle */
  rightSlot?: React.ReactNode
  sticky?: boolean
  className?: string
}

export function Navbar({
  brand = 'Nathaël Bonnal',
  brandHref = '/',
  brandIcon = '/logo.svg',
  links = [],
  currentApp,
  appUrlOverrides,
  activePath,
  maxWidth = 'max-w-350',
  brandBadge = false,
  variant = 'default',
  breakpoint = 'md',
  leftSlot,
  rightSlot,
  sticky = true,
  className,
}: NavbarProps) {
  const appLinks = getAppLinks(currentApp, appUrlOverrides)
  // Raised "button" treatment for the right-side controls — opt-in with the segmented variant.
  const elevated = variant === 'segmented'

  return (
    <header
      className={cn(
        'z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        sticky && 'sticky top-0',
        className,
      )}
    >
      <div className={cn('mx-auto flex h-14 items-center justify-between px-4 sm:px-6', maxWidth)}>
        {/* Left: mobile menu slot + brand + app links (permanent) */}
        <div className="flex items-center gap-3">
          {leftSlot}
          <a href={brandHref} className="flex items-center gap-2.5 font-semibold text-lg">
            {brandIcon &&
              (brandBadge ? (
                <span className="flex size-8 items-center justify-center rounded-[4px] bg-primary/10 ring-1 ring-primary/15">
                  <img src={brandIcon} alt="" className="size-5" />
                </span>
              ) : (
                <img src={brandIcon} alt="" className="size-5" />
              ))}
            {brand}
          </a>
          {appLinks.length > 0 &&
            (variant === 'segmented' ? (
              <nav
                className={cn(
                  'hidden h-9 items-center gap-0.5 rounded-[4px] border bg-secondary/40 p-1',
                  breakpoint === 'lg' ? 'lg:flex' : 'md:flex',
                )}
              >
                {appLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    className={cn(
                      'flex h-full items-center rounded-[3px] px-3.5 text-sm font-medium transition-colors',
                      link.current
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            ) : (
              <nav className={cn('hidden items-center gap-1', breakpoint === 'lg' ? 'lg:flex' : 'md:flex')}>
                <div className="mx-1 h-5 w-px bg-border" />
                {appLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    className={cn(
                      'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                      link.current
                        ? 'bg-secondary text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
                    )}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            ))}
        </div>

        {/* Right: in-app links (variable) + extra controls + theme toggle */}
        <div className="flex items-center gap-2">
          {links.length > 0 && (
            <nav
              className={cn(
                'hidden items-center',
                breakpoint === 'lg' ? 'lg:flex' : 'md:flex',
                elevated ? 'h-9 gap-0.5 rounded-[4px] border border-border bg-secondary/40 p-1' : 'gap-1',
              )}
            >
              {links.map((link) => {
                const isActive = activePath === link.href
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-1.5 px-3 text-sm font-medium transition-colors',
                      elevated
                        ? cn(
                            'h-full rounded-[3px]',
                            isActive
                              ? 'bg-background text-foreground shadow-sm'
                              : 'text-muted-foreground hover:text-foreground hover:bg-background hover:shadow-sm',
                          )
                        : cn(
                            'rounded-md py-1.5',
                            isActive
                              ? 'bg-secondary text-foreground'
                              : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
                          ),
                    )}
                    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {link.icon && <Icon icon={link.icon} className="size-4" />}
                    {link.label}
                  </a>
                )
              })}
            </nav>
          )}
          {rightSlot}
          <ThemeToggle
            className={cn(elevated && 'size-9 rounded-[3px] border border-border bg-background shadow-sm')}
          />
        </div>
      </div>
    </header>
  )
}
