import React from 'react';
import { OwnerStatic, RangeFilter, LogoCarousel } from '@/components';
import Image from 'next/image';
import { useUser } from '@/contexts/UserContext';

const Landing = () => {
  const { user } = useUser();
  const isOwner = user?.data.role === 'owner';


  return (
    <div className="h-screen w-full relative">
      <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <Image src="/landingBackground.jpg" alt="background image" fill style={{objectFit: "cover"}} />
      </div>
      <h1 className='absolute top-1/4 w-1/2 xsm:w-2/3 sm:w-2/3 ml-[5%] text-casal-900 font-extrabold 
      xsm:text-3xl sm:text-4xl text-5xl lg:text-5xl xl:text-5xl 2xl:text-6xl mb-4 tracking-wide select-none'>
        Location de Voiture n&apos;a jamais été aussi Simple.
      </h1>
      {isOwner ?
      <OwnerStatic />
      :
      <RangeFilter heading='Reserver une Voiture' />}
      <LogoCarousel />
      <div className='absolute h-4 bottom-0 right-0 left-0 bg-gradient-to-t from-white to-transparent'></div>
    </div>
  )
}

export default Landing
