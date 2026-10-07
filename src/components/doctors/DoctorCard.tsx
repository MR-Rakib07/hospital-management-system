import { FaMapMarkerAlt, FaClock, FaCalendarAlt, FaDollarSign, FaCalendarCheck, FaPhoneAlt, FaUserMd } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'

interface DoctorCardProps {
  id?: string
  image?: string | null
  name: string
  department: string
  specialization?: string
  designation?: string | null
  experience?: number | null
  location?: string | null
  phone?: string | null
  visitingHours?: string | null
  visitingDays?: string[] | string | null
  fee: number | string
}

function DoctorCard({
  id,
  image,
  name,
  department,
  specialization,
  designation,
  experience,
  location,
  phone,
  visitingHours,
  visitingDays,
  fee,
}: DoctorCardProps) {
  const displayImage = image && image.trim() !== '' ? image : '/01.jpg'
  
  const displayDays = Array.isArray(visitingDays)
    ? visitingDays.filter(Boolean).join(', ')
    : typeof visitingDays === 'string'
      ? visitingDays.trim()
      : null

  const subHeading = [department, specialization, designation].filter(Boolean).join(' • ')
  const appointmentHref = id ? `/appointment/${id}` : '/appointment'
  const numericFee = typeof fee === 'number' ? fee : Number(fee) || 0

  return (
    <div className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 w-full max-w-sm mx-auto bg-white flex flex-col justify-between h-full">
      <div className="flex flex-col flex-1">
        <div className="relative w-full h-[200px] sm:h-[230px] flex-shrink-0">
          <Image
            src={displayImage}
            alt={name || 'Doctor Profile'}
            fill
            className="object-cover"
          />
          <div className="absolute inset-x-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible bottom-10 group-hover:bottom-0 transition-all duration-300">
            <Link
              href={appointmentHref}
              className="flex items-center justify-center gap-2 w-full bg-[#396CF0] text-white py-3 hover:bg-[#2857d0] transition-colors"
            >
              <FaCalendarCheck className="w-5 h-5" />
              <span className="font-medium">Book Appointment</span>
            </Link>
          </div>
        </div>

        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-4">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#396CF0] transition-colors break-words">
              {name}
            </h3>
            {subHeading !== '' && (
              <p className="text-sm text-gray-500 mt-1 break-words leading-relaxed">
                {subHeading}
              </p>
            )}
          </div>

          <div className="space-y-2.5 text-gray-600 text-sm">
            {experience !== undefined && experience !== null && experience > 0 && (
              <div className="flex items-start gap-2.5">
                <FaUserMd className="text-[#396CF0] w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="break-words leading-tight">{experience} Years Experience</span>
              </div>
            )}

            {phone && phone.trim() !== '' && (
              <div className="flex items-start gap-2.5">
                <FaPhoneAlt className="text-[#396CF0] w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="break-words leading-tight">{phone}</span>
              </div>
            )}

            {location && location.trim() !== '' && (
              <div className="flex items-start gap-2.5">
                <FaMapMarkerAlt className="text-[#396CF0] w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="break-words leading-tight">{location}</span>
              </div>
            )}

            {visitingHours && visitingHours.trim() !== '' && (
              <div className="flex items-start gap-2.5">
                <FaClock className="text-[#396CF0] w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="break-words leading-tight">{visitingHours}</span>
              </div>
            )}

            {displayDays && displayDays !== '' && (
              <div className="flex items-start gap-2.5">
                <FaCalendarAlt className="text-[#396CF0] w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="break-words leading-tight">{displayDays}</span>
              </div>
            )}

            <div className="flex items-start gap-2.5 pt-1 border-t border-gray-100">
              <FaDollarSign className="text-[#396CF0] w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="font-medium text-gray-700">Consultation Fee: ${numericFee}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorCard