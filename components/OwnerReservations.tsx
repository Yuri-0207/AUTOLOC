'use client';
import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CarFormData, NormalUserFormData, ReservationData } from '@/types';
import { calculateNombreJours, calculatePrixTotal } from '@/utils/functions';
import { Modal, Image } from 'antd';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/firebase/firebase';
// import { saveAs } from 'file-saver';
// import { uploadBytes, ref, getDownloadURL } from '@firebase/storage';
// import PDFGenerator from '@/contrat/PDFGenerator';
// import 'jspdf.plugin.png_support';



interface ReservationDataExt extends ReservationData {
  id: string;
}

interface ReservationWithDetails {
  reservation: ReservationDataExt;
  car: CarFormData;
  user: NormalUserFormData;
}

interface OwnerReservationsProps {
  user: { uid: string, data: any} | null;
  isInLanding?: boolean;
}

const OwnerReservations: React.FC<OwnerReservationsProps> = ({ user, isInLanding }) => {

  const pdfGeneratorRef = useRef<{ generatePDF: () => Promise<Blob | undefined> }>(null);

  const [reservations, setReservations] = useState<ReservationWithDetails[]>([]);
  const [selectedUser, setSelectedUser] = useState<NormalUserFormData | null>(null);
  const [visible, setVisible] = useState(false);
  const [selectedUserImageUrl, setSelectedUserImageUrl] = useState<string | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<ReservationWithDetails | null>(null);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null | undefined>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  // const uploadPDFToStorage = async (blob: Blob, fileName: string): Promise<string> => {
  //   const storageRef = ref(storage, `contracts/${fileName}`);
  //   await uploadBytes(storageRef, blob);
  //   return getDownloadURL(storageRef);
  // };

  // const generateAndShowPDF = async (reservation: ReservationWithDetails, user: { uid: string, data: any} | null) => {
  //   setSelectedReservation(reservation);
  //   if (pdfGeneratorRef.current) {
  //     const blob = await pdfGeneratorRef.current.generatePDF();
  //     if (blob === undefined) {
  //       console.error('Failed to generate PDF');
  //       return;
  //     }
  //     setPdfBlob(blob);
  //     setShowPdfModal(true);
  //   }
  // };

  // const handleUploadPDF = async (blob: Blob, reservation: ReservationWithDetails) => {
  //   const fileName = `contrat_de_location_${reservation.user.nom}_${reservation.user.prenom}.pdf`;
  //   const downloadURL = await uploadPDFToStorage(blob, fileName);
  //   return downloadURL;
  // };

  const handleClick = (user: NormalUserFormData) => {
    setSelectedUser(user);
    if (typeof user.imagePermis === 'string') {
      setSelectedUserImageUrl(user.imagePermis);
    } else {
      let imageUrl;
      if (user.imagePermis !== null) {
        imageUrl = URL.createObjectURL(user.imagePermis);
      } else {
        imageUrl = './default.jpg';
      }
      setSelectedUserImageUrl(imageUrl);
    }
    setVisible(true);
  };

  const handleUpdateReservationStatus = async (reservationId: string, newStatus: string, reservationWithDetails: ReservationWithDetails) => {
    try {
      const { reservation, car } = reservationWithDetails;
      const reservationRef = doc(db, 'Reservation', reservationId);
      await updateDoc(reservationRef, {
        etat: newStatus,
      });

      if (newStatus === 'Accepte') {
        const carRef = doc(db, 'Voiture', reservation.idVoiture);
        const newAvailability = {
          startDate: reservation.startDate,
          endDate: reservation.endDate,
        };
        await updateDoc(carRef, {
          availability: [...car.availability, newAvailability],
        });

        // const pdfDownloadURL = await handleUploadPDF(pdfBlob!, reservationWithDetails);
        // await updateDoc(reservationRef, {
        //   contrat: pdfDownloadURL,
        // });
      }
      setReservations((prevReservations) =>
        prevReservations.filter((r) => r.reservation.id !== reservationId)
      );
    } catch (error) {
      console.error('Error updating reservation status or car availability:', error);
    }
  };

  // const handleSavePdf = async (reservation: ReservationWithDetails) => {
  //   if (pdfBlob) {
  //     const pdfDownloadURL = await handleUploadPDF(pdfBlob, reservation);
  //     const reservationRef = doc(db, 'Reservation', reservation.reservation.id);
  //     await updateDoc(reservationRef, {
  //       contrat: pdfDownloadURL,
  //     });
  //     setShowPdfModal(false);
  //     setPdfBlob(null);
  //     saveAs(pdfBlob, `contrat_de_location_${reservation.user.nom}_${reservation.user.prenom}.pdf`);
  //   }
  // };

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
        const reservationsData = reservationSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as ReservationData),
        }));

        const reservationDetailsPromises = reservationsData.map(async (reservation) => {
          const carDocRef = doc(db, 'Voiture', reservation.idVoiture);
          const carSnapshot = await getDoc(carDocRef);
          const carData = carSnapshot.data() as CarFormData;

          const userDocRef = doc(db, 'NormalUser', reservation.idUser);
          const userSnapshot = await getDoc(userDocRef);
          const userData = userSnapshot.data() as NormalUserFormData;

          return {
            reservation,
            car: carData,
            user: userData,
          };
        });
        const reservationDetails = await Promise.all(reservationDetailsPromises);
        setReservations(reservationDetails);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchReservations();
  }, [user]);

  if (reservations.length === 0) {
    return <div>Aucun Demande de Reservation pour l&apos;instants.</div>;
  }

  return (
    <section className={`grid gap-6 text-mystic-900 ${isInLanding ? 'grid-cols-3 justify-items-start' : 'grid-cols-2 justify-items-center'}`}>
      {reservations.map((reservationWithDetails, index) => (
        <div key={index} className="w-[450px] shadow-md rounded-lg bg-gradient-to-r from-mystic-100/30 to-casal-50/30 p-2 flex flex-col gap-4">
          <div className="flex items-start gap-8">
            <div className="flex flex-col justify-between items-center h-full w-1/2">
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
            </div>

            <div className="flex flex-col justify-between items-center h-full w-1/2">
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
            {/* <button
              className="rounded-md px-4 py-1 bg-green-600 text-white font-semibold"
              onClick={() => generateAndShowPDF(reservationWithDetails, user)}
            >
              Voir le contrat
            </button> */}
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
      {/* {selectedPdfUrl && (
        <div className="pdf-viewer">
          <iframe src={selectedPdfUrl} width="100%" height="600px"></iframe>
        </div>
      )}
      <div style={{ display: 'none' }}>
        {reservations[0] && <PDFGenerator ref={pdfGeneratorRef} reservation={reservations[0]} user={user} />}
      </div> */}
      {/* <Modal
        open={showPdfModal} // Updated to use 'open' instead of 'visible'
        onCancel={() => setShowPdfModal(false)}
        footer={[
          <button
            key="save"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={() => handleSavePdf(selectedReservation!)}
          >
            Sauvegarder et Télécharger le PDF
          </button>
        ]}
      >
        {pdfBlob && (
          <iframe
            src={URL.createObjectURL(pdfBlob)}
            width="100%"
            height="600px"
          ></iframe>
        )}
      </Modal> */}
    </section>
  );
};

export default OwnerReservations;
