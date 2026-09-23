import React from 'react'
import { FormInputType } from '@/types/formInputType'

function FormInput({
  label,
  type,
  placeholder,
  name,
  value,
  onChange,
  className = '',
  required = false
}: FormInputType) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && '*'}
      </label>
      <input
        type={type}
        className={`${className} mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  )
}

export default FormInput