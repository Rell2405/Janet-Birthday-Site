export interface ThemeConfig {
  colorScheme: "light" | "dark";
  themeColor: string;
  cssVariables: Record<`--${string}`, string>;
}

export const themeConfig = {
  colorScheme: "dark",
  themeColor: "#0a2317",
  cssVariables: {
    "--background": "222 47% 6%",
    "--foreground": "210 40% 98%",
    "--card": "222 47% 9%",
    "--card-foreground": "210 40% 98%",
    "--primary": "210 90% 56%",
    "--primary-foreground": "222 47% 8%",
    "--secondary": "217 33% 17%",
    "--secondary-foreground": "210 40% 98%",
    "--muted": "217 33% 17%",
    "--muted-foreground": "215 20% 65%",
    "--accent": "43 96% 56%",
    "--accent-foreground": "222 47% 8%",
    "--destructive": "0 84% 60%",
    "--destructive-foreground": "210 40% 98%",
    "--border": "217 33% 20%",
    "--input": "217 33% 20%",
    "--ring": "210 90% 56%",
    "--radius": "0.9rem",
  },
} satisfies ThemeConfig;

export function serializeThemeVariables(theme: ThemeConfig): string {
  return Object.entries(theme.cssVariables)
    .map(([name, value]) => `${name}:${value}`)
    .join(";");
}

