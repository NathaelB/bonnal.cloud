import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import satori from 'satori'
import * as culori from 'culori'
import { resolveColor } from './colors'

export type ThumbnailTheme = 'default' | 'gradient' | 'minimal'

export interface ThumbnailIcon {
  /** Pixel grid rows — '.' is empty, every other character keys into `colors` */
  grid: string[]
  colors: Record<string, string>
}

const __dirname = dirname(fileURLToPath(import.meta.url))

const interRegular = readFileSync(resolve(__dirname, 'assets/Inter-Regular.woff'))
const interSemiBold = readFileSync(resolve(__dirname, 'assets/Inter-SemiBold.woff'))
const interBold = readFileSync(resolve(__dirname, 'assets/Inter-Bold.woff'))

export interface ThumbnailOptions {
  headline?: string
  title: string
  description?: string
  primaryColor?: string
  icon?: ThumbnailIcon
  theme?: ThumbnailTheme
  scheme?: 'light' | 'dark'
}

const fonts = [
  { name: 'Inter', data: interRegular, weight: 400 as const },
  { name: 'Inter', data: interSemiBold, weight: 600 as const },
  { name: 'Inter', data: interBold, weight: 700 as const },
]

function TextContent({
  headline,
  title,
  description,
  primaryColor,
}: {
  headline?: string
  title: string
  description?: string
  primaryColor: string
}) {
  return (
    <div tw="flex flex-col w-[800px] pl-[100px]">
      {headline && (
        <p tw="uppercase text-[24px] mb-4" style={{ color: primaryColor, fontWeight: 600 }}>
          {headline}
        </p>
      )}
      <h1
        tw="w-[800px] m-0 text-[75px] font-bold mb-4"
        style={{
          display: 'block',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          color: 'white',
          fontWeight: 700,
        }}
      >
        {title}
      </h1>
      {description && (
        <p
          tw="text-[32px] text-[#E4E4E7] leading-tight"
          style={{
            display: 'block',
            WebkitLineClamp: 3,
            textOverflow: 'ellipsis',
            opacity: 0.5,
          }}
        >
          {description}
        </p>
      )}
    </div>
  )
}

const GRID = 60

// [col, row, widthCells, heightCells, tintIndex]
const SQUARE_CELLS: [number, number, number, number, number][] = [
  [4, 0, 1, 1, 0], [7, 0, 1, 1, 3], [12, 0, 1, 2, 1], [2, 1, 1, 1, 5], [9, 1, 1, 1, 2], [14, 0, 2, 1, 3],
  [0, 2, 1, 2, 0], [5, 3, 1, 1, 3], [11, 2, 1, 1, 4], [15, 3, 1, 1, 0], [2, 4, 1, 1, 2], [13, 4, 1, 1, 5],
  [8, 4, 1, 1, 1], [3, 6, 1, 1, 3], [10, 6, 1, 2, 0], [6, 7, 1, 1, 4], [14, 6, 1, 1, 2], [1, 7, 1, 1, 3],
  [12, 7, 2, 1, 1], [7, 5, 1, 1, 5],
]

function PixelIcon({ icon, size }: { icon: ThumbnailIcon; size: number }) {
  const w = icon.grid[0].length
  const h = icon.grid.length
  const rects: any[] = []
  icon.grid.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x]
      if (ch === '.') continue
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={icon.colors[ch]} />)
    }
  })
  return (
    <svg width={size} height={(size * h) / w} viewBox={`0 0 ${w} ${h}`} shape-rendering="crispEdges">
      {rects}
    </svg>
  )
}

