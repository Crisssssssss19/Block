export interface Block {
  id: string
  type: "heading" | "paragraph" | "bullet-list" | "numbered-list" | "quote" | "code" | "divider" | "image" | "checklist"
  content: string
  properties?: {
    level?: number
    color?: string
    backgroundColor?: string
    alignment?: "left" | "center" | "right"
    checked?: boolean
    checkColor?: string // New: Custom check color
    dueDate?: string // New: Due date for tasks
    priority?: "low" | "medium" | "high" // New: Task priority
  }
}

export interface Page {
  id: string
  title: string
  icon?: string
  coverImage?: string
  blocks: Block[]
  createdAt: Date
  updatedAt: Date
  parentId?: string
}

export interface Theme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    background: string
    surface: string
    text: string
    textSecondary: string
    accent: string
  }
  fonts: {
    heading: string
    body: string
  }
}

export interface UserSettings {
  name: string
  avatar?: string
  defaultCheckColor: string
  notifications: boolean
  theme: string
}

export interface AppData {
  pages: Page[]
  userSettings: UserSettings
  currentPageId: string | null
  currentThemeId: string
}
