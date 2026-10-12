'use client'

import Link from 'next/link'
import type { AppointmentWithCode } from '@/redux/appointment/appointmentSlice'

interface Props {
  appointment: AppointmentWithCode
  fee: number
}

export default function AppointmentSuccessCard({ appointment, fee }: Props) {
  return (
    <div className="mb-6 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
      <h4 className="font-bold text-lg mb-2">🎉 Appointment Successfully Booked!</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <p>
          <strong>Serial Code:</strong>{' '}
          <span className="font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
            {appointment.formattedSerialCode || `#${appointment.serialNumber}`}
          </span>
        </p>
        <p>
          <strong>Date:</strong> {String(appointment.appointmentDate).slice(0, 10)}
        </p>
        <p>
          <strong>Patient Name:</strong> {appointment.patientName}
        </p>
        <p>
          <strong>Consultation Type:</strong> {appointment.type}
        </p>
        <p>
          <strong>Payment Status:</strong> {appointment.paymentStatus || 'UNPAID'}
        </p>
        <p>
          <strong>Consultation Fee:</strong> ৳ {appointment.paidAmount ?? fee}
        </p>
        {appointment.type === 'ONLINE' && appointment.meetingLink && (
          <p className="md:col-span-2 mt-2">
            <strong>Meeting Room:</strong>{' '}
            <Link
              href={appointment.meetingLink}
              target="_blank"
              className="text-[#396CF0] underline font-semibold ml-1"
            >
              Join Consultation
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}