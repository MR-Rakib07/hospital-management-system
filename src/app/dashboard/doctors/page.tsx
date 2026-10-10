'use client'

import { useAppSelector } from '@/redux/hooks'
import { DoctorProfile, UserProfile } from '@/types/authTypes'
import {
  Award,
  Calendar,
  Plus,
  Search,
  Stethoscope,
  UserCheck,
  UserX,
} from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

interface DoctorWithUser extends DoctorProfile {
  user: Pick<UserProfile, 'fullname' | 'email' | 'phone'>
}

const mockDoctorList: DoctorWithUser[] = [
  {
    id: '670868f0a123b456c7890021',
    userId: '670868f0a123b456c7890031',
    department: 'Cardiology',
    specialization: 'Cardiovascular & Interventional Cardiology',
    designation: 'Associate Professor',
    experience: 14,
    fee: 1000,
    image: '/profile.jpg',
    availableDays: ['Sat', 'Mon', 'Wed'],
    isAvailable: true,
    createdAt: '2026-09-01',
    updatedAt: '2026-09-01',
    user: {
      fullname: 'Dr. Kabir Hossain',
      email: 'kabir.cardio@medicare.com',
      phone: '+880 1712-001122',
    },
  },
  {
    id: '670868f0a123b456c7890022',
    userId: '670868f0a123b456c7890032',
    department: 'Neurology',
    specialization: 'Neurological Disorders & Stroke Specialist',
    designation: 'Consultant',
    experience: 9,
    fee: 1200,
    image: '/profile.jpg',
    availableDays: ['Sun', 'Tue', 'Thu'],
    isAvailable: true,
    createdAt: '2026-09-05',
    updatedAt: '2026-09-05',
    user: {
      fullname: 'Dr. Anika Tabassum',
      email: 'anika.neuro@medicare.com',
      phone: '+880 1813-112233',
    },
  },
]

export default function DoctorManagePage() {
  const { user } = useAppSelector((state) => state.profile)
  const [doctors, setDoctors] = useState<DoctorWithUser[]>(mockDoctorList)
  const [searchTerm, setSearchTerm] = useState('')

  const toggleAvailability = (id: string) => {
    setDoctors((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, isAvailable: !doc.isAvailable } : doc))
    )
  }

  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (user?.role !== 'ADMIN') {
    return (
      <div className="rounded-xl border border-blue-100 bg-white p-8 text-center shadow-sm">
        <h3 className="text-base font-bold text-gray-800">Access Restricted</h3>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">
          Only hospital administrators can manage doctor profiles and availability.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Doctor Profiles & Chambers</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Control doctor availability, offline fees, and active visiting days
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Register Doctor</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by doctor name, department, or specialization..."
          className="w-full rounded-xl border border-blue-100 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="flex flex-col justify-between rounded-xl border border-blue-100 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-blue-100 bg-blue-50">
                    <Image
                      src={doc.image || '/profile.jpg'}
                      alt={doc.user.fullname}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 leading-snug">{doc.user.fullname}</h3>
                    <p className="text-xs font-medium text-blue-600">
                      {doc.designation || 'Specialist'} • {doc.department}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    doc.isAvailable
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {doc.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>

              <div className="mt-4 space-y-2 border-t border-gray-100 pt-3 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span className="line-clamp-1">{doc.specialization}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span>{doc.experience} Years Experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span>Available: {doc.availableDays.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3">
              <div>
                <span className="text-[11px] text-gray-400">Offline Fee</span>
                <p className="text-sm font-bold text-blue-900">৳{doc.fee}</p>
              </div>

              <button
                type="button"
                onClick={() => toggleAvailability(doc.id)}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                  doc.isAvailable
                    ? 'border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'
                    : 'border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                }`}
              >
                {doc.isAvailable ? (
                  <>
                    <UserX className="h-3.5 w-3.5" />
                    <span>Set Off</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>Set Active</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}