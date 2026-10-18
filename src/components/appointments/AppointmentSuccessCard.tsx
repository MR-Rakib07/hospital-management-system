'use client'

import type { AppointmentWithRelations } from '@/types/authTypes'

interface Props {
  appointment: AppointmentWithRelations
  fee: number
}

export default function AppointmentSuccessCard({ appointment, fee }: Props) {
  const displayFee =
    appointment.paidAmount && appointment.paidAmount > 0
      ? appointment.paidAmount
      : appointment.doctor?.fee ?? fee

  return (
    <div className="mb-6 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
      <h4 className="font-bold text-lg mb-2">🎉 Appointment Successfully Booked!</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <p>
          <strong>Serial Code:</strong>{' '}
          <span className="font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
            {appointment.formattedSerialCode || appointment.serialCode || `#${appointment.serialNumber}`}
          </span>
        </p>
        <p>
          <strong>Date:</strong> {String(appointment.appointmentDate).slice(0, 10)}
        </p>
        <p>
          <strong>Patient Name:</strong> {appointment.patientName}
        </p>
        <p>
          <strong>Patient Phone:</strong> {appointment.patientPhone}
        </p>
        <p>
          <strong>Payment Status:</strong> {appointment.paymentStatus || 'UNPAID'} (Pay at Counter)
        </p>
        <p>
          <strong>Consultation Fee:</strong> ৳ {displayFee}
        </p>
        {(appointment.doctor?.roomNumber || appointment.doctor?.floorNumber) && (
          <p className="md:col-span-2">
            <strong>Chamber Location:</strong>{' '}
            {appointment.doctor?.roomNumber ? `Room ${appointment.doctor.roomNumber}` : ''}
            {appointment.doctor?.roomNumber && appointment.doctor?.floorNumber ? ', ' : ''}
            {appointment.doctor?.floorNumber ? `Floor ${appointment.doctor.floorNumber}` : ''}
          </p>
        )}
      </div>
    </div>
  )
}