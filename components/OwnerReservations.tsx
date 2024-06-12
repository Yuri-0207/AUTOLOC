'use client';
import React, { useRef, useState, useEffect } from 'react';
import { CarFormData, NormalUserFormData, ReservationData } from '@/types';
import { calculateNombreJours } from '@/utils/functions';
import { Image, Skeleton, message } from 'antd';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebase';

interface ReservationDataExt extends ReservationData {
  id: string;
}

interface ReservationWithDetails {
  reservation: ReservationDataExt;
  car: CarFormData | null;
  user: NormalUserFormData | null;
}

interface OwnerReservationsProps {
  user: { uid: string, data: any } | null;
  isInLanding?: boolean;
}

const OwnerReservations: React.FC<OwnerReservationsProps> = ({ user, isInLanding }) => {
  const pdfGeneratorRef = useRef<{ generatePDF: () => Promise<Blob | undefined> }>(null);

  const [reservations, setReservations] = useState<ReservationWithDetails[]>([]);
  const [selectedUser, setSelectedUser] = useState<NormalUserFormData | null>(null);
  const [visible, setVisible] = useState(false);
  const [selectedUserImageUrl, setSelectedUserImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const handleClick = (user: NormalUserFormData | null) => {
    if (!user) return;
    setSelectedUser(user);
    setSelectedUserImageUrl(typeof user.imagePermis === 'string' ? user.imagePermis : './default.jpg');
    setVisible(true);
  };

  const handleUpdateReservationStatus = async (reservationId: string, newStatus: string, reservationWithDetails: ReservationWithDetails) => {
    try {
      const { reservation, car } = reservationWithDetails;
      const reservationRef = doc(db, 'Reservation', reservationId);
      await updateDoc(reservationRef, { etat: newStatus });

      if (newStatus === 'Accepte' && car) {
        const carRef = doc(db, 'Voiture', reservation.idVoiture);
        const newAvailability = { startDate: reservation.startDate, endDate: reservation.endDate };
        await updateDoc(carRef, { availability: [...car.availability, newAvailability] });
      }
      setReservations(prevReservations => prevReservations.filter(r => r.reservation.id !== reservationId));
      message.success(`Reservation ${newStatus}`);
    } catch (error) {
      console.error('Error updating reservation status or car availability:', error);
      message.error('Erreur lors de la mise à jour de la réservation.');
    }
  };

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user?.uid) return;

      try {
        const q = query(
          collection(db, 'Reservation'),
          where('idAgence', '==', user.uid),
          where('etat', '==', 'En attente')
        );
        const reservationSnapshot = await getDocs(q);
        const reservationsData = reservationSnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as ReservationData),
        }));

        const reservationDetailsPromises = reservationsData.map(async reservation => {
          const carDocRef = doc(db, 'Voiture', reservation.idVoiture);
          const carSnapshot = await getDoc(carDocRef);
          const carData = carSnapshot.exists() ? (carSnapshot.data() as CarFormData) : null;

          const userDocRef = doc(db, 'NormalUser', reservation.idUser);
          const userSnapshot = await getDoc(userDocRef);
          const userData = userSnapshot.exists() ? (userSnapshot.data() as NormalUserFormData) : null;

          return { reservation, car: carData, user: userData };
        });

        const reservationDetails = await Promise.all(reservationDetailsPromises);
        setReservations(reservationDetails);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reservations:', error);
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user]);

  if (loading) {
    return (
      <section className={`grid gap-6 text-mystic-900 ${isInLanding ? 'grid-cols-3 justify-items-start' : 'grid-cols-2 justify-items-center'}`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="w-[450px] h-[220px] flex items-center shadow-md rounded-lg bg-gradient-to-r from-mystic-100/30 to-casal-50/30 p-2 gap-4">
            <Skeleton active paragraph={{ rows: 4 }} />
            <Skeleton active paragraph={{ rows: 4 }} />
          </div>
        ))}
      </section>
    );
  }

  if (reservations.length === 0) {
    return <div>Aucun Demande de Reservation pour l&apos;instants.</div>;
  }

  return (
    <section className={`grid gap-6 text-mystic-900 ${isInLanding ? 'grid-cols-3 justify-items-start' : 'grid-cols-2 justify-items-center'}`}>
      {reservations.map((reservationWithDetails, index) => (
        <div key={index} className="w-[450px] shadow-md rounded-lg bg-gradient-to-r from-mystic-100/30 to-casal-50/30 p-2 flex flex-col gap-4">
          <div className="flex items-start gap-8">
            <div className="flex flex-col justify-between items-center h-full w-1/2">
              {reservationWithDetails.car && (
                <>
                  <div className="font-semibold">
                    <p className="text-lg font-semibold">{reservationWithDetails.car.marque} {reservationWithDetails.car.modele}</p>
                    <p className="text-center -mt-2">{reservationWithDetails.car.annee}</p>
                  </div>
                  <div>
                    <div className="flex flex-col items-center">
                      <div className="flex gap-3 items-center">
                        <p>Depart:</p>
                        <p className="text-lg font-semibold">{reservationWithDetails.reservation.startDate}</p>
                      </div>
                      <div className="flex gap-3 items-center">
                        <p>Retour:</p>
                        <p className="text-lg font-semibold">{reservationWithDetails.reservation.endDate}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="text-lg font-semibold">{calculateNombreJours(reservationWithDetails.reservation.startDate, reservationWithDetails.reservation.endDate)}</p>
                    <p>Jours</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p>Prix Totale:</p>
                    <p className="text-lg font-semibold">{reservationWithDetails.reservation.prixTotal}Da</p>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col justify-between items-center h-full w-1/2">
              {reservationWithDetails.user && (
                <>
                  <div className="text-lg font-semibold">{reservationWithDetails.user.nom} {reservationWithDetails.user.prenom}</div>
                  <div>
                    <p>{reservationWithDetails.user.rue} Nº{reservationWithDetails.user.numeroMaison},</p>
                    <p className="text-center">{reservationWithDetails.user.commune}, {reservationWithDetails.user.ville}</p>
                  </div>
                  <div className="tracking-wider">
                    <p>{reservationWithDetails.user.numeroTelephone}</p>
                    {reservationWithDetails.user.numeroTelephoneSecondaire && <p>{reservationWithDetails.user.numeroTelephoneSecondaire}</p>}
                  </div>
                  <button className="text-casal-900 font-semibold" onClick={() => handleClick(reservationWithDetails.user)}>Voir Permis de Client</button>
                </>
              )}
            </div>
          </div>

          <div className="flex justify-evenly">
            <button
              onClick={() => handleUpdateReservationStatus(reservationWithDetails.reservation.id, 'Refuse', reservationWithDetails)}
              className="rounded-md px-4 py-1 bg-flamingo-600 text-white font-semibold"
            >
              Refuser
            </button>
            <button
              onClick={() => handleUpdateReservationStatus(reservationWithDetails.reservation.id, 'Accepte', reservationWithDetails)}
              className="rounded-md px-4 py-1 bg-casal-900 text-white font-semibold"
            >
              Accepter
            </button>
          </div>
        </div>
      ))}
      <Image
        width={200}
        alt={`${user?.data.nom} ${user?.data.prenom}`}
        style={{ display: 'none' }}
        src={selectedUserImageUrl || './default.jpg'}
        preview={{
          visible,
          src: selectedUserImageUrl || './default.jpg',
          onVisibleChange: (value) => {
            setVisible(value);
          },
        }}
      />
    </section>
  );
};

export default OwnerReservations;
