"use client"

import { useState } from "react"
import { useApp } from "@/contexts/app-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { User, Bell, Settings } from "lucide-react"

export function UserProfile() {
  const { userSettings, setUserSettings, currentTheme } = useApp()
  const [tempSettings, setTempSettings] = useState(userSettings)
  const [isOpen, setIsOpen] = useState(false)

  const handleSave = () => {
    setUserSettings(tempSettings)
    setIsOpen(false)
  }

  const checkColors = [
    "#10b981", // Green
    "#3b82f6", // Blue
    "#f59e0b", // Yellow
    "#ef4444", // Red
    "#8b5cf6", // Purple
    "#06b6d4", // Cyan
    "#f97316", // Orange
    "#84cc16", // Lime
  ]

  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 p-3 h-auto hover:bg-opacity-50 transition-all duration-200"
          style={{
            backgroundColor: currentTheme.colors.background,
            borderColor: currentTheme.colors.secondary + "20",
          }}
        >
          <div className="flex items-center gap-3 w-full">
            {/* Avatar with dynamic colors */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm transition-all duration-300"
              style={{
                backgroundColor: currentTheme.colors.primary,
                boxShadow: `0 0 0 2px ${currentTheme.colors.primary}20`,
              }}
            >
              {userSettings.name ? getInitials(userSettings.name) : <User className="h-5 w-5" />}
            </div>

            <div className="flex-1 text-left">
              <p
                className="font-medium text-sm transition-colors duration-200"
                style={{ color: currentTheme.colors.text }}
              >
                {userSettings.name || "Set up profile"}
              </p>
              <p
                className="text-xs transition-colors duration-200"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                {userSettings.name ? "Personal account" : "Click to configure"}
              </p>
            </div>

            <Settings
              className="h-4 w-4 opacity-60 transition-opacity group-hover:opacity-100"
              style={{ color: currentTheme.colors.textSecondary }}
            />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle style={{ color: currentTheme.colors.text }}>Profile Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Profile Preview */}
          <div
            className="flex items-center gap-4 p-4 rounded-lg"
            style={{ backgroundColor: currentTheme.colors.surface }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all duration-300"
              style={{
                backgroundColor: currentTheme.colors.primary,
                boxShadow: `0 4px 12px ${currentTheme.colors.primary}30`,
              }}
            >
              {tempSettings.name ? getInitials(tempSettings.name) : <User className="h-8 w-8" />}
            </div>
            <div>
              <p className="font-semibold text-lg" style={{ color: currentTheme.colors.text }}>
                {tempSettings.name || "Your Name"}
              </p>
              <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                Personal workspace
              </p>
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" style={{ color: currentTheme.colors.text }}>
              Your Name
            </Label>
            <Input
              id="name"
              placeholder="Enter your name..."
              value={tempSettings.name}
              onChange={(e) => setTempSettings((prev) => ({ ...prev, name: e.target.value }))}
              style={{
                borderColor: currentTheme.colors.secondary + "30",
                backgroundColor: currentTheme.colors.background,
              }}
            />
          </div>

          {/* Default Check Color */}
          <div className="space-y-3">
            <Label style={{ color: currentTheme.colors.text }}>Default Check Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {checkColors.map((color) => (
                <button
                  key={color}
                  className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                    tempSettings.defaultCheckColor === color
                      ? "border-gray-400 ring-2 ring-gray-300 scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setTempSettings((prev) => ({ ...prev, defaultCheckColor: color }))}
                />
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div
            className="flex items-center justify-between p-3 rounded-lg"
            style={{ backgroundColor: currentTheme.colors.surface }}
          >
            <div className="space-y-1">
              <Label className="flex items-center gap-2" style={{ color: currentTheme.colors.text }}>
                <Bell className="h-4 w-4" />
                Task Notifications
              </Label>
              <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                Get notified about overdue tasks
              </p>
            </div>
            <Switch
              checked={tempSettings.notifications}
              onCheckedChange={(checked) => setTempSettings((prev) => ({ ...prev, notifications: checked }))}
            />
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="w-full transition-all duration-200 hover:shadow-lg"
            style={{
              backgroundColor: currentTheme.colors.primary,
              color: "white",
            }}
          >
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
