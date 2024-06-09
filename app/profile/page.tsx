'use client'

import { UpdateForm } from '@/components';
import React, {  useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import UpdatePassword from '@/components/UpdatePassword';
import { useRouter } from 'next/navigation';
import { OwnerFormData } from '@/types';
import AddCar from '@/components/AddCar';
import ReservedCarCard from '@/components/ReservedCarCard';
import FleetCarCard from '@/components/FleetCarCard';
import OwnerReservations from '@/components/OwnerReservations';
import useAuth from '@/utils/useAuth';
import EndedReservationCarCard from '@/components/EndedReservationCarCard';
import CommunicationForm from '@/components/CommunicationForm';
import RentalsMade from '@/components/RentalsMade';

interface Tab {
  key: string;
  label: string;
  content: JSX.Element;
}


const Page = () => {
  const { user } = useUser();
  const router = useRouter();
  const isOwner = user?.data.role === "owner";
  
  const [activeTabKey, setActiveTabKey] = useState('1');
  const handleTabClick = (key: string) => {
    setActiveTabKey(key);
  }

  const tabsData: Tab[] = [
    {
      key: '1',
      label: "Mon Compte",
      content: 
      <div>
        <div className='flex justify-between items-start mb-4'>
          <h1 className=' text-xl font-semibold mb-6'>Mon Profil</h1>
          <button type="button" onClick={() => setActiveTabKey("2")} className='text-casal-600 font-medium text-sm'>Modifiez mes Informations personnelles</button>
        </div>
        <div className='grid grid-cols-2 gap-4'>
            {isOwner ? 
            <div className='flex gap-2 font-semibold text-lg'>
              <p>Agence </p>
              <p>{(user.data as OwnerFormData)?.nomAgence}</p>
            </div> :
            <div className='flex gap-2 font-semibold text-lg'>
              <p>M. </p>
              <p>{user?.data.nom} {user?.data.prenom}</p>
            </div>
          }
            <div className='flex gap-2 font-semibold text-lg'>
              <p>Adresse: </p>
              <p>{user?.data.rue} Nº{user?.data.numeroMaison}<br/>{user?.data.commune}, {user?.data.ville}</p>
            </div>
            <div className='flex gap-2 font-semibold text-lg'>
              <p>Num Tel: </p>
              <p>{user?.data.numeroTelephone}</p>
            </div>
            <div className='flex gap-2 font-semibold text-lg'>
              <p>Email: </p>
              <p>{user?.data.email}</p>
            </div>
        </div>
        <div className='w-full h-px bg-casal-950/20 px-4 my-8'></div>
        <div className='flex justify-between items-center mb-4'>
          {isOwner ?
          <h1 className=' text-xl font-semibold mb-4'>Ma Flotte</h1>
          : <h1 className=' text-xl font-semibold mb-4'>Mes Reservations</h1>
          }
        </div>
        <div>
          {isOwner ?
          <FleetCarCard user={user} /> :
          <ReservedCarCard user={user} />
          }
        </div>
      </div>
    },
    {
      key: '2',
      label: "Infos Personnelles",
      content: <div>
        <h1 className=' text-xl font-semibold mb-6'>Modifier mes Informations</h1>
        <UpdateForm />
      </div>,
    },
    {
      key: '3',
      label: "Modifier le password",
      content: 
      <div>
        <h1 className=' text-xl font-semibold mb-6'>Modifier mon Mot de passe</h1>
        <UpdatePassword />
      </div>
      ,
    },
    {
      key: '4',
      label: isOwner ? "Ajoutez Voiture" : "Communications",
      content: 
      isOwner ? 
        <div>
          <h1 className=' text-xl font-semibold mb-6'>Ajouter Voiture a mon Flotte</h1>
          <AddCar /> 
        </div>
      : <div>
          <h1 className=' text-xl font-semibold mb-6'>Preferences de Communication</h1>
          <CommunicationForm userEmail={user?.data.email} />
        </div>
      ,
    },
    {
      key: '5',
      label: "Reservations existantes",
      content: 
      <div>
        <h1 className=' text-xl font-semibold mb-6'>Gerer mes Reservations</h1>
        {isOwner ?
          <OwnerReservations user={user} />
          :
          <ReservedCarCard user={user} />
        }
      </div>,
    },
    {
      key: '6',
      label: isOwner ? "Locations effectuees" : "Locations terminees",
      content: 
      <div>
        <h1 className=' text-xl font-semibold mb-6'>Locations terminees</h1>
        {isOwner ?
          <RentalsMade user={user} />
          :
          <EndedReservationCarCard user={user} />
        }
      </div>,
    },
  ]

  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error("Logout error: ", error);
    }
  }

  return (
    <section className='w-5/6 mx-auto'>
      <div className='mt-16 my-8 rounded-md py-4 flex min-h-96'>
        <ul className='w-max'>
          {tabsData.map((tab) => (
            <li id='tab'
              key={tab.key}
              className={`mb-1 p-2 cursor-pointer font-medium rounded-l-md text-nowrap transition duration-300 
              ${activeTabKey === tab.key ? ' border-b-2 border-casal-700 text-casal-700 bg-white' 
              : 'bg-mystic-100'}`}
              onClick={() => handleTabClick(tab.key)}
            >
              {tab.label}
            </li>
          ))}
          <li>
            <button className='w-5/6 my-2 p-2 font-medium rounded-lg transition duration-300 bg-casal-500 text-white' 
            onClick={handleLogout}>Se deconnecter</button>
          </li>
        </ul>
        <div className='flex-grow p-4 bg-white rounded-md min-h-96 '>
          {tabsData.find((tab) => tab.key === activeTabKey)?.content}
        </div>
      </div>
    </section>
  )
}

export default Page;
