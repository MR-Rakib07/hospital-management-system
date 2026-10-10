import About from "@/components/home/About";
import DoctorAboutSection from "@/components/home/DoctorAboutsection";
import Hero from "@/components/home/Hero";
import MedicalServicesSection from '@/components/home/MedicalServicesSection'
import FAQ from "@/utils/FAQ";

export default function Home() {
  return (
    <div>
          <Hero/>
         <About/>
         <DoctorAboutSection/>
         <MedicalServicesSection/>
         <FAQ/>
    </div>
  );
}
