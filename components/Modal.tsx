'use client'
import { CarFormData, CarProps, OwnerFormData, ReservationData } from '@/types';
import React, { useState } from 'react';
import Image from 'next/image';
import { FaBabyCarriage, FaGasPump, FaIdCard, FaUser, FaUserPlus } from 'react-icons/fa';
import { GiCarKey, GiGearStickPattern, GiPathDistance } from 'react-icons/gi';
import { ConfigProvider, Switch, Carousel, Modal as Modall , Popover} from 'antd';
import { BsFillFuelPumpFill } from 'react-icons/bs';
import { db } from '@/firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { calculatePrixTotal, capitalizeFirstLetter } from '@/utils/functions';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const services = [
  {
    title: "Conducteur additionnel",
    icon: <FaUserPlus /> ,
    description: "Au cas où vous auriez besoin d'un chauffeur ou si vous souhaitez partager le volant.",
    prix: 2000,
    unite: "/ Jour",
  },
  {
    title: "Siège Bébé",
    icon: <FaBabyCarriage /> ,
    description: "Recommandé pour les bébés jusqu'à 24 mois.",
    prix: 600,
    unite: "/ Siege",
  },
  {
    title: "Livraison de Voiture",
    icon: <GiCarKey /> ,
    description: "Nous livrons votre voiture chez vous au lieu de la récupérer au bureau de location.",
    prix: 400,
    unite: "/ Commune",
  },
  {
    title: "Carburant prépayée",
    icon: <BsFillFuelPumpFill /> ,
    description: "Prenez la voiture avec le réservoir plein et ne vous embêtez pas à le remplir au retour de la voiture",
    prix: 1000,
    unite: "/ Plein",
  },
]

interface ModalProps {
  car: CarProps;
  agency: OwnerFormData | null;
  startDate?: string;
  endDate?: string;
  onClose: () => void;
  onReserve: () => void;
}

