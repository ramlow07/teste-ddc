"use client"

import type React from "react"

import { useEffect } from "react"
import { Button } from "./button"
import { X } from "lucide-react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children?: React.ReactNode
  onConfirm?: () => void
  confirmText?: string
  confirmVariant?: "primary" | "destructive"
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  onConfirm,
  confirmText = "Confirm",
  confirmVariant = "primary",
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">{title}</h3>
                {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}
                {children && <div className="mt-4">{children}</div>}
              </div>
              <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {onConfirm && (
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <Button variant={confirmVariant} onClick={onConfirm} className="w-full sm:ml-3 sm:w-auto">
                {confirmText}
              </Button>
              <Button variant="outline" onClick={onClose} className="mt-3 w-full sm:mt-0 sm:w-auto bg-transparent">
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
