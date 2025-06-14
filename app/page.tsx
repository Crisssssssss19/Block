"use client"
import { AppProvider, useApp } from "@/contexts/app-context"
import { Sidebar } from "@/components/sidebar"
import { BlockEditor } from "@/components/block-editor"
import { UserOnboarding } from "@/components/user-onboarding"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Menu,
  Plus,
  MoreHorizontal,
  Share,
  Star,
  Type,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  CheckSquare,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

function NotionApp() {
  const { currentPage, currentTheme, sidebarOpen, setSidebarOpen, updatePage, addBlock, deleteBlock } = useApp()

  const handleAddBlock = (type: any) => {
    if (currentPage) {
      addBlock(currentPage.id, {
        type,
        content: "",
        properties: {},
      })
    }
  }

  const handleTitleChange = (newTitle: string) => {
    if (currentPage) {
      updatePage(currentPage.id, { title: newTitle })
    }
  }

  const blockTypes = [
    { type: "heading", label: "Heading", icon: Type, description: "Big section heading" },
    { type: "paragraph", label: "Text", icon: Type, description: "Just start writing with plain text" },
    { type: "bullet-list", label: "Bulleted list", icon: List, description: "Create a simple bulleted list" },
    { type: "numbered-list", label: "Numbered list", icon: ListOrdered, description: "Create a list with numbering" },
    { type: "checklist", label: "To-do list", icon: CheckSquare, description: "Track tasks with a to-do list" },
    { type: "quote", label: "Quote", icon: Quote, description: "Capture a quote" },
    { type: "code", label: "Code", icon: Code, description: "Capture a code snippet" },
    { type: "divider", label: "Divider", icon: Minus, description: "Visually divide blocks" },
  ]

  return (
    <div
      className="flex h-screen"
      style={{
        backgroundColor: currentTheme.colors.background,
        fontFamily: currentTheme.fonts.body,
      }}
    >
      <UserOnboarding />
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: currentTheme.colors.secondary + "20" }}
        >
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5" />
            </Button>

            {currentPage && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentPage.icon}</span>
                <Input
                  value={currentPage.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="text-lg font-semibold border-none bg-transparent p-0 h-auto focus-visible:ring-0"
                  style={{
                    color: currentTheme.colors.text,
                    fontFamily: currentTheme.fonts.heading,
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Star className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                <DropdownMenuItem>Duplicate page</DropdownMenuItem>
                <DropdownMenuItem>Delete page</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Page content */}
        <ScrollArea className="flex-1">
          <div className="max-w-4xl mx-auto p-6">
            {currentPage ? (
              <div className="space-y-4">
                {/* Cover image placeholder */}
                {currentPage.coverImage && (
                  <div
                    className="h-60 bg-cover bg-center rounded-lg"
                    style={{ backgroundImage: `url(${currentPage.coverImage})` }}
                  />
                )}

                {/* Page title */}
                <div className="space-y-4">
                  <Input
                    value={currentPage.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="text-4xl font-bold border-none bg-transparent p-0 h-auto focus-visible:ring-0"
                    placeholder="Untitled"
                    style={{
                      color: currentTheme.colors.text,
                      fontFamily: currentTheme.fonts.heading,
                    }}
                  />
                </div>

                {/* Blocks */}
                <div className="space-y-2">
                  {currentPage.blocks.map((block) => (
                    <BlockEditor
                      key={block.id}
                      block={block}
                      pageId={currentPage.id}
                      onDelete={() => deleteBlock(currentPage.id, block.id)}
                    />
                  ))}
                </div>

                {/* Add block button with enhanced menu */}
                <div className="flex items-center gap-2 pt-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                        style={{ color: currentTheme.colors.textSecondary }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add a block
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80" align="start">
                      <div className="p-2">
                        <div className="text-xs font-medium text-gray-500 mb-2 px-2">BASIC BLOCKS</div>
                        {blockTypes.map((blockType) => {
                          const IconComponent = blockType.icon
                          return (
                            <DropdownMenuItem
                              key={blockType.type}
                              onClick={() => handleAddBlock(blockType.type)}
                              className="flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded-md"
                            >
                              <div className="flex-shrink-0 mt-0.5">
                                <IconComponent className="h-5 w-5 text-gray-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm text-gray-900">{blockType.label}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{blockType.description}</div>
                              </div>
                            </DropdownMenuItem>
                          )
                        })}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="space-y-4">
                  <div className="text-6xl">📝</div>
                  <h2 className="text-2xl font-semibold" style={{ color: currentTheme.colors.text }}>
                    Welcome to Your Workspace
                  </h2>
                  <p className="text-lg max-w-md" style={{ color: currentTheme.colors.textSecondary }}>
                    Create your first page to get started with your personalized Notion experience.
                  </p>
                  <Button
                    onClick={() => setSidebarOpen(true)}
                    style={{
                      backgroundColor: currentTheme.colors.primary,
                      color: "white",
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Page
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <AppProvider>
      <NotionApp />
    </AppProvider>
  )
}
