'use client'

import DoctorCard from '@/components/doctors/DoctorCard'
import { fetchDoctorsThunk } from '@/redux/doctor/doctorFetchSlice'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import Container from '@/utils/Container'
import PageHeading from '@/utils/PageHeading'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

function DoctorsPage() {
  const pathName = usePathname()
  const path = pathName.slice(1)

  const dispatch = useAppDispatch()
  const { doctors, loading, error } = useAppSelector((state) => state.doctors)

  useEffect(() => {
    dispatch(fetchDoctorsThunk())
  }, [dispatch])

  return (
    <div>
      <PageHeading
        pageHeading="Doctors Team"
        pageDescription="Great doctor if you need your family member to get effective immediate assistance, emergency treatment or a simple consultation."
        pageNavigation={path}
      />

      <Container>
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && doctors.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 font-medium">No doctors found at the moment.</p>
          </div>
        )}

        {!loading && !error && doctors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 my-10">
            {doctors.map((doctor) => {
              const { doctorProfile } = doctor

              return (
                <DoctorCard
                  key={doctorProfile.id}
                  id={doctorProfile.id}
                  image={doctorProfile.image}
                  name={doctor.fullname}
                  department={doctorProfile.department}
                  specialization={doctorProfile.specialization}
                  designation={doctorProfile.designation}
                  experience={doctorProfile.experience}
                  location={doctor.presentAddress}
                  phone={doctor.phone}
                  visitingDays={doctorProfile.availableDays}
                  visitingHours={doctorProfile.visitingHours}
                  fee={doctorProfile.fee}
                />
              )
            })}
          </div>
        )}
      </Container>
    </div>
  )
}

export default DoctorsPage