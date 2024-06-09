'use client';
import { AppSection, CategoriesSection, Landing } from "@/components";
import { ServicesSection } from "@/components";
import AgenciesCard from "@/components/AgenciesCard";
import EndedReservationCarCard from "@/components/EndedReservationCarCard";
import FleetCarCard from "@/components/FleetCarCard";
import OwnerReservations from "@/components/OwnerReservations";
import { useUser } from "@/contexts/UserContext";
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFContrat from '@/components/PDFContrat';

export default function Home() {
  const {user} = useUser();
  const isOwner = user?.data.role === "owner";
    
  if (!user) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-between">
      <Landing />
      <CategoriesSection />
      <ServicesSection />
      <AppSection />
    </main>
    )
  }

  if (isOwner) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-between">
        <Landing />
        <section className='w-full py-16 px-8'>
          <h2 className='text-2xl font-semibold pb-8'>Demandes de reservation</h2>
          <OwnerReservations user={user} isInLanding />
        </section>
        <section className='w-full py-16 px-8'>
          <h2 className='text-2xl font-semibold pb-8'>Mon Flotte</h2>
          <FleetCarCard user={user} limit={5} isInLanding />
        </section>
        <ServicesSection />
        <AppSection />
    </main>
    )
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between">
      <Landing />
      <section className='w-full py-16 px-8'>
        <h2 className='text-2xl font-semibold pb-8'>Réserve déjà..</h2>
        <EndedReservationCarCard user={user} />
      </section>
      <CategoriesSection />
      <section className='w-full py-16 px-8'>
        <h2 className='text-2xl font-semibold pb-8'>Les Agences proches</h2>
        <AgenciesCard user={user} />
      </section>
      <ServicesSection />
      <AppSection />
    </main>
  );
}
