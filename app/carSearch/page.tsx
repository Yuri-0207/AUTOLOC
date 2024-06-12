'use client';
import { Suspense } from 'react'
import { RangeFilterV2, Modal } from '@/components';
import CardFiltrator from '@/components/CardFiltrator';
import { CarFormData, CarProps, OwnerFormData } from '@/types';
import { IState } from 'country-state-city';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { db } from '@/firebase/firebase'
import { collection, doc, query, where, getDocs, getDoc } from 'firebase/firestore';
import dayjs from 'dayjs';
import { convertCarFormDataToCarProps, calculateNombreJours, isCarAvailable } from '@/utils/functions';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);


const CarSearchPage = () => {
  const searchParams = useSearchParams();
  const rangeData = searchParams.get('rangeData');
  const agencyId = searchParams.get('agencyId');
  const results = rangeData ? JSON.parse(rangeData) : null;


  const [selectedCar, setSelectedCar] = useState<CarProps | null>(null);
  const [agencyData, setAgencyData] = useState<OwnerFormData | null>(null);
  
  const [localisation, setLocalisation] = useState<IState | null>(results?.localisation || null);
  const [startDate, setStartDate] = useState<string>(results?.startDate || '');
  const [endDate, setEndDate] = useState<string>(results?.endDate || '');
  const [cars, setCars] = useState<CarProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchCars = async () => {
      if (agencyId) {
        try {
          const q = query(collection(db, 'Voiture'), where('idAgence', '==', agencyId));
          const querySnapshot = await getDocs(q);
          const fetchedCars = querySnapshot.docs.map((doc) => convertCarFormDataToCarProps(doc.data() as CarFormData, doc.id))
            .filter((car) => isCarAvailable(car, startDate, endDate)) as CarProps[];
          setCars(fetchedCars);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching cars: ', error);
          setLoading(false);
        }
      } else if (localisation) {
        try {
          const q = query(collection(db, 'Voiture'), where('willaya', '==', localisation.name));
          const querySnapshot = await getDocs(q);
          const fetchedCars = querySnapshot.docs.map((doc) => convertCarFormDataToCarProps(doc.data() as CarFormData, doc.id))
            .filter((car) => isCarAvailable(car, startDate, endDate)) as CarProps[];
          setCars(fetchedCars);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching cars:', error);
          setLoading(false);
        }
      } else if (!localisation) {
        try {
          const q = query(collection(db, 'Voiture'));
          const querySnapshot = await getDocs(q);
          const fetchedCars = querySnapshot.docs.map((doc) => convertCarFormDataToCarProps(doc.data() as CarFormData, doc.id))
            .filter((car) => isCarAvailable(car, startDate, endDate)) as CarProps[];
          setCars(fetchedCars);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching cars:', error);
          setLoading(false);
        }
      }
  };
    fetchCars();
  }, [localisation, agencyId, startDate, endDate]);

  useEffect(() => {
    const fetchAgencyData = async () => {
      console.log("Selected car: ", selectedCar);
      if (selectedCar) {
        try {
          const agencyDoc = doc(db, 'OwnerUser', selectedCar.idAgence);
          const agencySnap = await getDoc(agencyDoc);
          if (agencySnap.exists()) {
            setAgencyData(agencySnap.data() as OwnerFormData);
          } else {
            console.error('No such agency document!');
          }
        } catch (error) {
          console.error('Error fetching agency data:', error);
        }
      }
    };
    fetchAgencyData();
  }, [selectedCar]);

  const handleCloseModal = () => {
    setSelectedCar(null);
  }
  const handleReserve = () => {
    handleCloseModal();
  }
  

  return (
    <section className='w-5/6 mx-auto flex flex-col gap-2 text-mystic-900'>
      <div className=' mt-16 my-4'>
        <RangeFilterV2
          localisation={localisation}
          startDate={startDate}
          endDate={endDate}
          onLocalisationChange={setLocalisation}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </div>
      <CardFiltrator 
      heading='Choisissez une voiture'
      cars={cars}
      nmbrJours={calculateNombreJours(startDate, endDate)}
      setSelected={setSelectedCar}
      isLoading={loading}
      />
      {selectedCar && (
        <Modal
          car={selectedCar}
          agency={agencyData}
          startDate={startDate}
          endDate={endDate}
          onClose={handleCloseModal} 
          onReserve={handleReserve}
        />
      )}
    </section>
  )
}

const Page = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <CarSearchPage />
  </Suspense>
);

export default Page
