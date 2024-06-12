import React from 'react'
import Image from 'next/image';
import Link from 'next/link';

const AppSection = () => {
  return (
    <section className='w-full py-16 flex flex-wrap justify-center items-center'>
      <div className=' w-[45%] xsm:w-[80%] sm:w-[80%] md:w-[80%] relative flex justify-center'>
        <Image 
        src="/appIllustration.svg" 
        alt="app illustration" 
        className='drop-shadow-md shadow-mystic-500'
        style={{ objectFit: 'contain'}}
        width={600} 
        height={300}
        />
      </div>
      <div className='flex flex-col items-center w-[45%] xsm:w-[80%] sm:w-[80%] md:w-[80%]'>
        <h2 className='text-3xl xsm:text-xl sm:text-xl md:text-2xl font-bold py-8 tracking-wide'><span className='text-casal-900'>AUTO</span>LOC App</h2>
        <p className=' w-5/6 text-lg line-clamp-2 cursor-default hover:line-clamp-none'>Nos applications IOS et Android facilitent la gestion des réservations lors de vos déplacements.</p>
        <div className='flex flex-wrap justify-center'>
          <Link href="/" className='w-48 xsm:w-32 sm:w-32 h-28 relative'>
            <Image
            src='./App_Store_(iOS)-Badge-Logo.wine.svg' 
            alt='Play store logo' 
            className='w-full'
            objectFit='contain'
            layout='fill'
            />
          </Link>
          <Link href="/" className='w-48 xsm:w-32 sm:w-32 h-28 relative'>
            <Image
            src='./Google_Play-Badge-Logo.wine.svg' 
            alt='Google play logo' 
            className='w-full'
            objectFit='contain'
            layout='fill'
            />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AppSection
