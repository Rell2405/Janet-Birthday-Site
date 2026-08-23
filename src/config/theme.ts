export interface ThemeConfig {
  colorScheme: "light" | "dark";
  themeColor: string;
  cssVariables: Record<`--${string}`, string>;
}

export const themeConfig = {
  colorScheme: "light",
  themeColor: "#123d35",
  cssVariables: {
    "--background": "42 31% 92%",
    "--foreground": "164 47% 12%",
    "--card": "42 38% 96%",
    "--card-foreground": "164 47% 12%",
    "--primary": "164 55% 22%",
    "--primary-foreground": "42 38% 96%",
    "--secondary": "38 24% 84%",
    "--secondary-foreground": "164 47% 12%",
    "--muted": "38 20% 86%",
    "--muted-foreground": "164 15% 35%",
    "--accent": "36 61% 49%",
    "--accent-foreground": "164 47% 12%",
    "--destructive": "0 84% 60%",
    "--destructive-foreground": "210 40% 98%",
    "--border": "164 16% 72%",
    "--input": "164 16% 72%",
    "--ring": "36 61% 49%",
    "--radius": "0.35rem",
  },
} satisfies ThemeConfig;

export function serializeThemeVariables(theme: ThemeConfig): string {
  return Object.entries(theme.cssVariables)
    .map(([name, value]) => `${name}:${value}`)
    .join(";");
}
