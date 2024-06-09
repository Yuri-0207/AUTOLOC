'use client'
import React, { useEffect, useState } from 'react';
import {CarFormData, Availability } from '@/types';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import Image from 'next/image';
import { FaGasPump } from 'react-icons/fa';
import { GiGearStickPattern, GiPathDistance  } from 'react-icons/gi';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { App as AntdApp, Popconfirm, PopconfirmProps, Popover, message } from 'antd';
import { capitalizeFirstLetter } from '@/utils/functions';

dayjs.extend(isBetween);

interface CarWithId extends CarFormData {
  id: string;
}

interface FleetCarCardProps {
  user: { uid: string, data: any} | null;
  limit?: number;
  isInLanding?: boolean;
}

const FleetCarCard: React.FC<FleetCarCardProps> = ({ user, limit, isInLanding }) => {
  const [cars, setCars] = useState<CarWithId[]>([]);

  useEffect(() => {
    const fetchFleetCars = async (): Promise<CarWithId[] | undefined> => {
      if (!user?.uid) return;
      try {
        const q = query(collection(db, 'Voiture'), where('idAgence', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedCars = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as CarFormData),
          id: doc.id,
        })) as CarWithId[];
        
        setCars(fetchedCars);
      } catch (error) {
        console.error('Error fetching fleet cars:', error);
      }
    };
    fetchFleetCars();
  }, [user]);

  const handleDelete = async (carId: string) => {
    try {
      await deleteDoc(doc(db, 'Voiture', carId));
      setCars(cars.filter(car => car.id !== carId));
      message.success('La voiture a été supprimée');
    } catch (error) {
      console.error('Error deleting car: ', error);
      message.error('Une erreur s\'est produite lors de la suppression de la voiture');
    }
  };

  const cancel: PopconfirmProps['onCancel'] = (e) => {
    console.log(e);
    message.error('La suppression est annulée');
  };

  const getCurrentStatus = (availability: Availability[]): { status: string, currentReservation: string | null, futurePeriods: string[]} => {
    const today = dayjs();
    let status = 'Available';
    let currentReservation: string | null = null;
    const futurePeriods: string[] = [];

    for (const period of availability) {
      const start = dayjs(period.startDate);
      const end = dayjs(period.endDate);
      if(today.isBetween(start, end, "day", "[]")) {
        status = 'Reservee';
        currentReservation = `Date Retour: ${period.endDate}`;
      } else if (start.isAfter(today)) {
        futurePeriods.push(`${period.startDate} - ${period.endDate}`);
      }
    }
    return { status, currentReservation, futurePeriods };
  };

  if (cars.length === 0) {
    return <div>Aucune voiture trouvée pour cette agence.</div>;
  }
  const displayedCars = limit ? cars.slice(0, limit) : cars;

  return (
  <AntdApp>
    <div className={`flex flex-wrap gap-6 text-mystic-900 ${isInLanding ? ' justify-evenly' : 'justify-center'}`}>
      {displayedCars.map((car, index) => {
        const { status, currentReservation, futurePeriods } = getCurrentStatus(car.availability);

        return (
          <div key={index} 
          className="bg-gradient-to-r from-mystic-100/30 to-casal-50/30 w-72 h-fit shadow-md rounded-lg p-2 flex flex-col gap-2 justify-between items-center">
            <h2 className="text-lg text-center font-semibold text-nowrap">{car.marque} {car.modele}</h2>
            <div className="relative w-full h-40 rounded-md overflow-hidden">
              <Image
                src={car.imagesVoiture[0]}
                alt={`${car.marque} ${car.modele}`}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className='flex flex-col w-full gap-2'>
              <div className="flex justify-between">
                <div className="font-medium">{car.categorie.toUpperCase()}</div>
                <div className="font-semibold text-lg">{car.annee}</div>
                <div className="font-semibold">{car.prixParJour} Da</div>
              </div>
              <div className="flex justify-between">
                <div className="font-medium flex flex-col items-center"><FaGasPump /><p>{capitalizeFirstLetter(car.carburant)}</p></div>
                <div className="font-semibold flex flex-col items-center"><GiPathDistance /><p>{capitalizeFirstLetter(car.killometrage)}{car.killometrage !== 'illimite' ? <span>Km</span> : ''}</p></div>
                <div className="font-medium flex flex-col items-center"><GiGearStickPattern /><p>{capitalizeFirstLetter(car.transition.substring(0,7))}</p></div>
              </div>
              <div className='flex justify-evenly items-center'>
                <Popconfirm 
                title="Supprimer la Voiture" 
                description="Êtes-vous sûr de vouloir supprimer cette voiture de la flotte ?" 
                onConfirm={(e) => { e?.preventDefault(); handleDelete(car.id); }}
                onCancel={cancel}
                okText="Supprimer"
                cancelText="Annuler"
                >
                  <button 
                  // onClick={() => handleDelete(car.id)} 
                  className='w-fit text-flamingo-700 rounded-md px-1 py-1 hover:underline-offset-4 transition-all duration-200 text-xs font-semibold'>
                    Supprimer
                  </button>
                </Popconfirm>
                <div className="text-center font-medium">
                  {status === 'Reservee' ? (
                    <Popover content={currentReservation ? [currentReservation, ...futurePeriods].join(', ') : 'No reservation'} title="Reservations">
                      <span className="text-flamingo-600 cursor-pointer">Reservee</span>
                    </Popover>
                  ) : futurePeriods.length > 0 ? (
                    <Popover content={futurePeriods.join(', ')} title="Dates indisponibles">
                      <span className="text-yellow-600 cursor-pointer">Dates indisponibles</span>
                    </Popover>
                  ) : (
                    'Disponible'
                  )}
                </div>
              </div>
            </div>
            
          </div>
        );
      })}
    </div>
    </AntdApp>
  );
}

export default FleetCarCard
