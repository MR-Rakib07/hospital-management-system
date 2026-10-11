'use client'

import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  fetchDoctorsThunk,
  updateDoctorThunk,
} from '@/redux/doctor/doctorFetchSlice'
import {
  Award,
  Calendar,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Stethoscope,
  UserCheck,
  UserX,
} from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import AddDoctorModal from '@/components/doctors/AddDoctorModal'

export default function DoctorManagePage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.profile)
  const { doctors, loading, error, actionLoading } = useAppSelector(
    (state) => state.doctors
  )

  const [searchTerm, setSearchTerm] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchDoctorsThunk())
  }, [dispatch])

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    setUpdatingId(id)
    try {
      await dispatch(
        updateDoctorThunk({
          id,
          data: { isAvailable: !currentStatus },
        })
      ).unwrap()
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredDoctors = doctors.filter((doc) => {
    const fullName = doc.fullname || ''
    const department = doc.doctorProfile?.department || ''
    const specialization = doc.doctorProfile?.specialization || ''
    const query = searchTerm.toLowerCase()

    return (
      fullName.toLowerCase().includes(query) ||
      department.toLowerCase().includes(query) ||
      specialization.toLowerCase().includes(query)
    )
  })

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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => dispatch(fetchDoctorsThunk())}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Register Doctor</span>
          </button>
        </div>
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

      {loading && doctors.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-gray-500">Loading doctor profiles...</p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
          <p className="font-semibold">{error}</p>
          <button
            type="button"
            onClick={() => dispatch(fetchDoctorsThunk())}
            className="mt-3 inline-flex items-center rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="rounded-xl border border-blue-50 bg-white p-12 text-center shadow-sm">
          <Stethoscope className="mx-auto h-10 w-10 text-gray-300" />
          <h3 className="mt-2 text-sm font-bold text-gray-700">No doctors found</h3>
          <p className="mt-1 text-xs text-gray-400">
            {searchTerm
              ? 'Try adjusting your search criteria.'
              : 'No doctors are currently registered.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredDoctors.map((doc) => {
            const profile = doc.doctorProfile
            const isTargetUpdating = updatingId === doc.id && actionLoading

            return (
              <div
                key={doc.id}
                className="flex flex-col justify-between rounded-xl border border-blue-100 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-blue-100 bg-blue-50">
                        <Image
                          src={profile?.image || '/profile.jpg'}
                          alt={doc.fullname}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 leading-snug">
                          {doc.fullname}
                        </h3>
                        <p className="text-xs font-medium text-blue-600">
                          {profile?.designation ? `${profile.designation} • ` : ''}
                          {profile?.department || 'Department'}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                        profile?.isAvailable
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {profile?.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 border-t border-gray-100 pt-3 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span className="line-clamp-1">
                        {profile?.specialization || 'General Consultation'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span>{profile?.experience ?? 0} Years Experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      <span className="line-clamp-1">
                        Available:{' '}
                        {profile?.availableDays?.length
                          ? profile.availableDays.join(', ')
                          : 'Not scheduled'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-3">
                  <div>
                    <span className="text-[11px] text-gray-400">Consultation Fee</span>
                    <p className="text-sm font-bold text-blue-900">
                      ৳{profile?.fee ?? 0}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={isTargetUpdating}
                    onClick={() =>
                      toggleAvailability(doc.id, Boolean(profile?.isAvailable))
                    }
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer ${
                      profile?.isAvailable
                        ? 'border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100'
                        : 'border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                    }`}
                  >
                    {isTargetUpdating ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : profile?.isAvailable ? (
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
            )
          })}
        </div>
      )}

      <AddDoctorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}