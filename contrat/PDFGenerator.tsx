'use client';
import React, { useImperativeHandle, forwardRef, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ReservationWithDetails } from '@/types';
import { calculateNombreJours, calculatePrixTotal } from '@/utils/functions';
import { Watermark } from 'antd';


interface PDFGeneratorProps {
  reservation: ReservationWithDetails | null;
  user: { uid: string, data: any } | null;
}

interface PDFGeneratorHandle {
  generatePDFImage: () => Promise<string | undefined>;
}

const PDFGenerator = forwardRef<PDFGeneratorHandle, PDFGeneratorProps>(({ reservation, user }, ref) => {

  const divRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    async generatePDFImage() {
      if (divRef.current) {
        try {
          const canvas = await html2canvas(divRef.current);
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF();
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          const blob = pdf.output('blob');
          const url = URL.createObjectURL(blob);

          return url;
        } catch (error) {
          console.error('Error generating PDF: ', error);
        }
      }
    }
  }));

  return (
    <div ref={divRef} className="p-4 bg-white0 w-[210mm] h-[297mm] ">
      <Watermark content={['AUTOLOC', 'Car Rental']} >
      <div className="flex justify-between items-center px-4 mb-6">
        <div className="ml-5">
          <p className="text-[10px] mb-1">Contrat Rempli par: AUTOLOC</p>
          <p className="text-[10px] mb-1">Société: {user?.data.nomAgence}</p>
        </div>
        <div className="p-3 w-72 border border-black mr-5">
          <p className="text-[10px] mb-1">{user?.data.rue} Nº{user?.data.numeroMaison}</p>
          <p className="text-[10px] mb-1">{user?.data.commune}, {user?.data.ville}</p>
          <p className="text-[10px] mb-1">Tel: {user?.data.numeroTelephone}</p>
        </div>
      </div>
      <div className="flex justify-center items-center mb-6">
        <p className="text-xl text-center p-4 font-semibold tracking-wide border border-black">CONTRAT DE LOCATION</p>
      </div>

      <div className="grid grid-cols-2 gap-6 w-full">

        <div className="flex flex-col">
          <div className="mb-6 flex flex-col">
            <p className="text-center text-lg mb-6">Espace Client</p>
            <p className="text-[10px] mb-1">Société: ................</p>
            <p className="text-[10px] mb-1">Nom: <span className='font-medium'>{reservation?.user.nom}</span></p>
            <p className="text-[10px] mb-1">Prénom: <span className='font-medium'>{reservation?.user.prenom}</span></p>
            <p className="text-[10px] mb-1">Adresse: <span className='font-medium'>{reservation?.user.rue} Nº{reservation?.user.numeroMaison}, {reservation?.user.commune}</span></p>
            <p className="text-[10px] mb-1">Tel: <span className='font-medium'>{reservation?.user.numeroTelephone}</span></p>
          </div>

          <div className="mb-8 flex flex-col">
            <div className="grid grid-cols-3">
              <div className="text-[10px] font-medium border border-black p-1 py-2">
                <p>Permis Nº:</p>
                <p className='text-center'>{reservation?.user.numeroPermis}</p>
              </div>
              <div className="text-[10px] font-medium border border-black p-1 py-2">
                <p>Délivré le:</p>
                <p className='text-center'>{reservation?.user.dateEmission}</p>
              </div>
              <div className="text-[10px] font-medium border border-black p-1 py-2">
                <p>Par:</p>
                <p className='text-center'>{reservation?.user.ville}</p>
              </div>
            </div>
            <div className="grid grid-cols-3">
              <div className="text-[10px] font-medium border border-black p-1 py-2">
                <p>Né(e):</p>
                <p className='text-center'>{reservation?.user.dateNaissance}</p>
              </div>
              <div className="text-[10px] font-medium border border-black p-1 py-2">
                <p>Lieu:</p>
                <p className='text-center'>{reservation?.user.ville}</p>
              </div>
              <div className="text-[10px] font-medium border border-black p-1 py-2">
                <p>Nationalité:</p>
                <p className='text-center'>{reservation?.user.pays}</p>
              </div>
            </div>
          </div>
          <div className="mb-6 flex flex-col">
            <p className="text-center mb-2">2ème Conducteur</p>
            <p className="text-[10%] mb-1">Nom: .......................................................</p>
            <p className="text-[10%] mb-1">Prénom: ...................................................</p>
            <p className="text-[10%] mb-1">Adresse: .......................................................</p>
            <p className="text-[10%] mb-1">...................................................................</p>
          </div>
          <div className="mb-8 flex flex-col">
            <div className="grid grid-cols-3">
              <div className="text-[10px] font-medium border border-black p-1 py-2">
                <p>Permis Nº:</p>
                <p className='text-center'>........</p>
              </div>
              <div className="text-[10px] font-medium border border-black p-1 py-2">
                <p>Délivré le:</p>
                <p className='text-center'>........</p>
              </div>
              <div className="text-[10px] font-medium border border-black p-1 py-2">
                <p>Par:</p>
                <p className='text-center'>........</p>
              </div>
            </div>
            <div className="grid grid-cols-3">
              <div className="text-[10px] font-medium border border-black p-1 py-2">
                <p>Né(e):</p>
                <p className='text-center'>........</p>
              </div>
              <div className="text-[10px] font-medium border border-black p-1 py-2">
                <p>Lieu:</p>
                <p className='text-center'>........</p>
              </div>
              <div className="text-[10px] font-medium border border-black p-1 py-2">
                <p>Nationalité:</p>
                <p className='text-center'>........</p>
              </div>
            </div>
            <div className="grid border border-black p-2">
              <p className="text-[10px] font-medium ">Observation:  ..................................................................................</p>
              <p>.......................................................................................................................</p>
            </div>
          </div>
        </div>



        <div className="flex flex-col">
          <div className="mb-6 flex flex-col">
            <p className="text-center text-lg mb-6">Véhicule</p>

            <div className="grid grid-cols-3">
              <div className="text-[10px] font-medium border border-black col-span-2 p-1">
                <p>Marque/type:</p>
                <p className="text-center">{reservation?.car.marque} {reservation?.car.modele}</p>
              </div>
              <div className="text-[10px] font-medium border border-black p-1">
                <p>Immatriculation:</p>
                <p className="text-center">{reservation?.car.immatricule}</p>
              </div>
            </div>
            <div className="grid grid-cols-3">
              <div className="text-[10px] font-medium border border-black col-span-2 p-1">
                <p>Nombre de jours:</p>
                <p className="text-center">{calculateNombreJours(reservation?.reservation.startDate, reservation?.reservation.endDate)} Jours</p>
              </div>
              <div className="text-[10px] font-medium border border-black p-1">
                <p>Forfait kilométrage:</p>
                <p className="text-center">{reservation?.car.killometrage} Km</p>
              </div>
            </div>
            <div className="grid grid-cols-3">
              <div className="text-[10px] font-medium border border-black col-span-2 p-1">
                <p>Date de depart:</p>
                <p className='text-center'>{reservation?.reservation.startDate}</p>
              </div>
              <div className="text-[10px] font-medium border border-black p-1">
                <p>Km/départ:</p>
                <p className='text-center'>......</p>
              </div>
            </div>
            <div className="grid grid-cols-3">
              <div className="text-[10px] font-medium border border-black col-span-2 p-1">
                <p>Date de retour:</p>
                <p className='text-center'>{reservation?.reservation.endDate}</p>
              </div>
              <div className="text-[10px] font-medium border border-black p-1">
                <p>Km/prévue:</p>
                <p className='text-center'>......</p>
              </div>
            </div>
            <div className="grid grid-cols-3">
              <div className="text-[10px] font-medium border border-black col-span-2 p-1">
                <p>Prix journée:</p>
                <p className="text-center">{reservation?.car.prixParJour} Da</p>
              </div>
              <div className="grid grid-cols-2 border border-black">
                <div className="text-[10px] font-medium p-1">
                  <p>Versé:</p>
                  <p className='text-center'>...</p>
                </div>
                <div className="text-[10px] font-medium p-1">
                  <p>Reste:</p>
                  <p className='text-center'>...</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col mb-6">
            <p className="text-[10px] mb-1">Prepaiement: <span className='font-medium'>{calculatePrixTotal(reservation?.car, reservation?.reservation.startDate, reservation?.reservation.endDate) - (calculatePrixTotal(reservation?.car, reservation?.reservation.startDate, reservation?.reservation.endDate) * 19) / 100} Da</span></p>
            <p className="text-[10px] mb-1">TVA: <span className='font-medium'>{(calculatePrixTotal(reservation?.car, reservation?.reservation.startDate, reservation?.reservation.endDate) * 19) / 100} Da</span></p>
            <p className="text-[10px] mb-1">Montant Net: <span className='font-medium'>{calculatePrixTotal(reservation?.car, reservation?.reservation.startDate, reservation?.reservation.endDate)} Da</span></p>
          </div>
          <div className="mb-4 flex flex-col">
            <p className="text-center mb-2">État du Véhicule</p>
            <div className="flex justify-between">
              <div className="flex flex-col items-center">
                <span>ETAT</span>
                <span className="text-[10px] mb-1">*Roue de secours</span>
                <span className="text-[10px] mb-1">*Avertisseur</span>
                <span className="text-[10px] mb-1">*Lavage</span>
                <span className="text-[10px] mb-1">*Controle des feux Av/Ar</span>
                <span className="text-[10px] mb-1">*Controle interieur</span>
                <span className="text-[10px] mb-1">*Crie</span>
                <span className="text-[10px] mb-1">*Trousse a outils</span>
                <span className="text-[10px] mb-1">*Extincteur</span>
                <span className="text-[10px] mb-1">*Enjoliveurs</span>
                <span className="text-[10px] mb-1">*Retroviseurs Int/Ext</span>
                <span className="text-[10px] mb-1">*Radio</span>
                <span className="text-[10px] mb-1">*Carburant</span>
              </div>
              <div className="flex gap-6">
                <div className="flex flex-col items-center mr-6">
                  <span>DEPART</span>
                  <span className="text-[10px] mb-1">▢</span>
                  <span className="text-[10px] mb-1">▢</span>
                  <span className="text-[10px] mb-1">▢</span>
                  <span className="text-[10px] mb-1">▢</span>
                  <span className="text-[10px] mb-1">▢</span>
                  <span className="text-[10px] mb-1">▢</span>
                  <span className="text-[10px] mb-1">▢</span>
                  <span className="text-[10px] mb-1">▢</span>
                  <span className="text-[10px] mb-1">▢</span>
                  <span className="text-[10px] mb-1">▢</span>
                  <span className="text-[10px] mb-1">▢</span>
                  <span className="text-[10px] mb-1">▢</span>
                </div>
                <div className="flex flex-col items-center">
                  <span>RETOUR</span>
                  <span className="text-[10px] mb-1">▢</span>
                  <span className="text-[10px] mb-1">▢</span>
                  <span className="text-[10px] mb-1">▢</span>
                  <span className="text-[10px] mb-1">▢</span>
                  <span className="text-[10px] mb-1">▢</span>
                  <span className="text-[10px] mb-1">▢</span>
                  <span className="text-[10px] mb-1">▢</span>
                  <span className="text-[10px] mb-1">▢</span>
                  <span className="text-[10px] mb-1">▢</span>
                  <span className="text-[10px] mb-1">▢</span>
                  <span className="text-[10px] mb-1">▢</span>
                  <span className="text-[10px] mb-1">▢</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="mb-4 mt-8 flex justify-between px-8">
        <p className="text-lg font-semibold border-b-4 border-b-black">SIGNATURE DU CLIENT</p>
        <p className="text-lg font-semibold border-b-4 border-b-black">SIGNATURE DE L&apos;ENTREPRISE</p>
      </div>
      <div className="mb-4 px-6">
        <p className="text-[10px]">Je sousigne, delcare avoir accepte les conditions generales de location, je certifie que les renseignement me concernant.</p>
      </div>
      <div className='w-full h-16'></div>
      </Watermark>
    </div>
  );
});

PDFGenerator.displayName = 'PDFGenerator';

export default PDFGenerator;