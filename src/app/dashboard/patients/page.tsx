'use client'

import { useAppSelector } from '@/redux/hooks'
import { BloodGroup, UserProfile } from '@/types/authTypes'
import {
  Eye,
  Mail,
  MapPin,
  Phone,
  Search,
  User,
  X,
} from 'lucide-react'
import React, { useState } from 'react'

const formatBloodGroup = (bg?: BloodGroup | null) => {
  if (!bg) return 'N/A'
  return bg.replace('_POSITIVE', '+').replace('_NEGATIVE', '-')
}

const mockPatientsList: UserProfile[] = [
  {
    id: '670868f0a123b456c7890011',
    email: 'kazi@test.com',
    role: 'PATIENT',
    fullname: 'Kazi Nazrul',
    phone: '+880 1711-223344',
    gender: 'MALE',
    bloodGroup: 'B_POSITIVE',
    maritalStatus: 'MARRIED',
    dateOfBirth: '1981-05-25T00:00:00.000Z',
    presentAddress: 'Road 8A, Dhanmondi, Dhaka',
    permanentAddress: 'Churulia, Asansol',
    emergencyContactName: 'Promila Devi',
    emergencyRelation: 'Spouse',
    emergencyPhone: '+880 1711-998877',
    createdAt: '2026-10-01T00:00:00.000Z',
    updatedAt: '2026-10-01T00:00:00.000Z',
  },
  {
    id: '670868f0a123b456c7890012',
    email: 'fatima@test.com',
    role: 'PATIENT',
    fullname: 'Fatima Sultana',
    phone: '+880 1812-334455',
    gender: 'FEMALE',
    bloodGroup: 'O_POSITIVE',
    maritalStatus: 'SINGLE',
    dateOfBirth: '1994-08-14T00:00:00.000Z',
    presentAddress: 'Mirpur-10, Dhaka',
    emergencyContactName: 'Kamrul Hasan',
    emergencyRelation: 'Brother',
    emergencyPhone: '+880 1812-001122',
    createdAt: '2026-10-02T00:00:00.000Z',
    updatedAt: '2026-10-02T00:00:00.000Z',
  },
]

export default function PatientsPage() {
  const { user } = useAppSelector((state) => state.profile)
  const [patients] = useState<UserProfile[]>(mockPatientsList)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<UserProfile | null>(null)

  const filteredPatients = patients.filter((p) => {
    return (
      p.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Hospital Patient Directory</h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Registered patients with emergency contacts and blood profiles
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by patient name, phone or email..."
          className="w-full rounded-xl border border-blue-100 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-blue-50/50 text-xs font-semibold uppercase text-blue-900">
              <tr>
                <th className="px-5 py-3.5">Name</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5">Gender</th>
                <th className="px-5 py-3.5">Blood Group</th>
                <th className="px-5 py-3.5">Emergency Contact</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-gray-400">
                    No registered patients match your query.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {patient.fullname}
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs font-medium text-gray-800">{patient.phone}</p>
                      <p className="text-xs text-gray-400">{patient.email}</p>
                    </td>
                    <td className="px-5 py-4 text-xs font-medium text-gray-600">
                      {patient.gender || 'N/A'}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-block rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700">
                        {formatBloodGroup(patient.bloodGroup)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <p className="font-medium text-gray-800">{patient.emergencyContactName || 'N/A'}</p>
                      <p className="text-gray-400">{patient.emergencyPhone || ''}</p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedPatient(patient)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Profile</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{selectedPatient.fullname}</h3>
                  <p className="text-xs text-gray-400">ID: {selectedPatient.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
                <div>
                  <span className="text-gray-400 block mb-0.5">Gender</span>
                  <p className="font-semibold text-gray-800">{selectedPatient.gender || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Blood Group</span>
                  <p className="font-bold text-blue-600">{formatBloodGroup(selectedPatient.bloodGroup)}</p>
                </div>
                <div>
                  <span className="text-gray-400 block mb-0.5">Marital Status</span>
                  <p className="font-semibold text-gray-800">{selectedPatient.maritalStatus || 'N/A'}</p>
                </div>
              </div>

              <div className="border border-gray-100 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4 text-blue-500" />
                  <span>{selectedPatient.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4 text-blue-500" />
                  <span>{selectedPatient.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span>{selectedPatient.presentAddress || 'No present address recorded'}</span>
                </div>
              </div>

              <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3.5">
                <p className="font-bold text-gray-800 mb-1">Emergency Contact</p>
                <p className="text-gray-700">
                  {selectedPatient.emergencyContactName || 'None'}{' '}
                  {selectedPatient.emergencyRelation && `(${selectedPatient.emergencyRelation})`}
                </p>
                <p className="text-gray-500">{selectedPatient.emergencyPhone || 'No phone provided'}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
                className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}