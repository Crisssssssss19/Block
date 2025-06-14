"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { Page, Block, Theme, UserSettings, AppData } from "@/types"
import { themes } from "@/lib/themes"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useTaskNotifications } from "@/hooks/use-task-notifications"

interface AppContextType {
  pages: Page[]
  currentPage: Page | null
  currentTheme: Theme
  userSettings: UserSettings
  sidebarOpen: boolean
  setPages: (pages: Page[]) => void
  setCurrentPage: (page: Page | null) => void
  setCurrentTheme: (theme: Theme) => void
  setUserSettings: (settings: UserSettings) => void
  setSidebarOpen: (open: boolean) => void
  addPage: (page: Omit<Page, "id" | "createdAt" | "updatedAt">) => void
  updatePage: (pageId: string, updates: Partial<Page>) => void
  deletePage: (pageId: string) => void
  addBlock: (pageId: string, block: Omit<Block, "id">) => void
  updateBlock: (pageId: string, blockId: string, updates: Partial<Block>) => void
  deleteBlock: (pageId: string, blockId: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const defaultUserSettings: UserSettings = {
  name: "",
  defaultCheckColor: "#10b981",
  notifications: true,
  theme: "default",
}

const defaultAppData: AppData = {
  pages: [],
  userSettings: defaultUserSettings,
  currentPageId: null,
  currentThemeId: "default",
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [appData, setAppData] = useLocalStorage<AppData>("notion-app-data", defaultAppData)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const [pages, setPages] = useState<Page[]>([])
  const [currentPage, setCurrentPage] = useState<Page | null>(null)
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0])
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultUserSettings)

  // Initialize task notifications
  useTaskNotifications(pages, userSettings)

  // Initialize data only once
  useEffect(() => {
    if (!isInitialized) {
      const foundTheme = themes.find((t) => t.id === appData.currentThemeId) || themes[0]
      setCurrentTheme(foundTheme)
      setUserSettings(appData.userSettings)

      if (appData.pages.length > 0) {
        setPages(appData.pages)
        if (appData.currentPageId) {
          const foundPage = appData.pages.find((p) => p.id === appData.currentPageId)
          setCurrentPage(foundPage || null)
        }
      } else {
        // Initialize with sample data if no pages exist
        const samplePage: Page = {
          id: "1",
          title: "Welcome to Your Personal Notion",
          icon: "👋",
          blocks: [
            {
              id: "1",
              type: "heading",
              content: "Getting Started",
              properties: { level: 1, color: foundTheme.colors.primary },
            },
            {
              id: "2",
              type: "paragraph",
              content:
                "This is your personalized Notion-like app with enhanced customization options. Tap anywhere to start editing!",
            },
            {
              id: "3",
              type: "heading",
              content: "Quick Tasks",
              properties: { level: 2 },
            },
            {
              id: "4",
              type: "checklist",
              content: "Set up your profile name",
              properties: {
                checked: false,
                checkColor: "#3b82f6",
                priority: "high",
                dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              },
            },
            {
              id: "5",
              type: "checklist",
              content: "Try customizing check colors",
              properties: {
                checked: false,
                checkColor: "#10b981",
                priority: "medium",
              },
            },
            {
              id: "6",
              type: "checklist",
              content: "Create your first custom page",
              properties: {
                checked: false,
                checkColor: "#f59e0b",
                priority: "low",
              },
            },
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        setPages([samplePage])
        setCurrentPage(samplePage)
      }

      setIsInitialized(true)
    }
  }, [appData, isInitialized])

  // Save to localStorage when data changes (but only after initialization)
  const saveToLocalStorage = useCallback(() => {
    if (isInitialized) {
      const dataToSave: AppData = {
        pages,
        userSettings,
        currentPageId: currentPage?.id || null,
        currentThemeId: currentTheme.id,
      }
      setAppData(dataToSave)
    }
  }, [pages, userSettings, currentPage, currentTheme, isInitialized, setAppData])

  // Debounced save effect
  useEffect(() => {
    const timeoutId = setTimeout(saveToLocalStorage, 500)
    return () => clearTimeout(timeoutId)
  }, [saveToLocalStorage])

  const addPage = useCallback((pageData: Omit<Page, "id" | "createdAt" | "updatedAt">) => {
    const newPage: Page = {
      ...pageData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setPages((prev) => [...prev, newPage])
    return newPage
  }, [])

  const updatePage = useCallback((pageId: string, updates: Partial<Page>) => {
    setPages((prev) => prev.map((page) => (page.id === pageId ? { ...page, ...updates, updatedAt: new Date() } : page)))

    setCurrentPage((prev) => {
      if (prev?.id === pageId) {
        return { ...prev, ...updates, updatedAt: new Date() }
      }
      return prev
    })
  }, [])

  const deletePage = useCallback((pageId: string) => {
    console.log("Deleting page with ID:", pageId) // Debug log

    setPages((prev) => {
      const newPages = prev.filter((page) => page.id !== pageId)
      console.log("Pages after deletion:", newPages.length) // Debug log
      return newPages
    })

    setCurrentPage((prev) => {
      if (prev?.id === pageId) {
        console.log("Current page was deleted, setting to null") // Debug log
        return null
      }
      return prev
    })
  }, [])

  const addBlock = useCallback(
    (pageId: string, blockData: Omit<Block, "id">) => {
      const newBlock: Block = {
        ...blockData,
        id: Date.now().toString(),
        properties: {
          ...blockData.properties,
          checkColor:
            blockData.type === "checklist" ? userSettings.defaultCheckColor : blockData.properties?.checkColor,
        },
      }

      setPages((prev) =>
        prev.map((page) =>
          page.id === pageId ? { ...page, blocks: [...page.blocks, newBlock], updatedAt: new Date() } : page,
        ),
      )

      setCurrentPage((prev) => {
        if (prev?.id === pageId) {
          return { ...prev, blocks: [...prev.blocks, newBlock], updatedAt: new Date() }
        }
        return prev
      })
    },
    [userSettings.defaultCheckColor],
  )

  const updateBlock = useCallback((pageId: string, blockId: string, updates: Partial<Block>) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id === pageId
          ? {
              ...page,
              blocks: page.blocks.map((block) => (block.id === blockId ? { ...block, ...updates } : block)),
              updatedAt: new Date(),
            }
          : page,
      ),
    )

    setCurrentPage((prev) => {
      if (prev?.id === pageId) {
        return {
          ...prev,
          blocks: prev.blocks.map((block) => (block.id === blockId ? { ...block, ...updates } : block)),
          updatedAt: new Date(),
        }
      }
      return prev
    })
  }, [])

  const deleteBlock = useCallback((pageId: string, blockId: string) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id === pageId
          ? {
              ...page,
              blocks: page.blocks.filter((block) => block.id !== blockId),
              updatedAt: new Date(),
            }
          : page,
      ),
    )

    setCurrentPage((prev) => {
      if (prev?.id === pageId) {
        return {
          ...prev,
          blocks: prev.blocks.filter((block) => block.id !== blockId),
          updatedAt: new Date(),
        }
      }
      return prev
    })
  }, [])

  return (
    <AppContext.Provider
      value={{
        pages,
        currentPage,
        currentTheme,
        userSettings,
        sidebarOpen,
        setPages,
        setCurrentPage,
        setCurrentTheme,
        setUserSettings,
        setSidebarOpen,
        addPage,
        updatePage,
        deletePage,
        addBlock,
        updateBlock,
        deleteBlock,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
