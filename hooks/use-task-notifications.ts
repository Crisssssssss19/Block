"use client"

import { useEffect, useRef } from "react"
import type { Page } from "@/types"

export function useTaskNotifications(pages: Page[], userSettings: { notifications: boolean }) {
  const notifiedTasks = useRef(new Set<string>())

  useEffect(() => {
    if (!userSettings.notifications) return

    const checkOverdueTasks = () => {
      const now = new Date()

      pages.forEach((page) => {
        page.blocks.forEach((block) => {
          if (block.type === "checklist" && !block.properties?.checked && block.properties?.dueDate) {
            const dueDate = new Date(block.properties.dueDate)
            const timeDiff = now.getTime() - dueDate.getTime()
            const hoursDiff = timeDiff / (1000 * 3600)

            // Show notification if task is overdue by more than 1 hour and not already notified
            const taskKey = `${page.id}-${block.id}`
            if (hoursDiff > 1 && !notifiedTasks.current.has(taskKey)) {
              showTaskNotification(block.content, page.title, block.properties.priority)
              notifiedTasks.current.add(taskKey)
            }
          }
        })
      })
    }

    const showTaskNotification = (taskContent: string, pageTitle: string, priority?: string) => {
      if ("Notification" in window && Notification.permission === "granted") {
        const priorityEmoji = priority === "high" ? "🔴" : priority === "medium" ? "🟡" : "🟢"

        new Notification(`${priorityEmoji} Overdue Task`, {
          body: `"${taskContent}" in "${pageTitle}" is overdue!`,
          icon: "/favicon.ico",
          tag: `task-${taskContent}`,
        })
      }
    }

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }

    // Check immediately
    checkOverdueTasks()

    // Check every 30 minutes
    const interval = setInterval(checkOverdueTasks, 30 * 60 * 1000)

    return () => clearInterval(interval)
  }, [pages.length, userSettings.notifications]) // Only depend on pages length and notifications setting
}
