import React from 'react';
import Image from 'next/image';
import { FaUser, FaGasPump } from 'react-icons/fa';
import { GiGearStickPattern, GiPathDistance } from "react-icons/gi";
import { carCardProps } from '@/types';
import useFocus from '@/utils/useFocus';
import { capitalizeFirstLetter } from '@/utils/functions';


const CarCard: React.FC<carCardProps> = ({marque, modele, annee, nmbrPlace, carburant, boiteVitesse, imageVoiture, killometrage, prixParJour, prixTotal, onClick}) => {

  const { isFocused, handleFocusChange, handleBlurChange } = useFocus();

  return (
    <section className={`relative bg-white rounded-md shadow-md shadow-mystic-900/20 w-[30%] flex flex-col gap-3
    ${isFocused ? 'outline border-4 border-mystic-100 outline-4 outline-casal-600 transition-all duration-200 px-2 py-2' : ' px-3 py-3'}`}
    onClick={handleFocusChange}
      onBlur={handleBlurChange}
      tabIndex={0}>
      {/* Overlay div */}
      {isFocused && (
        <div className="absolute inset-0 bg-mystic-800 opacity-50 rounded-md"></div>
      )}
      <div className='flex justify-between'>
        <div className='flex gap-2 text-xl font-bold'>
          <p>{marque}</p>
          <p>{modele}</p>
        </div>
        <p className='text-xl font-bold'>{annee}</p>
      </div>
      <div className='flex gap-4'>
        <div className='flex gap-2 justify-center items-center'>
          <FaUser />
          <p>{nmbrPlace}</p>
        </div>
        <div className='flex gap-2 justify-center items-center'>
          <FaGasPump />
          <p>{capitalizeFirstLetter(carburant)}</p>
        </div>
        <div className='flex gap-2 justify-center items-center'>
          <GiGearStickPattern />
          <p>{capitalizeFirstLetter(boiteVitesse)}</p>
        </div>
      </div>
      <div className='relative rounded-md w-full h-64'>
        <Image
          src={imageVoiture ? imageVoiture[0] : '/logo-text-light-mode.png'}
          alt='Car picture'
          fill style={{ objectFit: 'cover' }}
          loading='eager' />
      </div>
      <div className='flex gap-2 items-center font-semibold'>
        <GiPathDistance className='text-casal-600'/>
        {killometrage !== "illimite" ? <p>{killometrage}Km / Jour</p> : <p>{capitalizeFirstLetter(killometrage)} / Jour</p>}
      </div>
      <div className='flex justify-evenly items-center font-bold'>
        <div className='flex items-center gap-1'>
          <p className='text-2xl'>{prixParJour}</p>
          <p>Da / Jour</p>
        </div>
        <div className='flex items-center gap-1 text-mystic-400'>
          <p>{prixTotal}</p>
          <p>Da / Total</p>
        </div>
      </div>
      <button onClick={onClick} className='absolute inset-0 bg-transparent rounded-md'></button>
    </section>
  )
}

export default CarCard
