'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

// Use a loose props type to avoid depending on internal next-themes types
export function ThemeProvider({ children, ...props }: any) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem {...props}>
      {children}
    </NextThemesProvider>
  )
}