function toRgba(hex: string, alpha: number): string {
  const rgb = culori.rgb(culori.parse(hex) ?? { mode: 'rgb', r: 0, g: 0, b: 0 })
  const r = Math.round((rgb.r ?? 0) * 255)
  const g = Math.round((rgb.g ?? 0) * 255)
  const b = Math.round((rgb.b ?? 0) * 255)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function DefaultTheme({
  headline,
  title,
  description,
  primaryColor,
  icon,
  scheme,
}: Required<Pick<ThumbnailOptions, 'primaryColor'>> & Omit<ThumbnailOptions, 'primaryColor' | 'theme'> & { scheme: 'light' | 'dark' }) {
  const isDark = scheme === 'dark'
  const bg = isDark ? '#0d1117' : '#FBF9F6'
  const titleColor = isDark ? '#F4F4F5' : '#18181b'
  const descColor = isDark ? '#9CA3AF' : '#6b7280'
  const a = isDark ? [0.5, 0.34, 0.22, 0.13] : [0.42, 0.28, 0.18, 0.1]
  const tints = [
    toRgba(primaryColor, a[0]),
    toRgba(primaryColor, a[1]),
    toRgba(primaryColor, a[2]),
    toRgba(primaryColor, a[3]),
    isDark ? 'rgba(160, 170, 190, 0.1)' : 'rgba(120, 130, 150, 0.14)',
    isDark ? 'rgba(200, 180, 155, 0.09)' : 'rgba(205, 180, 150, 0.2)',
  ]

  return (
    <div tw="w-full h-full flex flex-col justify-center" style={{ backgroundColor: bg, position: 'relative' }}>
      {SQUARE_CELLS.map(([c, r, w, h, ci], i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: c * GRID,
            top: r * GRID,
            width: w * GRID,
            height: h * GRID,
            backgroundColor: tints[ci],
          }}
        />
      ))}

      <div tw="flex flex-col pl-[96px]" style={{ position: 'relative', width: 820 }}>
        {headline && (
          <div tw="flex items-center mb-[20px]" style={{ gap: 14 }}>
            {icon && <PixelIcon icon={icon} size={34} />}
            <p tw="uppercase text-[24px]" style={{ color: primaryColor, fontWeight: 700, letterSpacing: 3 }}>
              {headline}
            </p>
          </div>
        )}
        <h1
          tw="m-0 text-[66px]"
          style={{
            display: 'block',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            color: titleColor,
            fontWeight: 700,
            letterSpacing: -1.5,
            lineHeight: 1.05,
            maxWidth: 760,
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            tw="text-[27px] mt-[26px]"
            style={{
              display: 'block',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              color: descColor,
              lineHeight: 1.3,
              maxWidth: 640,
            }}
          >
            {description}
          </p>
        )}
      </div>

      <svg style={{ position: 'absolute', left: 70, bottom: 96 }} width="34" height="34">
        <circle cx="17" cy="17" r="15" fill="none" stroke={primaryColor} strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
      </svg>
      <svg style={{ position: 'absolute', left: 64, bottom: 44 }} width="40" height="34">
        <path d="M20 4 L37 30 L3 30 Z" fill="none" stroke={primaryColor} strokeWidth="2" opacity="0.55" />
      </svg>
    </div>
  )
}

function GradientTheme({ headline, title, description, primaryColor }: Required<Pick<ThumbnailOptions, 'primaryColor'>> & Omit<ThumbnailOptions, 'primaryColor' | 'theme'>) {
  return (
    <div
      tw="w-full h-full flex flex-col justify-center"
      style={{
        background: `linear-gradient(135deg, #020420 0%, ${primaryColor}33 50%, #020420 100%)`,
      }}
    >
      <div
        tw="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 70% 30%, ${primaryColor}44 0%, transparent 60%)`,
        }}
      />
      <TextContent headline={headline} title={title} description={description} primaryColor={primaryColor} />
    </div>
  )
}

function MinimalTheme({ headline, title, description, primaryColor }: Required<Pick<ThumbnailOptions, 'primaryColor'>> & Omit<ThumbnailOptions, 'primaryColor' | 'theme'>) {
  return (
    <div tw="w-full h-full flex flex-col justify-center bg-[#020420]">
      <div
        tw="absolute left-0 top-0 bottom-0 w-[6px]"
        style={{ backgroundColor: primaryColor }}
      />
      <TextContent headline={headline} title={title} description={description} primaryColor={primaryColor} />
    </div>
  )
}

export async function generateThumbnail(options: ThumbnailOptions): Promise<string> {
  const { headline, title, description, icon, theme = 'default', scheme = 'light' } = options
  const primaryColor = resolveColor(options.primaryColor)

  const props = { headline, title, description, primaryColor, icon }

  const themeElement =
    theme === 'gradient' ? <GradientTheme {...props} /> :
    theme === 'minimal' ? <MinimalTheme {...props} /> :
    <DefaultTheme {...props} scheme={scheme} />

  return satori(themeElement, {
    width: 1200,
    height: 630,
    fonts,
  })
}
