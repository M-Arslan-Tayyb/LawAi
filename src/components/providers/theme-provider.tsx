"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ConfigProvider, theme as antdTheme } from "antd"
import { useTheme } from "next-themes"

function AntdConfigProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: resolvedTheme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#c9a227",
          colorBgContainer: resolvedTheme === "dark" ? "#0a0a0a" : "#ffffff",
          colorBgElevated: resolvedTheme === "dark" ? "#141414" : "#ffffff",
          colorBorder: resolvedTheme === "dark" ? "#262626" : "#e5e5e5",
          colorText: resolvedTheme === "dark" ? "#fafafa" : "#0a0a0a",
          colorTextSecondary: resolvedTheme === "dark" ? "#a3a3a3" : "#525252",
          borderRadius: 8,
          fontFamily: "var(--font-sans)",
        },
        components: {
          Button: {
            primaryShadow: "none",
          },
          Input: {
            activeShadow: "none",
          },
          Table: {
            headerBg: resolvedTheme === "dark" ? "#141414" : "#fafafa",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <AntdConfigProvider>{children}</AntdConfigProvider>
    </NextThemesProvider>
  )
}
