'use client'
import React, { useEffect, useRef, useState } from 'react';
import { collection, query, where, getDocs, doc as firestoreDoc, getDoc, DocumentData } from 'firebase/firestore';
import { db } from '@/firebase/firebase';
import { CarFormData, NormalUserFormData, ReservationData, ReservationWithDetails } from '@/types';
import Image from 'next/image';
import { Image as Imagee, Modal, Button, Skeleton } from 'antd';
import PDFGenerator from '@/contrat/PDFGenerator';

type PDFGeneratorHandle = {
  generatePDFImage: () => Promise<string | undefined>;
}

interface RentalsMadeProps {
  user: { uid: string, data: any} | null;
}

interface Reservation extends ReservationData {
  id: string;
}

interface Car extends CarFormData {
  id: string;
}

interface NormalUser extends NormalUserFormData {
  id: string;
}


const RentalsMade: React.FC<RentalsMadeProps> = ({ user }) => {

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [cars, setCars] = useState<{ [key: string]: Car}>({});
  const [clients, setClients] = useState<{ [key: string]: NormalUserFormData}>({});
  const [selectedUser, setSelectedUser] = useState<NormalUserFormData | null>(null);
  const [visible, setVisible] = useState(false);
  const [selectedUserImageUrl, setSelectedUserImageUrl] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ReservationWithDetails | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const pdfGeneratorRef = useRef<PDFGeneratorHandle>(null);


  useEffect(() => {
    const fetchReservations = async () => {
      if (user) {
        try {
          const reservationsQuery = query(collection(db, 'Reservation'), where('idAgence', '==', user.uid), where('etat', '==', 'Accepte'));
          const reservationsSnapshot = await getDocs(reservationsQuery);
          const reservationsData: Reservation[] = [];
          const carsData: { [key: string]: Car} = {};
          const clientsData: { [key: string]: NormalUserFormData} = {};

          for (const doc of reservationsSnapshot.docs) {
            const reservationData = doc.data() as Reservation;
            reservationData.id = doc.id;
            reservationsData.push(reservationData);

            if (!carsData[reservationData.idVoiture]) {
              const carDocRef = firestoreDoc(db, 'Voiture', reservationData.idVoiture)
              const carDocSnap = await getDoc(carDocRef);
              if (carDocSnap.exists()) {
                carsData[reservationData.idVoiture] = { id: carDocSnap.id, ...carDocSnap.data() as DocumentData } as Car;
              }
            }
            
            if (!clientsData[reservationData.idUser]) {
              const clientDocRef = firestoreDoc(db, 'NormalUser', reservationData.idUser);
              const clientDocSnap = await getDoc(clientDocRef);
              if (clientDocSnap.exists()) {
                clientsData[reservationData.idUser] = { id: clientDocSnap.id, ...clientDocSnap.data() as NormalUserFormData } as NormalUser;
              }
            }
          }

          setReservations(reservationsData);
          setCars(carsData);
          setClients(clientsData);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching reservations: ', error);
          setLoading(false);
        }
      }
    };

    fetchReservations();
  }, [user]);

  const handleLicenceClick = (user: NormalUserFormData) => {
    setSelectedUser(user);
    if (typeof user.imagePermis === 'string') {
      setSelectedUserImageUrl(user.imagePermis);
    } else {
      let imageUrl;
      if (user.imagePermis!== null) {
        imageUrl = URL.createObjectURL(user.imagePermis);
      } else {
        imageUrl = "./default.jpg";
      }
      setSelectedUserImageUrl(imageUrl);
    }
    setVisible(true);
  };

  const handleViewContractClick = (reservation: Reservation, car: CarFormData, client: NormalUserFormData) => {
    setSelectedReservation({ reservation, car, user: client });
    setModalVisible(true);
    setPdfUrl(null);
  };

  const handleGeneratePdf = async () => {
    if (pdfGeneratorRef.current) {
      const url = await pdfGeneratorRef.current.generatePDFImage();
      setPdfUrl(url || null);
    }
  };


  return (
    <div>
      {loading ? (
        <div className='grid grid-cols-2 gap-4 justify-items-center'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} 
            className="bg-gradient-to-r from-mystic-100/30 to-casal-50/30 w-[531] h-[252] shadow-md rounded-lg p-3 gap-2 flex flex-col justify-between items-center">
              <Skeleton active title={{width: 250}} paragraph={false} style={{marginLeft: 150}} />
              <div className='grid grid-cols-2 gap-2 w-full justify-items-center'>
                <Skeleton.Image active style={{width: 250, height: 160, borderRadius: 6}} />
                <Skeleton active title={false} paragraph={{rows: 4, width: [126, 123, 208, 147]}} />
              </div>
            </div>
          ))}
        </div>
      ) : reservations.length > 0 ? (
        <div className='grid grid-cols-2 gap-4 justify-items-center'>
          {reservations.map((reservation) => (
            <div key={reservation.id} 
            className="bg-gradient-to-r from-mystic-100/30 to-casal-50/30 w-full h-fit shadow-md rounded-lg p-3 flex flex-col gap-2 justify-between items-center">
              <p className='text-xl font-semibold'>{cars[reservation.idVoiture]?.marque} {cars[reservation.idVoiture]?.modele} {cars[reservation.idVoiture]?.annee}</p>
              <div className='grid grid-cols-2 gap-2 w-full'>
                <div className='relative w-full h-40 rounded-md'>
                  <Image
                  fill
                  style={{ objectFit: "cover", borderRadius: 6}}
                  src={cars[reservation.idVoiture].imagesVoiture[0]} 
                  alt={`${cars[reservation.idVoiture].marque} ${cars[reservation.idVoiture].modele}`} />
                </div>
                <div className='flex flex-col justify-evenly items-center'>
                  <p>{clients[reservation.idUser].nom} {clients[reservation.idUser].prenom}</p>
                  <p>{clients[reservation.idUser].numeroTelephone}</p>
                  <div className='flex gap-4'>
                    <p className='flex flex-col items-center'><span>Date depart</span><span>{reservation.startDate}</span></p>
                    <p className='flex flex-col items-center'><span>Date retour</span><span>{reservation.endDate}</span></p>
                  </div>
                  <p>Prix total: {reservation.prixTotal} DA</p>
                </div>
              </div>
              <div className='w-full grid grid-cols-2 justify-items-center'>
                <button className='text-casal-900 font-semibold' onClick={() => handleLicenceClick(clients[reservation.idUser])}>Voir Permis de Client</button>
                <button className='text-casal-900 font-semibold' onClick={() => handleViewContractClick(reservation, cars[reservation.idVoiture], clients[reservation.idUser])}>Voir le contrat de location</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No reservations found.</p>
      )}
      <Imagee
        width={200}
        alt={`${user?.data.nom} ${user?.data.prenom}`}
        style={{ display: 'none' }}
        src={selectedUserImageUrl || "./default.jpg"}
        preview={{
          visible,
          src: selectedUserImageUrl || "./default.jpg",
          onVisibleChange: (value) => {
            setVisible(value);
          },
        }}
      />
      <Modal
        title={`Contrat de Location ${selectedReservation?.user.nom} ${selectedReservation?.user.prenom}`}
        visible={modalVisible}
        footer={
          <div className='flex gap-3 justify-end'>
          <Button onClick={handleGeneratePdf} className='text-casal-900 font-medium border border-casal-900'>Generee le PDF</Button>
          {pdfUrl && (
            <div>
              <a href={pdfUrl} download={`Contrat_Location_${selectedReservation?.user.nom}_${selectedReservation?.user.prenom}.pdf`} target="_blank" rel='noopener noreferrer'>
                <Button type='primary' className='bg-casal-900 font-medium'>Telecharger PDF</Button>
              </a>
            </div>
          )}
          </div>
        }
        onCancel={() => setModalVisible(false)}
        width={1000}
      >
        {selectedReservation && (
          <PDFGenerator ref={pdfGeneratorRef} reservation={selectedReservation} user={user} />
        )}
      </Modal>
    </div>
  )
}

export default RentalsMade
