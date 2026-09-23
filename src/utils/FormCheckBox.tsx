'use client'
import React, { ChangeEvent } from 'react'

export interface CheckboxProps {
  label: string
  name: string
  checked: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  className?: string
}

function FormCheckBox({
  label,
  name,
  checked,
  onChange,
  className = ''
}: CheckboxProps) {
  return (
    <label htmlFor={name} className="flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
        className={`${className} h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer`}
      />
      <span className="text-sm text-gray-600">{label}</span>
    </label>
  )
}

export default FormCheckBox