'use client'

import type { AppointmentType } from '@/types/authTypes'

interface Props {
  type: AppointmentType
  onChange: (type: AppointmentType) => void
}

export default function AppointmentTypeToggle({ type, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <button
        type="button"
        onClick={() => onChange('OFFLINE')}
        className={`py-3 px-4 text-center rounded-xl font-semibold transition-all cursor-pointer ${
          type === 'OFFLINE'
            ? 'bg-[#396CF0] text-white shadow-xs'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Chamber Consultation (OFFLINE)
      </button>
      <button
        type="button"
        onClick={() => onChange('ONLINE')}
        className={`py-3 px-4 text-center rounded-xl font-semibold transition-all cursor-pointer ${
          type === 'ONLINE'
            ? 'bg-[#396CF0] text-white shadow-xs'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Video Consultation (ONLINE)
      </button>
    </div>
  )
}