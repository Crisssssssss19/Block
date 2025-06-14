"use client"

import { useState } from "react"
import { useApp } from "@/contexts/app-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, Sparkles } from "lucide-react"

export function UserOnboarding() {
  const { userSettings, setUserSettings, currentTheme } = useApp()
  const [tempName, setTempName] = useState("")
  const [isOpen, setIsOpen] = useState(!userSettings.name)

  const handleSave = () => {
    if (tempName.trim()) {
      setUserSettings({ ...userSettings, name: tempName.trim() })
      setIsOpen(false)
    }
  }

  // Generate initials preview
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <span className="text-2xl">👋</span>
            <span style={{ color: currentTheme.colors.text }}>Welcome!</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 text-center">
          {/* Dynamic Avatar Preview */}
          <div className="relative">
            <div
              className="w-24 h-24 rounded-full mx-auto flex items-center justify-center shadow-lg transition-all duration-500"
              style={{
                backgroundColor: currentTheme.colors.primary,
                boxShadow: `0 8px 25px ${currentTheme.colors.primary}40`,
              }}
            >
              {tempName ? (
                <span className="text-white font-bold text-xl">{getInitials(tempName)}</span>
              ) : (
                <User className="h-12 w-12 text-white" />
              )}
            </div>

            {/* Sparkle animation */}
            <div className="absolute -top-2 -right-2">
              <Sparkles className="h-6 w-6 animate-pulse" style={{ color: currentTheme.colors.accent }} />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold" style={{ color: currentTheme.colors.text }}>
              Let's get started!
            </h3>
            <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
              Your name will appear throughout your workspace and help personalize your experience.
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-left">
              <Label htmlFor="userName" style={{ color: currentTheme.colors.text }}>
                Your Name
              </Label>
              <Input
                id="userName"
                placeholder="Enter your name..."
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                className="mt-2 text-center font-medium"
                style={{
                  borderColor: currentTheme.colors.primary + "40",
                  backgroundColor: currentTheme.colors.surface,
                }}
                autoFocus
              />
            </div>

            {/* Preview of how name will look */}
            {tempName && (
              <div
                className="p-3 rounded-lg border-2 border-dashed transition-all duration-300"
                style={{
                  borderColor: currentTheme.colors.primary + "40",
                  backgroundColor: currentTheme.colors.surface,
                }}
              >
                <p className="text-xs font-medium" style={{ color: currentTheme.colors.textSecondary }}>
                  Preview:
                </p>
                <p className="font-semibold" style={{ color: currentTheme.colors.text }}>
                  Welcome back, {tempName}!
                </p>
              </div>
            )}

            <Button
              onClick={handleSave}
              disabled={!tempName.trim()}
              className="w-full transition-all duration-200 hover:shadow-lg disabled:opacity-50"
              style={{
                backgroundColor: tempName.trim() ? currentTheme.colors.primary : currentTheme.colors.secondary,
                color: "white",
              }}
            >
              {tempName.trim() ? "Continue to Workspace" : "Enter your name to continue"}
            </Button>
          </div>

          {/* Theme preview */}
          <div className="pt-4 border-t" style={{ borderColor: currentTheme.colors.secondary + "20" }}>
            <p className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
              Using <span className="font-medium">{currentTheme.name}</span> theme
            </p>
            <div className="flex justify-center gap-1 mt-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentTheme.colors.primary }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentTheme.colors.secondary }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentTheme.colors.accent }} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
