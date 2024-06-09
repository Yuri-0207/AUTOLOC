import React, { FC, useState, useEffect } from 'react';
import Image from 'next/image';
import { FaCalendarAlt } from 'react-icons/fa';
import { GiPathDistance } from "react-icons/gi";
import dayjs from 'dayjs';
import { CarProps, ReservationData, CarFormData, ReservedCarsData, OwnerFormData, UserFormData } from '@/types';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { convertCarFormDataToCarProps } from '@/utils/functions';
import { Skeleton } from 'antd';

interface ReservedCarCardProps {
  user: { uid: string, data: any} | null;
}
const ReservedCarCard: React.FC<ReservedCarCardProps> = ({user}) => {

  const [reservedCarData, setReservedCarsData] = useState<ReservedCarsData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchReservations = async (): Promise<ReservationData[]> => {
    const q = query(collection(db, 'Reservation'), where('idUser', '==', user?.uid));
    const querySnapshot = await getDocs(q);

    const fetchedReservations: ReservationData[] = [];
    querySnapshot.forEach(doc => {
      const reservationData = doc.data() as ReservationData;
      fetchedReservations.push({ ...reservationData });
    });
    return fetchedReservations;
  };
  
  const fetchCars = async (): Promise<CarProps[]> => {
    const q = query(collection(db, 'Voiture'));
    const querySnapshot = await getDocs(q);
    const fetchedCars = querySnapshot.docs.map((doc) => 
      convertCarFormDataToCarProps(doc.data() as CarFormData, doc.id)
    ) as CarProps[];
    return fetchedCars;
  };

  interface OwnerData {
    nomAgence: string;
    numeroTelephone: string;
    numeroTelephoneSecondaire: string | undefined;
  }
  
  const fetchOwners = async (): Promise<Record<string, OwnerData>> => {
    const q = query(collection(db, 'OwnerUser'));
    const querySnapshot = await getDocs(q);
    const fetchedOwners: Record<string, OwnerData> = {};
    querySnapshot.forEach(doc => {
      const ownerData = doc.data() as OwnerFormData;
      fetchedOwners[doc.id] = {
        nomAgence: ownerData.nomAgence,
        numeroTelephone: ownerData.numeroTelephone,
        numeroTelephoneSecondaire: ownerData.numeroTelephoneSecondaire
      };
    });
    return fetchedOwners;
  };

  

  useEffect(() => {
    const getReservationsAndCars = async () => {
      try {
        if (!user) return;
        
        const [fetchedReservations, fetchedCars, fetchedOwners] = await Promise.all([
          fetchReservations(),
          fetchCars(),
          fetchOwners()
        ]);
        
        const res: ReservedCarsData[] = [];
        fetchedCars.forEach((car) => {
          fetchedReservations.forEach((reserv) => {
            if (car.uid === reserv.idVoiture) {
              const ownerData = fetchedOwners[car.idAgence];
              res.push({
                marque: car.marque,
                modele: car.modele,
                startDate: reserv.startDate,
                endDate: reserv.endDate,
                prixTotal: reserv.prixTotal,
                imageVoiture: car.imagesVoiture[0],
                etat: reserv.etat,
                annee: car.annee,
                nomAgence: ownerData.nomAgence,
                numTel: ownerData.numeroTelephone,
                numTelSec: ownerData.numeroTelephoneSecondaire,
              });
            }
          });
        });
        setReservedCarsData(res);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    getReservationsAndCars();
  }, [user?.uid]);

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
  
  if(reservedCarData.length === 0) {
    return (
      <p>Vous n&apos;avez aucun reservations pour l&apos;instants</p>
    )
  }
  
  return (
    <div className='flex flex-wrap justify-center gap-4 '>
          {reservedCarData.map((car, index) => (
          <div key={index} 
          className={`bg-gradient-to-r from-mystic-100/30 to-casal-50/30 h-fit shadow-md rounded-lg p-2 flex gap-2 items-center border
          ${car.etat === "En attente" ? "border-yellow-400" : car.etat === "Accepte" ? "border-casal-400" 
          : "border-flamingo-400"}`}>
              <div className="relative w-56 h-52 rounded-md overflow-hidden">
                <Image
                  src={car.imageVoiture}
                  alt={`${car.marque} ${car.modele}`}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <div className='flex flex-col h-48 justify-between items-center'>
                <div className="flex flex-col justify-between items-center">
                  <h2 className="text-xl font-semibold">{car.marque} {car.modele}</h2>
                  <p className="font-semibold">{car.annee}</p>
                </div>

                <div className="font-medium">{car.nomAgence}</div>

                <div className="text-sm font-medium">{car.numTel}</div>

                {car.numTelSec && <div className="text-sm font-medium">{car.numTelSec}</div>}

                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-casal-700" />
                  <p className="font-semibold">{dayjs(car.startDate).format('DD/MM/YYYY')} - {dayjs(car.endDate).format('DD/MM/YYYY')}</p>
                </div>

                <div className="flex items-center gap-2">
                  <GiPathDistance className="text-casal-700" />
                  <p className="font-semibold">{car.prixTotal} Da</p>
                </div>

                <div className={`font-medium  ${car.etat === "En attente" ? "text-yellow-400" 
                  : car.etat === "Accepte" ? "text-casal-400" : "text-flamingo-400"}`}>{car.etat}</div>
              </div>
          </div>
          ))}
          </div>
  )
}

export default ReservedCarCard;