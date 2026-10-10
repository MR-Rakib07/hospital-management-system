'use client'
import DoctorAboutSection from '@/components/home/DoctorAboutsection'
import MedicalServicesSection from '@/components/home/MedicalServicesSection'
import PageHeading from '@/utils/PageHeading'
import { usePathname } from 'next/navigation'
import React from 'react'

function About() {
    const pathName = usePathname()
            const path = pathName.slice(1)
  return (
    <div>
        <PageHeading pageHeading='About Us'
         pageDescription='Great doctor if you need your family member to get effective immediate assistance, emergency treatment or a simple consultation.' 
         pageNavigation={path}/>

         <div className='mt-15'>
            <DoctorAboutSection/>
            <MedicalServicesSection/>
         </div>
    </div>
  )
}

export default About