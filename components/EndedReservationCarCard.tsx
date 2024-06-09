
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import dayjs from 'dayjs';
import { CarFormData, OwnerFormData, ReservationData } from '@/types';
import { GiPathDistance } from 'react-icons/gi';
import { Skeleton } from 'antd';

interface ReservationWithDetails {
  reservation: ReservationData;
  car: CarFormData;
  agency: OwnerFormData;
}

interface EndedResCarCardProps {
  user: { uid: string, data: any} | null;
}

const EndedReservationCarCard: React.FC<EndedResCarCardProps> = ({ user }) => {
  const [reservations, setReservations] = useState<ReservationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchReservations = async () => {
      if(!user?.uid) {
        setError('User not logged in');
        setLoading(false);
        return;
      }
      try{
        const q = query(
          collection(db, 'Reservation'),
          where('idUser', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const reservationsData = querySnapshot.docs.map(doc => {
          const data = doc.data() as ReservationData;
          return { id: doc.id, ...data};
        }).filter(reservation => {
          const endDate = dayjs(reservation.endDate)
          return reservation.endDate && endDate.isBefore(dayjs())
        });

        const detailedReservations = await Promise.all(reservationsData.map(async reservation => {
          const carDoc = await getDoc(doc(db, "Voiture", reservation.idVoiture));
          const agencyDoc = await getDoc(doc(db, "OwnerUser", reservation.idAgence));

          if(!carDoc.exists() || !agencyDoc.exists()) {
            throw new Error("Car or Agency document not found");
          }
          return {
            reservation,
            car: carDoc.data() as CarFormData,
            agency: agencyDoc.data() as OwnerFormData
          };
        }));

        setReservations(detailedReservations);
        setLoading(false);
      } catch(error) {
        console.error('Error fetching reservations or cars: ', error);
        setError('Erreur lors de la récupération des réservations ou des voitures');
        setLoading(false);
      }
    };
    fetchReservations();
  }, [user]);

  if (loading) {
    return (
        <div className='flex flex-wrap gap-6 '>
          <div className='bg-gradient-to-r from-mystic-100/30 to-casal-50/30 h-fit
          shadow-md rounded-lg p-2 flex gap-2 items-center border'>
              <Skeleton.Image 
                active 
                style={{width: 224, height: 208, borderRadius: 6}}>
              </Skeleton.Image>
              <Skeleton 
                active 
                title={false} 
                paragraph={{rows: 6, width: [154, 33, 190, 115, 84, 87] }}>
              </Skeleton>
          </div>
          <div className='bg-gradient-to-r from-mystic-100/30 to-casal-50/30 h-fit
          shadow-md rounded-lg p-2 flex gap-2 items-center border'>
              <Skeleton.Image 
                active 
                style={{width: 224, height: 208, borderRadius: 6}}>
              </Skeleton.Image>
              <Skeleton 
                active 
                title={false} 
                paragraph={{rows: 6, width: [154, 33, 190, 115, 84, 87] }}>
              </Skeleton>
          </div>
        </div>
    );
  }

  if(reservations.length === 0) {
    return (
      <p>Vous n&apos;avez aucun reservations pour l&apos;instants</p>
    )
  }

  const isCarAvailable = (availability: {startDate: string; endDate: string}[]) => {
    const today = dayjs();
    return !availability.some(period => {
      const startDate = dayjs(period.startDate);
      const endDate = dayjs(period.endDate);
      return today.isBetween(startDate, endDate, 'day', '[]');
    });
  };

  return (
    <div>
      <div className='flex flex-wrap gap-6 '>
          {reservations.map(({ car, agency}, index) => (
          <div key={index} 
          className='bg-gradient-to-r from-mystic-100/30 to-casal-50/30 h-fit shadow-md rounded-lg p-2 flex gap-2 items-center border'>
              <div className="relative w-56 h-52 rounded-md overflow-hidden">
                <Image
                  src={car.imagesVoiture[0]}
                  alt={`${car.marque} ${car.modele}`}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <div className='flex flex-col h-52 justify-evenly items-center'>
                <div className="flex flex-col justify-between items-center">
                  <h2 className="text-xl font-semibold">{car.marque} {car.modele}</h2>
                  <p className="font-semibold">{car.annee}</p>
                </div>

                <div className="font-medium">{agency.nomAgence}</div>

                <div className="font-medium text-center">
                  <p>{agency.numeroTelephone}</p>
                  {agency.numeroTelephoneSecondaire && <p>{agency.numeroTelephoneSecondaire}</p>}
                </div>

                {agency.numeroTelephoneSecondaire && <div className="text-sm font-medium">{agency.numeroTelephoneSecondaire}</div>}

                <div className="flex items-center gap-2">
                  <GiPathDistance className="text-casal-700" />
                  <p className="font-semibold">{car.prixParJour} Da</p>
                </div>
                <div className='font-semibold text-lg'>
                  {isCarAvailable(car.availability) ? 'Disponible' : 'Pas disponible'}
                </div>
              </div>
          </div>
          ))}
          </div>
    </div>
  )
}

export default EndedReservationCarCard
