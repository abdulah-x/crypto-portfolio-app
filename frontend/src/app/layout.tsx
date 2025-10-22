import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/providers/AuthProvider";
import { ReactQueryProvider } from "@/lib/react-query";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VaultX - Professional Crypto Portfolio Tracker",
  description: "Track, analyze, and optimize your cryptocurrency investments with VaultX. Real-time data, advanced analytics, and professional-grade portfolio management.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon', sizes: '32x32', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
    other: [
      {
        rel: 'icon',
        url: '/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        rel: 'icon',
        url: '/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
      {
        rel: 'mask-icon',
        url: '/favicon.svg',
        color: '#8B5CF6',
      },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: '#8B5CF6',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


