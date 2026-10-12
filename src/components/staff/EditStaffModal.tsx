'use client'

import React, { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { StaffUser, UpdateStaffPayload, GenderType } from '@/redux/staff/staffSlice'

interface EditStaffModalProps {
  staff: StaffUser | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (id: string, data: UpdateStaffPayload) => Promise<void>
  loading: boolean
}

export default function EditStaffModal({
  staff,
  isOpen,
  onClose,
  onUpdate,
  loading,
}: EditStaffModalProps) {
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    department: '',
    counterNumber: '',
    gender: 'MALE' as GenderType,
    presentAddress: '',
    emergencyContactName: '',
    emergencyRelation: '',
    emergencyPhone: '',
  })

  useEffect(() => {
    if (staff) {
      setFormData({
        fullname: staff.fullname || '',
        phone: staff.phone || '',
        department: staff.staffProfile?.department || '',
        counterNumber: staff.staffProfile?.counterNumber || '',
        gender: (staff.gender as GenderType) || 'MALE',
        presentAddress: staff.presentAddress || '',
        emergencyContactName: staff.emergencyContactName || '',
        emergencyRelation: staff.emergencyRelation || '',
        emergencyPhone: staff.emergencyPhone || '',
      })
    }
  }, [staff])

  if (!isOpen || !staff) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onUpdate(staff.id, {
      fullname: formData.fullname,
      phone: formData.phone,
      department: formData.department,
      counterNumber: formData.counterNumber,
      gender: formData.gender,
      presentAddress: formData.presentAddress,
      emergencyContactName: formData.emergencyContactName,
      emergencyRelation: formData.emergencyRelation,
      emergencyPhone: formData.emergencyPhone,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Edit Staff Record</h3>
            <p className="text-xs text-gray-500">Update staff details and designated counter</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700">Full Name *</label>
              <input
                type="text"
                required
                value={formData.fullname}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">Phone *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">Counter Number</label>
              <input
                type="text"
                value={formData.counterNumber}
                onChange={(e) => setFormData({ ...formData, counterNumber: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as GenderType })}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 bg-white"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700">Emergency Phone</label>
              <input
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">Address</label>
            <input
              type="text"
              value={formData.presentAddress}
              onChange={(e) => setFormData({ ...formData, presentAddress: e.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <div className="mt-6 flex justify-end gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}