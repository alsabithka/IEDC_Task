import React, { useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface RegistrationResetModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const RegistrationResetModal: React.FC<RegistrationResetModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-[#0d0d0d] p-6 sm:p-8 text-white shadow-2xl">
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close dialog"
          className="absolute top-5 right-5 p-1.5 rounded-full text-[#888888] hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3
              id="reset-modal-title"
              className="font-sans text-base sm:text-lg font-bold text-white uppercase tracking-tight"
            >
              Reset Registration Form?
            </h3>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#777777]">
              Confirmation Required
            </span>
          </div>
        </div>

        <p className="font-sans text-xs sm:text-sm text-[#A0A0A0] leading-relaxed mb-6">
          Are you sure you want to clear all entered personal and team details? All unsaved progress will be lost.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-full border border-white/15 bg-white/5 font-sans text-xs font-bold uppercase tracking-wider text-[#D0D0D0] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-full bg-white text-black font-sans text-xs font-black uppercase tracking-wider hover:bg-[#EAEAEA] transition-all cursor-pointer shadow-md"
          >
            Yes, Reset Form
          </button>
        </div>
      </div>
    </div>
  )
}

export default RegistrationResetModal
