'use client';
import React, { useImperativeHandle, forwardRef, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CarFormData, NormalUserFormData, ReservationData, ReservationWithDetails } from '@/types';
import { calculateNombreJours, calculatePrixTotal } from '@/utils/functions';


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
    <div ref={divRef} className="p-6 bg-white w-[210mm] h-[297mm]">

      <div className="flex justify-between items-center mb-4">
        <div className="ml-5">
          <p className="text-xs mb-1">Contrat Rempli par: AUTOLOC</p>
          <p className="text-xs mb-1">Société: {user?.data.nomAgence}</p>
        </div>
        <div className="p-3 border-2 border-gray-400 flex flex-col mr-5">
          <p className="text-xs mb-1">{user?.data.rue} Nº{user?.data.numeroMaison}</p>
          <p className="text-xs mb-1">{user?.data.commune}, {user?.data.ville}</p>
          <p className="text-xs mb-1">Tel: {user?.data.numeroTelephone}</p>
        </div>
      </div>
      <div className="flex justify-center items-center mb-4">
        <p className="text-xl text-center px-4 font-semibold tracking-wide border-2 border-black">CONTRAT DE LOCATION</p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">

        <div className="flex flex-col ml-4">
          <div className="mb-4 flex flex-col">
            <p className="text-center mb-2">Espace Client</p>
            <p className="text-xs mb-1">Société: ................</p>
            <p className="text-xs mb-1">Nom: {reservation?.user.nom}</p>
            <p className="text-xs mb-1">Prénom: {reservation?.user.prenom}</p>
            <p className="text-xs mb-1">Adresse: {reservation?.user.rue} Nº{reservation?.user.numeroMaison}, {reservation?.user.commune}</p>
            <p className="text-xs mb-1">Tel: {reservation?.user.numeroTelephone}</p>
          </div>
          <div className="mb-8 flex flex-col">
            <div className="grid grid-cols-4">
              <div className="text-[10px] font-medium border-2 col-span-2 border-black p-2">
                <span>Permis Nº:  {reservation?.user.numeroPermis}</span>
              </div>
              <div className="text-[10px] font-medium border-2 col-span-1 border-black p-2">
                <span>Délivré le:  {reservation?.user.dateEmission}</span>
              </div>
              <div className="text-[10px] font-medium border-2 col-span-1 border-black p-2">
                <span>Par:  {reservation?.user.ville}</span>
              </div>
            </div>
            <div className="grid grid-cols-4">
              <div className="text-[10px] font-medium border-2 col-span-2 border-black p-2">
                <span>Né(e):  {reservation?.user.dateNaissance}</span>
              </div>
              <div className="text-[10px] font-medium border-2 col-span-1 border-black p-2">
                <span>Lieu:  {reservation?.user.ville}</span>
              </div>
              <div className="text-[10px] font-medium border-2 col-span-1 border-black p-2">
                <span>Nationalité:  {reservation?.user.pays}</span>
              </div>
            </div>
          </div>
          <div className="mb-4 flex flex-col">
            <p className="text-center mb-2">2ème Conducteur</p>
            <p className="text-xs mb-1">Nom: .......................................................</p>
            <p className="text-xs mb-1">Prénom: ...................................................</p>
            <p className="text-xs mb-1">Adresse: .......................................................</p>
            <p className="text-xs mb-1">...................................................................</p>
          </div>
          <div className="mb-8 flex flex-col">
            <div className="grid grid-cols-4">
              <div className="text-[10px] font-medium border-2 col-span-2 border-black p-2">
                <span>Permis Nº:</span>
              </div>
              <div className="text-[10px] font-medium border-2 col-span-1 border-black p-2">
                <span>Délivré le:</span>
              </div>
              <div className="text-[10px] font-medium border-2 col-span-1 border-black p-2">
                <span>Par:</span>
              </div>
            </div>
            <div className="grid grid-cols-4">
              <div className="text-[10px] font-medium border-2 col-span-2 border-black p-2">
                <span>Né(e):</span>
              </div>
              <div className="text-[10px] font-medium border-2 col-span-1 border-black p-2">
                <span>Lieu: </span>
              </div>
              <div className="text-[10px] font-medium border-2 col-span-1 border-black p-2">
                <span>Nationalité:</span>
              </div>
            </div>
            <div className="grid ">
              <span className="text-[10px] font-medium border-2 col-span-1 border-black p-2 pb-4">Observation:</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col pr-4">
          <div className="mb-4 flex flex-col">
            <p className="text-center mb-2">Véhicule</p>

            <div className="flex w-full">
              <div className="text-[10px] font-medium border border-gray-400 w-3/5">
                <p>Marque/type:</p>
                <p className="text-center">{reservation?.car.marque} {reservation?.car.modele}</p>
              </div>
              <div className="text-[10px] font-medium border border-gray-400 w-1/3">
                <p>Immatriculation:</p>
                <p className="text-center">{reservation?.car.immatricule}</p>
              </div>
            </div>

            <div className="flex w-full">
              <div className="text-[10px] font-medium border border-gray-400 w-3/5">
                <p>Nombre de jours:</p>
                <p className="text-center">{calculateNombreJours(reservation?.reservation.startDate, reservation?.reservation.endDate)} Jours</p>
              </div>
              <div className="text-[10px] font-medium border border-gray-400 w-1/3">
                <p>Forfait kilométrage:</p>
                <p className="text-center">{reservation?.car.killometrage} Km</p>
              </div>
            </div>
            <div className="flex w-full">
              <p className="text-[10px] font-medium border border-gray-400 p-2 w-3/5">Date de depart: {reservation?.reservation.startDate}</p>
              <p className="text-[10px] font-medium border border-gray-400 p-2 w-1/3">Km/départ:</p>
            </div>
            <div className="flex w-full">
              <p className="text-[10px] font-medium border border-gray-400 p-2 w-3/5">Date de retour: {reservation?.reservation.endDate}</p>
              <p className="text-[10px] font-medium border border-gray-400 p-2 w-1/3">Km/prévue:</p>
            </div>
            <div className="flex w-full">
              <div className="text-[10px] font-medium border border-gray-400 w-3/5">
                <p>Prix journée:</p>
                <p className="text-center">{reservation?.car.prixParJour} Da</p>
              </div>
              <div className="grid grid-cols-2 border border-gray-400 w-1/3">
                <p className="text-[10px] font-medium pb-4 ">Versé:</p>
                <p className="text-[10px] font-medium pb-4 border-l-2 border-l-black">Reste:</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col mb-4">
            <p className="text-xs mb-1">Prepaiement: {calculatePrixTotal(reservation?.car, reservation?.reservation.startDate, reservation?.reservation.endDate) - (calculatePrixTotal(reservation?.car, reservation?.reservation.startDate, reservation?.reservation.endDate) * 19) / 100} Da</p>
            <p className="text-xs mb-1">TVA: {(calculatePrixTotal(reservation?.car, reservation?.reservation.startDate, reservation?.reservation.endDate) * 19) / 100} Da</p>
            <p className="text-xs mb-1">Montant Net: {calculatePrixTotal(reservation?.car, reservation?.reservation.startDate, reservation?.reservation.endDate)} Da</p>
          </div>
          <div className="mb-4 flex flex-col">
            <p className="text-center mb-2">État du Véhicule</p>
            <div className="flex justify-between">
              <div className="flex flex-col items-center">
                <span>ETAT</span>
                <span className="text-[10px]">*Roue de secours</span>
                <span className="text-[10px]">*Avertisseur</span>
                <span className="text-[10px]">*Lavage</span>
                <span className="text-[10px]">*Controle des feux Av/Ar</span>
                <span className="text-[10px]">*Controle interieur</span>
                <span className="text-[10px]">*Crie</span>
                <span className="text-[10px]">*Trousse a outils</span>
                <span className="text-[10px]">*Extincteur</span>
                <span className="text-[10px]">*Enjoliveurs</span>
                <span className="text-[10px]">*Retroviseurs Int/Ext</span>
                <span className="text-[10px]">*Radio</span>
                <span className="text-[10px]">*Carburant</span>
              </div>
              <div className="flex gap-6">
                <div className="flex flex-col items-center mr-6">
                  <span>DEPART</span>
                  <span className="text-[10px]">▢</span>
                  <span className="text-[10px]">▢</span>
                  <span className="text-[10px]">▢</span>
                  <span className="text-[10px]">▢</span>
                  <span className="text-[10px]">▢</span>
                  <span className="text-[10px]">▢</span>
                  <span className="text-[10px]">▢</span>
                  <span className="text-[10px]">▢</span>
                  <span className="text-[10px]">▢</span>
                  <span className="text-[10px]">▢</span>
                  <span className="text-[10px]">▢</span>
                  <span className="text-[10px]">▢</span>
                </div>
                <div className="flex flex-col items-center">
                  <span>RETOUR</span>
                  <span className="text-[10px]">▢</span>
                  <span className="text-[10px]">▢</span>
                  <span className="text-[10px]">▢</span>
                  <span className="text-[10px]">▢</span>
                  <span className="text-[10px]">▢</span>
                  <span className="text-[10px]">▢</span>
                  <span className="text-[10px]">▢</span>
                  <span className="text-[10px]">▢</span>
                  <span className="text-[10px]">▢</span>
                  <span className="text-[10px]">▢</span>
                  <span className="text-[10px]">▢</span>
                  <span className="text-[10px]">▢</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="mb-4 flex justify-between mx-10">
        <p className="text-lg font-semibold border-b-4 border-b-black">SIGNATURE DU CLIENT</p>
        <p className="text-lg font-semibold border-b-4 border-b-black">SIGNATURE DE L&apos;ENTREPRISE</p>
      </div>
      <div className="mb-4 mx-5">
        <p className="text-xs">Je sousigne, delcare avoir accepte les conditions generales de location, je certifie que les renseignement me concernant.</p>
      </div>
      <div className='w-full h-20'></div>
    </div>
  );
});

PDFGenerator.displayName = 'PDFGenerator';

export default PDFGenerator;