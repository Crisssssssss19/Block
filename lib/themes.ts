import type { Theme } from "@/types"

export const themes: Theme[] = [
  {
    id: "default",
    name: "Default",
    colors: {
      primary: "#2563eb",
      secondary: "#64748b",
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#0f172a",
      textSecondary: "#64748b",
      accent: "#3b82f6",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
  },
  {
    id: "dark",
    name: "Dark Mode",
    colors: {
      primary: "#3b82f6",
      secondary: "#94a3b8",
      background: "#0f172a",
      surface: "#1e293b",
      text: "#f1f5f9",
      textSecondary: "#94a3b8",
      accent: "#60a5fa",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
  },
  {
    id: "warm",
    name: "Warm",
    colors: {
      primary: "#ea580c",
      secondary: "#a3a3a3",
      background: "#fefdf8",
      surface: "#fef7ed",
      text: "#1c1917",
      textSecondary: "#78716c",
      accent: "#fb923c",
    },
    fonts: {
      heading: "Playfair Display",
      body: "Source Sans Pro",
    },
  },
  {
    id: "nature",
    name: "Nature",
    colors: {
      primary: "#059669",
      secondary: "#6b7280",
      background: "#f0fdf4",
      surface: "#ecfdf5",
      text: "#064e3b",
      textSecondary: "#6b7280",
      accent: "#10b981",
    },
    fonts: {
      heading: "Merriweather",
      body: "Open Sans",
    },
  },
]