const Modal: React.FC<ModalProps> = ({ car, agency, startDate, endDate, onClose, onReserve }) => {
  const { user } = useUser();
  const router = useRouter();

  const [selectedOptions, setSelectedOptions] = useState({
    conductor: false,
    babySeat: false,
    delivery: false,
    fuel: false,
  });

  const handleViewInMap = () => {
    const searchQuery = `${agency?.nomAgence}, ${agency?.rue}, ${agency?.commune}, ${agency?.ville}`
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;
    window.open(googleMapsUrl, '_blank');
  }

  const calculateTotalPrice = () => {
    let prixTotal = calculatePrixTotal(car, startDate, endDate);

    if (selectedOptions.conductor) {
      prixTotal += services[0].prix;
    }
    if (selectedOptions.babySeat) {
      prixTotal += services[1].prix;
    }
    if (selectedOptions.delivery) {
      prixTotal += services[2].prix;
    }
    if (selectedOptions.fuel) {
      prixTotal += services[3].prix;
    }

    return prixTotal;
  }

  const handleReserve = async () => {
    if (!user) {
      console.error("User not authenticated");
      router.push("/signUp");
      return;
    }

    const prixTotal = calculateTotalPrice();
    
    const reservationData: ReservationData = {
      idAgence: car.idAgence,
      idUser: user.uid,
      idVoiture: car.uid,
      startDate: startDate,
      endDate: endDate,
      conducteur: selectedOptions.conductor,
      siege: selectedOptions.babySeat,
      livraison: selectedOptions.delivery,
      carburant: selectedOptions.fuel,
      prixTotal: prixTotal,
      etat: "En attente",
    }
    try {
      const docRef = await addDoc(collection(db, 'Reservation'), reservationData);
      console.log("Reservation stored with Id: ", docRef.id);
      onReserve();
    } catch (error) {
      console.log("Error adding reservation: ", error);
    }
  }

  const totalPrice = calculateTotalPrice();


  return (
    <Modall
      visible={true}
      onCancel={onClose}
      footer={null}
      width="80%"
    >
      <div className="relative h-full overflow-y-auto w-full flex md:flex-col sm:flex-col xsm:flex-col md gap-8 bg-white rounded-lg">
        <div className='flex flex-col gap-4 justify-around w-1/2 md:w-full sm:w-full xsm:w-full'>
          <h2 className="text-2xl font-bold">{car.marque} {car.modele}</h2>
          <div className='flex justify-between pr-4'>
            <h3 className="text-xl font-bold">Agence: {agency?.nomAgence}</h3>
            <button onClick={handleViewInMap} className='text-casal-700 font-semibold'>Voir l&apos;agence dans Map</button>
          </div>
          <div className='relative w-[544] h-72 rounded-md px-4'>
            <Carousel arrows prevArrow={<LeftOutlined />} nextArrow={<RightOutlined />} autoplay autoplaySpeed={5000} >
              {(car.imagesVoiture as string[]).map((pic, index) => (
                  <div key={index} className='w-full h-72'>
                    <Image key={index}
                      src={pic}
                      alt={`${car.marque} ${car.modele}`}
                      width={0} height={0} sizes='100vw' style={{ objectFit: 'cover',width: '100%', height: '100%', marginLeft: 'auto', marginRight: 'auto' }}
                      loading='eager'
                    />
                  </div>
                ))}
            </Carousel>
          </div>
          <div className='flex gap-4'>
            <div className='flex gap-2 justify-center items-center'>
              <FaUser />
              <p>{car.place} Places</p>
            </div>
            <div className='flex gap-2 justify-center items-center'>
              <GiGearStickPattern />
              <p>{capitalizeFirstLetter(car.transition)}</p>
            </div>
            <div className='flex gap-2 justify-center items-center'>
              <FaGasPump />
              <p>{capitalizeFirstLetter(car.carburant)}</p>
            </div>
            <div className='flex gap-2 justify-center items-center'>
              <GiPathDistance />
              {car.killometrage === 'illimite' ? <p>{capitalizeFirstLetter(car.killometrage)}</p> : <p>{car.killometrage} Km</p>}
            </div>
          </div>
          <div className='flex gap-2'>
            <FaIdCard className='text-xl' />
            <p className='text-sm line-clamp-2'>Les conducteurs doivent avoir leur permis de conduire depuis au moins 2 ans</p>
          </div>
        </div>

        <div className='flex flex-col gap-4 justify-around w-1/2 md:w-full sm:w-full xsm:w-full'>
          <h1 className='text-2xl font-semibold'>DE QUELS MODULES COMPLEMENTAIRES AVEZ-VOUS BESOIN ?</h1>

          <div className='flex flex-col gap-4'>
              <div className='flex justify-between items-center border-2 border-mystic-400 rounded-md px-4 py-1'>
                <div className='flex flex-col justify-center items-start w-2/3'>
                  <Popover content={services[0].description} title={services[0].title} placement='left' >
                  <div className='flex gap-2 justify-center items-center cursor-default'>
                    {services[0].icon}
                    <p className='text-lg font-semibold'>{services[0].title}</p>
                  </div>
                  </Popover>
                </div>
                <div className='flex justify-center items-center gap-2 font-semibold'>
                  <p>{services[0].prix} <span className='text-sm'>Da {services[0].unite}</span></p>
                  <ConfigProvider
                    theme={{  token: {  colorPrimary: "#14a0a6"  },}}>
                    <Switch 
                    size="small" 
                    checked={selectedOptions.conductor} 
                    onChange={(checked) => {setSelectedOptions({ ...selectedOptions, conductor: checked}); console.log(selectedOptions) }} 
                    className='bg-mystic-300' />
                  </ConfigProvider>
                </div>
              </div>

              <div className='flex justify-between items-center border-2 border-mystic-400 rounded-md px-4 py-1'>
                <div className='flex flex-col justify-center items-start w-2/3'>
                  <Popover content={services[1].description} title={services[1].title} placement='left' >
                  <div className='flex gap-2 justify-center items-center cursor-default'>
                    {services[1].icon}
                    <p className='text-lg font-semibold'>{services[1].title}</p>
                  </div>
                  </Popover>
                </div>
                <div className='flex justify-center items-center gap-2 font-semibold'>
                  <p>{services[1].prix} <span className='text-sm'>Da {services[1].unite}</span></p>
                  <ConfigProvider
                    theme={{  token: {  colorPrimary: "#14a0a6"  },}}>
                    <Switch 
                    size="small" 
                    checked={selectedOptions.babySeat} 
                    onChange={(checked) => {setSelectedOptions({ ...selectedOptions, babySeat: checked}); console.log(selectedOptions) }} 
                    className='bg-mystic-300' />
                  </ConfigProvider>
                </div>
              </div>

              <div className='flex justify-between items-center border-2 border-mystic-400 rounded-md px-4 py-1'>
                <div className='flex flex-col justify-center items-start w-2/3'>
                  <Popover content={services[2].description} title={services[2].title} placement='left' >
                  <div className='flex gap-2 justify-center items-center cursor-default'>
                    {services[2].icon}
                    <p className='text-lg font-semibold'>{services[2].title}</p>
                  </div>
                  </Popover>
                </div>
                <div className='flex justify-center items-center gap-2 font-semibold'>
                  <p className="text-nowrap">{services[2].prix} <span className='text-sm'>Da {services[2].unite}</span></p>
                  <ConfigProvider
                    theme={{  token: {  colorPrimary: "#14a0a6"  },}}>
                    <Switch 
                    size="small" 
                    checked={selectedOptions.delivery} 
                    onChange={(checked) => {setSelectedOptions({ ...selectedOptions, delivery: checked}); console.log(selectedOptions) }} 
                    className='bg-mystic-300' />
                  </ConfigProvider>
                </div>
              </div>

              <div className='flex justify-between items-center border-2 border-mystic-400 rounded-md px-4 py-1'>
                <div className='flex flex-col justify-center items-start w-2/3'>
                  <Popover content={services[3].description} title={services[3].title} placement='left' >
                  <div className='flex gap-2 justify-center items-center cursor-default'>
                    {services[3].icon}
                    <p className='text-lg font-semibold'>{services[3].title}</p>
                  </div>
                  </Popover>
                </div>
                <div className='flex justify-center items-center gap-2 font-semibold'>
                  <p>{services[3].prix} <span className='text-sm'>Da {services[3].unite}</span></p>
                  <ConfigProvider
                    theme={{  token: {  colorPrimary: "#14a0a6"  },}}>
                    <Switch 
                    size="small" 
                    checked={selectedOptions.fuel} 
                    onChange={(checked) => {setSelectedOptions({ ...selectedOptions, fuel: checked}); console.log(selectedOptions) }} 
                    className='bg-mystic-300' />
                  </ConfigProvider>
                </div>
              </div>
          </div>
          
          <div className='flex justify-between'>
            <div className='flex gap-4'>
              <div className='flex gap-2 font-semibold items-end'>
                <p className='text-3xl'>{car.prixParJour}</p>
                <p>Da / Jour</p>
              </div>
              <div className='flex gap-2 font-semibold items-end'>
                <p className='text-xl'>{totalPrice}</p>
                <p>Da / Totale</p>
              </div>
            </div>
            <button className='bg-flamingo-500 hover:bg-casal-900 font-bold text-white px-8 py-2 rounded-md tracking-widest transition-colors duration-300'
            onClick={handleReserve}>
              {user === null ? <p>s&apos;Inscrire</p> : <p>Reserver</p>}
            </button>
          </div>
          {user === null ? <p className="text-red-600">Vous ne pouver pas Reserver si vous n&apos;avez pas de compte avec AUTOLOC</p> : <></>}
        </div>
      </div>
    </Modall>
  )
}

export default Modal
