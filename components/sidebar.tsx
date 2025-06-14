"use client"

import { useState } from "react"
import { useApp } from "@/contexts/app-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Palette, X, Search, MoreHorizontal, Trash2, Edit3, Copy, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { themes } from "@/lib/themes"
import { UserProfile } from "@/components/user-profile"

export function Sidebar() {
  const {
    pages,
    currentPage,
    currentTheme,
    userSettings,
    sidebarOpen,
    setSidebarOpen,
    setCurrentPage,
    setCurrentTheme,
    addPage,
    deletePage,
    updatePage,
  } = useApp()

  const [searchTerm, setSearchTerm] = useState("")
  const [newPageTitle, setNewPageTitle] = useState("")
  const [editingPageId, setEditingPageId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [pageToDelete, setPageToDelete] = useState<string | null>(null)

  const filteredPages = pages.filter((page) => page.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleCreatePage = () => {
    if (newPageTitle.trim()) {
      const newPage = addPage({
        title: newPageTitle,
        icon: "📄",
        blocks: [],
      })
      setCurrentPage(newPage)
      setNewPageTitle("")
      setSidebarOpen(false)
    }
  }

  const handleDeletePage = (pageId: string) => {
    deletePage(pageId)
    if (currentPage?.id === pageId) {
      const remainingPages = pages.filter((p) => p.id !== pageId)
      setCurrentPage(remainingPages.length > 0 ? remainingPages[0] : null)
    }
    setDeleteConfirmOpen(false)
    setPageToDelete(null)
  }

  const handleDuplicatePage = (page: any) => {
    const duplicatedPage = addPage({
      title: `${page.title} (Copy)`,
      icon: page.icon,
      blocks: page.blocks.map((block: any) => ({
        ...block,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      })),
    })
    setCurrentPage(duplicatedPage)
    setSidebarOpen(false)
  }

  const handleStartEditing = (page: any) => {
    setEditingPageId(page.id)
    setEditingTitle(page.title)
  }

  const handleSaveEdit = () => {
    if (editingPageId && editingTitle.trim()) {
      updatePage(editingPageId, { title: editingTitle.trim() })
      setEditingPageId(null)
      setEditingTitle("")
    }
  }

  const handleCancelEdit = () => {
    setEditingPageId(null)
    setEditingTitle("")
  }

  const openDeleteConfirm = (pageId: string) => {
    setPageToDelete(pageId)
    setDeleteConfirmOpen(true)
  }

  if (!sidebarOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* Overlay for mobile */}
      <div className="absolute inset-0 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />

      {/* Sidebar content */}
      <div
        className="absolute left-0 top-0 h-full w-80 shadow-xl lg:relative lg:shadow-none border-r"
        style={{
          backgroundColor: currentTheme.colors.surface,
          borderColor: currentTheme.colors.secondary + "20",
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header with user greeting */}
          <div className="p-4 border-b" style={{ borderColor: currentTheme.colors.secondary + "20" }}>
            <div className="flex items-center justify-between mb-2">
              <div>
                {userSettings.name && (
                  <p className="text-sm font-medium" style={{ color: currentTheme.colors.textSecondary }}>
                    Welcome back,
                  </p>
                )}
                <h2 className="text-lg font-bold" style={{ color: currentTheme.colors.text }}>
                  {userSettings.name ? `${userSettings.name}'s Workspace` : "Your Workspace"}
                </h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="lg:hidden">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                style={{
                  backgroundColor: currentTheme.colors.background,
                  borderColor: currentTheme.colors.secondary + "30",
                }}
              />
            </div>
          </div>

          {/* Pages list */}
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-2">
              {filteredPages.map((page) => (
                <div
                  key={page.id}
                  className={`group relative rounded-lg border transition-all duration-200 ${
                    currentPage?.id === page.id ? "shadow-sm" : "hover:shadow-sm"
                  }`}
                  style={{
                    backgroundColor:
                      currentPage?.id === page.id ? currentTheme.colors.primary + "08" : currentTheme.colors.background,
                    borderColor:
                      currentPage?.id === page.id
                        ? currentTheme.colors.primary + "30"
                        : currentTheme.colors.secondary + "20",
                  }}
                >
                  {editingPageId === page.id ? (
                    <div className="p-3">
                      <Input
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit()
                          if (e.key === "Escape") handleCancelEdit()
                        }}
                        onBlur={handleSaveEdit}
                        className="text-sm"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setCurrentPage(page)
                          setSidebarOpen(false)
                        }}
                        className="w-full p-3 text-left flex items-center gap-3 hover:bg-opacity-50 transition-colors rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          <div
                            className="w-8 h-8 rounded-md flex items-center justify-center text-lg transition-all duration-200"
                            style={{ backgroundColor: currentTheme.colors.primary + "15" }}
                          >
                            {page.icon || (
                              <FileText className="h-4 w-4" style={{ color: currentTheme.colors.primary }} />
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-sm" style={{ color: currentTheme.colors.text }}>
                            {page.title}
                          </p>
                          <p className="text-xs truncate mt-0.5" style={{ color: currentTheme.colors.textSecondary }}>
                            {page.blocks.length} {page.blocks.length === 1 ? "block" : "blocks"}
                          </p>
                        </div>
                      </button>

                      {/* Action buttons */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-white hover:shadow-sm">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleStartEditing(page)} className="text-sm">
                              <Edit3 className="h-4 w-4 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicatePage(page)} className="text-sm">
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => openDeleteConfirm(page.id)}
                              className="text-red-600 focus:text-red-600 focus:bg-red-50 text-sm"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {filteredPages.length === 0 && searchTerm && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🔍</div>
                  <p className="text-sm font-medium" style={{ color: currentTheme.colors.text }}>
                    No pages found
                  </p>
                  <p className="text-xs mt-1" style={{ color: currentTheme.colors.textSecondary }}>
                    Try searching for something else
                  </p>
                </div>
              )}

              {filteredPages.length === 0 && !searchTerm && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📝</div>
                  <p className="text-sm font-medium" style={{ color: currentTheme.colors.text }}>
                    No pages yet
                  </p>
                  <p className="text-xs mt-1" style={{ color: currentTheme.colors.textSecondary }}>
                    Create your first page to get started
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Actions */}
          <div className="p-4 border-t space-y-3" style={{ borderColor: currentTheme.colors.secondary + "20" }}>
            <UserProfile />

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="w-full justify-start gap-2 shadow-sm transition-all duration-200 hover:shadow-md"
                  style={{
                    backgroundColor: currentTheme.colors.primary,
                    color: "white",
                  }}
                >
                  <Plus className="h-4 w-4" />
                  New Page
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Page</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Page title..."
                    value={newPageTitle}
                    onChange={(e) => setNewPageTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreatePage()}
                  />
                  <Button onClick={handleCreatePage} className="w-full" disabled={!newPageTitle.trim()}>
                    Create Page
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Palette className="h-4 w-4" />
                  Themes
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Choose Theme</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setCurrentTheme(theme)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        currentTheme.id === theme.id
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      style={{ backgroundColor: theme.colors.surface }}
                    >
                      <div className="space-y-2">
                        <div className="h-3 rounded" style={{ backgroundColor: theme.colors.primary }} />
                        <div className="h-2 rounded w-3/4" style={{ backgroundColor: theme.colors.secondary }} />
                        <p className="text-sm font-medium" style={{ color: theme.colors.text }}>
                          {theme.name}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Page</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
              <Trash2 className="h-5 w-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Delete "{pages.find((p) => p.id === pageToDelete)?.title}"?
                </p>
                <p className="text-xs text-red-600 mt-1">
                  This action cannot be undone. All content will be permanently removed.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => pageToDelete && handleDeletePage(pageToDelete)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Page
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
