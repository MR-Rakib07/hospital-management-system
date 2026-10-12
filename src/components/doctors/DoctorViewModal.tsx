'use client'

import React from 'react'
import Image from 'next/image'
import {
  X,
  Stethoscope,
  Award,
  Calendar,
  DollarSign,
  Building2,
  Mail,
  Phone,
  DoorOpen,
  Clock,
} from 'lucide-react'
import { DoctorWithProfile } from '@/redux/doctor/doctorFetchSlice'

interface DoctorViewModalProps {
  doctor: DoctorWithProfile | null
  onClose: () => void
}

export default function DoctorViewModal({
  doctor,
  onClose,
}: DoctorViewModalProps) {
  if (!doctor) return null

  const profile = doctor.doctorProfile

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-blue-100 bg-blue-50">
              <Image
                src={profile?.image || '/profile.jpg'}
                alt={doctor.fullname}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{doctor.fullname}</h3>
              <p className="text-xs font-medium text-blue-600">
                {profile?.designation ? `${profile.designation} • ` : ''}
                {profile?.department || 'Department N/A'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-3.5 text-xs text-gray-600">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 shrink-0 text-blue-500" />
            <span className="font-medium text-gray-800">{doctor.email}</span>
          </div>

          {doctor.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-blue-500" />
              <span className="font-medium text-gray-800">{doctor.phone}</span>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Stethoscope className="h-4 w-4 shrink-0 text-blue-500" />
            <span>Specialization: <strong className="text-gray-800">{profile?.specialization || 'General'}</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <Building2 className="h-4 w-4 shrink-0 text-blue-500" />
            <span>Department: <strong className="text-gray-800">{profile?.department || 'Not assigned'}</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <Award className="h-4 w-4 shrink-0 text-blue-500" />
            <span>Experience: <strong className="text-gray-800">{profile?.experience ?? 0} Years</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <DollarSign className="h-4 w-4 shrink-0 text-blue-500" />
            <span>Physical Consultation Fee: <strong className="text-gray-800">৳{profile?.fee ?? 0}</strong></span>
          </div>

          {profile?.teleconsultationFee && (
            <div className="flex items-center gap-3">
              <DollarSign className="h-4 w-4 shrink-0 text-blue-500" />
              <span>Online Consultation Fee: <strong className="text-gray-800">৳{profile.teleconsultationFee}</strong></span>
            </div>
          )}

          {(profile?.roomNumber || profile?.floorNumber) && (
            <div className="flex items-center gap-3">
              <DoorOpen className="h-4 w-4 shrink-0 text-blue-500" />
              <span>Room: <strong className="text-gray-800">{profile?.roomNumber || 'N/A'}</strong> (Floor {profile?.floorNumber || 'N/A'})</span>
            </div>
          )}

          {profile?.visitingHours && (
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 shrink-0 text-blue-500" />
              <span>Visiting Hours: <strong className="text-gray-800">{profile.visitingHours}</strong></span>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 shrink-0 text-blue-500 mt-0.5" />
            <div>
              <span>Visiting Days: </span>
              <div className="mt-1 flex flex-wrap gap-1">
                {profile?.availableDays && profile.availableDays.length > 0 ? (
                  profile.availableDays.map((day) => (
                    <span
                      key={day}
                      className="rounded bg-blue-50 px-2 py-0.5 font-medium text-blue-700 border border-blue-100"
                    >
                      {day}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">Not scheduled</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}