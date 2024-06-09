'use client';
import { useUser } from '@/contexts/UserContext';
import React, { Component, useEffect, useState } from 'react';
import { Progress, ConfigProvider } from 'antd';
import { collection, getDocs, query, where } from '@firebase/firestore';
import { db } from '@/firebase/firebase';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

const OwnerStatic = () => {
  const { user } = useUser();
  const [stats, setStats] = useState({
    flotte: 0,
    disponible: 0,
    reservee: 0
  });

  useEffect(() => {
    if (user) {
      const fetchStats = async () => {
        try {
          const voitureRef = collection(db, 'Voiture');

          const flotteQuery = query(voitureRef, where('idAgence', '==', user.uid));
          const flotteSnapshot = await getDocs(flotteQuery);

          let flotteCount = 0;
          let disponibleCount = 0;
          let reserveeCount = 0;

          const today = dayjs().startOf('day');

          flotteSnapshot.forEach(doc => {
            flotteCount++;
            const voiture = doc.data();
            const isReservedToday = voiture.availability.some((period: { startDate: string; endDate: string; }) => {
              const startDate = dayjs(period.startDate);
              const endDate = dayjs(period.endDate);
              return today.isBetween(startDate, endDate, 'day', '[]');
            });
            if (isReservedToday) {
              reserveeCount++;
            } else {
              disponibleCount++;
            }

            setStats({
              flotte: flotteCount,
              disponible: disponibleCount,
              reservee: reserveeCount,
            })
          });
        } catch (error) {
          console.error('Error fetching stats: ', error);
        }
      };

      fetchStats();
    }
  }, [user]);

  return (
    <section className='w-1/2 h-fit bg-mystic-100/20 rounded-md shadow-md shadow-mystic-900/70 absolute top-1/2 ml-[5%] p-[2%] z-10'>
      <div className="flex flex-wrap justify-around items-center">
        <ConfigProvider theme={{ token: { colorSuccess: '#1c575f' }, components: { Progress: { circleTextColor: '#1c575f', circleTextFontSize: '2em'}}}}>
          <div className="flex flex-col items-center gap-4">
            <p className=" text-lg font-medium">Flotte</p>
            <Progress 
              type="circle" 
              percent={100} format={() => `${stats.flotte}`} 
              strokeColor='#178087' 
              size={100} 
              strokeWidth={10} />
          </div>
          <div className="flex flex-col items-center gap-4">
            <p className=" text-lg font-medium">Disponible</p>
            <Progress 
              type="circle" 
              percent={(stats.disponible * 100)/stats.flotte} 
              format={() => `${stats.disponible}`} 
              strokeColor='#178087' 
              size={100} 
              strokeWidth={10} />
          </div>
          <div className="flex flex-col items-center gap-4">
            <p className=" text-lg font-medium">Reservee</p>
            <Progress 
              type="circle" 
              percent={(stats.reservee * 100)/stats.flotte} 
              format={() => `${stats.reservee}`} 
              strokeColor='#178087' 
              size={100} 
              strokeWidth={10} />
          </div>
        </ConfigProvider>
      </div>
    </section>
  )
}

export default OwnerStatic
