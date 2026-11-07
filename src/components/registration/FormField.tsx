import React from 'react'
import { AlertCircle } from 'lucide-react'

interface FormFieldProps {
  id: string
  label: string
  required?: boolean
  error?: string
  helperText?: string
  children: React.ReactNode
  className?: string
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  required = false,
  error,
  helperText,
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      <label
        htmlFor={id}
        className="flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-wider text-[#D0D0D0]"
      >
        <span>{label}</span>
        {required && <span className="text-white" aria-hidden="true">*</span>}
      </label>

      {children}

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-center gap-1.5 font-sans text-xs font-medium text-red-400 mt-1 animate-in fade-in duration-150"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={`${id}-desc`} className="font-sans text-[11px] text-[#777777] mt-1">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}

export default FormField
