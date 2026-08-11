import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import ThemeProviderWrapper from '@/components/theme-provider'
import AuroraBackground from '@/components/aurora-background'
import ThreeDBackground from '@/components/3d-background'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Tushar Mishra — Junior DevOps Engineer',
  description:
    'Microsoft Certified Azure Administrator Associate (AZ-104). DevOps Engineer specializing in Azure, AWS, Terraform, Kubernetes, CI/CD and DevSecOps.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#111315',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased relative overflow-x-hidden">
        <ThemeProviderWrapper>
          <AuroraBackground />
          <ThreeDBackground />
          <div className="relative z-10">{children}</div>
        </ThemeProviderWrapper>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}