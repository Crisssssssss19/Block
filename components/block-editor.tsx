"use client"

import { useState } from "react"
import type { Block } from "@/types"
import { useApp } from "@/contexts/app-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Type,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  ImageIcon,
  Trash2,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  CheckSquare,
  Calendar,
  AlertCircle,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { JSX } from "react/jsx-runtime"

interface BlockEditorProps {
  block: Block
  pageId: string
  onDelete: () => void
}

export function BlockEditor({ block, pageId, onDelete }: BlockEditorProps) {
  const { updateBlock, currentTheme, userSettings } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(block.content)

  const handleSave = () => {
    updateBlock(pageId, block.id, { content })
    setIsEditing(false)
  }

  const handleTypeChange = (newType: Block["type"]) => {
    updateBlock(pageId, block.id, { type: newType })
  }

  const handlePropertyChange = (property: string, value: any) => {
    updateBlock(pageId, block.id, {
      properties: { ...block.properties, [property]: value },
    })
  }

  const blockTypeIcons = {
    heading: Type,
    paragraph: Type,
    "bullet-list": List,
    "numbered-list": ListOrdered,
    quote: Quote,
    code: Code,
    divider: Minus,
    image: ImageIcon,
    checklist: CheckSquare,
  }

  const BlockIcon = blockTypeIcons[block.type]

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "#ef4444"
      case "medium":
        return "#f59e0b"
      case "low":
        return "#10b981"
      default:
        return currentTheme.colors.secondary
    }
  }

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false
    return new Date(dueDate) < new Date()
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const renderContent = () => {
    const style = {
      color: block.properties?.color || currentTheme.colors.text,
      backgroundColor: block.properties?.backgroundColor || "transparent",
      textAlign: block.properties?.alignment || ("left" as const),
    }

    if (isEditing) {
      return (
        <div className="space-y-2">
          {block.type === "heading" ? (
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="text-lg font-bold"
              style={style}
              autoFocus
            />
          ) : (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onBlur={handleSave}
              className="min-h-[60px] resize-none"
              style={style}
              autoFocus
            />
          )}
        </div>
      )
    }

    const baseClasses = "cursor-text transition-all duration-200 hover:bg-opacity-50 p-2 rounded"

    switch (block.type) {
      case "heading":
        const HeadingTag = `h${block.properties?.level || 1}` as keyof JSX.IntrinsicElements
        return (
          <HeadingTag className={`${baseClasses} text-2xl font-bold`} style={style} onClick={() => setIsEditing(true)}>
            {content || "Untitled"}
          </HeadingTag>
        )
      case "paragraph":
        return (
          <p className={baseClasses} style={style} onClick={() => setIsEditing(true)}>
            {content || "Click to add text..."}
          </p>
        )
      case "bullet-list":
        return (
          <ul className="list-disc list-inside">
            <li className={baseClasses} style={style} onClick={() => setIsEditing(true)}>
              {content || "Click to add item..."}
            </li>
          </ul>
        )
      case "numbered-list":
        return (
          <ol className="list-decimal list-inside">
            <li className={baseClasses} style={style} onClick={() => setIsEditing(true)}>
              {content || "Click to add item..."}
            </li>
          </ol>
        )
      case "quote":
        return (
          <blockquote
            className={`${baseClasses} border-l-4 pl-4 italic`}
            style={{ ...style, borderColor: currentTheme.colors.primary }}
            onClick={() => setIsEditing(true)}
          >
            {content || "Click to add quote..."}
          </blockquote>
        )
      case "code":
        return (
          <pre
            className={`${baseClasses} bg-gray-100 font-mono text-sm overflow-x-auto`}
            onClick={() => setIsEditing(true)}
          >
            <code>{content || "Click to add code..."}</code>
          </pre>
        )
      case "divider":
        return <hr className="my-4 border-gray-300" />
      case "checklist":
        const checkColor = block.properties?.checkColor || userSettings.defaultCheckColor
        const priority = block.properties?.priority
        const dueDate = block.properties?.dueDate
        const overdue = isOverdue(dueDate) && !block.properties?.checked

        return (
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <button
                onClick={() => handlePropertyChange("checked", !block.properties?.checked)}
                className="mt-1 flex-shrink-0 transition-colors"
              >
                {block.properties?.checked ? (
                  <div
                    className="w-5 h-5 rounded border-2 flex items-center justify-center text-white text-xs font-bold"
                    style={{
                      backgroundColor: checkColor,
                      borderColor: checkColor,
                    }}
                  >
                    ✓
                  </div>
                ) : (
                  <div
                    className="w-5 h-5 rounded border-2 hover:border-gray-400 transition-colors"
                    style={{ borderColor: checkColor }}
                  />
                )}
              </button>
              <div className="flex-1 space-y-1">
                <div
                  className={`${baseClasses} ${block.properties?.checked ? "line-through opacity-60" : ""} ${
                    overdue ? "text-red-600" : ""
                  }`}
                  style={style}
                  onClick={() => setIsEditing(true)}
                >
                  {content || "Click to add task..."}
                </div>

                {/* Task metadata */}
                {(priority || dueDate) && (
                  <div className="flex items-center gap-2 text-xs">
                    {priority && (
                      <span
                        className="px-2 py-1 rounded-full text-white font-medium"
                        style={{ backgroundColor: getPriorityColor(priority) }}
                      >
                        {priority.toUpperCase()}
                      </span>
                    )}
                    {dueDate && (
                      <span
                        className={`flex items-center gap-1 ${overdue ? "text-red-600 font-medium" : "text-gray-500"}`}
                      >
                        {overdue && <AlertCircle className="h-3 w-3" />}
                        <Calendar className="h-3 w-3" />
                        {formatDate(dueDate)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      default:
        return (
          <p className={baseClasses} style={style} onClick={() => setIsEditing(true)}>
            {content || "Click to add content..."}
          </p>
        )
    }
  }

  const checkColors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316", "#84cc16"]

  return (
    <div className="group relative mb-2">
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 mt-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <BlockIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleTypeChange("heading")}>
                <Type className="h-4 w-4 mr-2" />
                Heading
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTypeChange("paragraph")}>
                <Type className="h-4 w-4 mr-2" />
                Paragraph
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTypeChange("bullet-list")}>
                <List className="h-4 w-4 mr-2" />
                Bullet List
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTypeChange("numbered-list")}>
                <ListOrdered className="h-4 w-4 mr-2" />
                Numbered List
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTypeChange("quote")}>
                <Quote className="h-4 w-4 mr-2" />
                Quote
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTypeChange("code")}>
                <Code className="h-4 w-4 mr-2" />
                Code
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTypeChange("divider")}>
                <Minus className="h-4 w-4 mr-2" />
                Divider
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTypeChange("checklist")}>
                <CheckSquare className="h-4 w-4 mr-2" />
                Checklist
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex-1">{renderContent()}</div>

        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Palette className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div className="p-2">
                  <p className="text-sm font-medium mb-2">Text Color</p>
                  <div className="flex gap-1 mb-3">
                    {[currentTheme.colors.text, currentTheme.colors.primary, "#ef4444", "#f59e0b", "#10b981"].map(
                      (color) => (
                        <button
                          key={color}
                          className="w-6 h-6 rounded border-2 border-gray-200"
                          style={{ backgroundColor: color }}
                          onClick={() => handlePropertyChange("color", color)}
                        />
                      ),
                    )}
                  </div>

                  {block.type === "checklist" && (
                    <>
                      <p className="text-sm font-medium mb-2">Check Color</p>
                      <div className="flex gap-1 mb-3 flex-wrap">
                        {checkColors.map((color) => (
                          <button
                            key={color}
                            className={`w-6 h-6 rounded border-2 ${
                              block.properties?.checkColor === color ? "border-gray-400" : "border-gray-200"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => handlePropertyChange("checkColor", color)}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  <p className="text-sm font-medium mb-2">Alignment</p>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handlePropertyChange("alignment", "left")}>
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handlePropertyChange("alignment", "center")}>
                      <AlignCenter className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handlePropertyChange("alignment", "right")}>
                      <AlignRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {block.type === "checklist" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Task Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <select
                        id="priority"
                        className="w-full mt-1 p-2 border rounded"
                        value={block.properties?.priority || ""}
                        onChange={(e) => handlePropertyChange("priority", e.target.value || undefined)}
                      >
                        <option value="">No priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="datetime-local"
                        value={
                          block.properties?.dueDate ? new Date(block.properties.dueDate).toISOString().slice(0, 16) : ""
                        }
                        onChange={(e) =>
                          handlePropertyChange(
                            "dueDate",
                            e.target.value ? new Date(e.target.value).toISOString() : undefined,
                          )
                        }
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
