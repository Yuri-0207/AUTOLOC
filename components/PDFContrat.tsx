'use client';
import React from 'react';
import { Document, Page, View, Text, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { CarFormData, NormalUserFormData, OwnerFormData, ReservationData } from '@/types';
import { calculateNombreJours, calculatePrixTotal } from '@/utils/functions';

Font.register({
  family: 'PlayFair',
  src: '/fonts/PlayfairDisplay-VariableFont_wght.ttf',
});

const styles = StyleSheet.create({
  page: {
    padding: 25,
    fontFamily: 'PlayFair',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(50%, -50%) rotate(-45deg)',
    opacity: 0.2,
    fontSize: 100,
    color: 'gray',
    fontWeight: 900,
  },
  text: {
    fontSize: 10, 
    marginBottom: 5,
  },
  text2: {
    fontSize: 10, 
    marginBottom: 2,
  },
});

interface ReservationDataExt extends ReservationData {
  id: string;
}

interface ReservationWithDetails {
  reservation: ReservationDataExt;
  car: CarFormData;
  user: NormalUserFormData;
}

interface PDFContratProps {
  reservation: ReservationWithDetails;
  user: { uid: string, data: any} | null;
}

const PDFContrat: React.FC<PDFContratProps> = ({ reservation, user }) => (


  <Document>
    <Page size="A4" style={styles.page}>
      {/* Watermark */}
      <View style={styles.watermark}>
        <Text>AUTOLOC</Text>
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <View style={{ padding: 5, display: 'flex', flexDirection: 'column', marginLeft: 20 }}>
          <Text style={styles.text}>Contrat Rempli par: AUTOLOC</Text>
          <Text style={styles.text}>Societe:{user?.data.nomAgence}</Text>
        </View>

        <View style={{ padding: 5, borderStyle: 'solid', borderWidth: 2, borderColor: '#bfbfbf', display: 'flex', flexDirection: 'column', width: 300, marginRight: 20 }}>
          <Text style={styles.text}>{user?.data.rue}  Nº{user?.data.numeroMaison}</Text>
          <Text style={styles.text}>{user?.data.commune}, {user?.data.ville}</Text>
          <Text style={styles.text}>Tel: {user?.data.numeroTelephone}</Text>
        </View>
      </View>

      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ fontSize: 18, textAlign: 'center', padding: 4, fontWeight: 600, letterSpacing: 2,  borderStyle: 'solid', borderWidth: 2, borderColor: '#bfbfbf', }}>CONTRAT DE LOCATION</Text>
      </View>

      <View style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <View style={{ width: '40%'}}>

          <View style={{ marginBottom: 10, display: 'flex', flexDirection: 'column',}}>
            <Text style={{ alignSelf: 'center', marginBottom: 10}}>Espace Client</Text>
            <Text style={styles.text}>Société: ................</Text>
            <Text style={styles.text}>Nom: {reservation.user.nom}</Text>
            <Text style={styles.text}>Prénom: {reservation.user.prenom}</Text>
            <Text style={styles.text}>Adresse: {reservation.user.rue} Nº{reservation.user.numeroMaison}, {reservation.user.commune}</Text>
            <Text style={styles.text}>Tel: {reservation.user.numeroTelephone}</Text>
          </View>

          <View style={{ marginBottom: 30, display: 'flex', flexDirection: 'column' }}>
            <View style={{ display: 'flex',}}>
              <View style={{fontSize: 10, fontWeight: 500, borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', width: 115, display: 'flex', flexDirection: 'column'}}>
                <Text>Permis Nº:</Text>
                <Text style={{textAlign: 'center'}}>{reservation.user.numeroPermis}</Text>
              </View>
              <View style={{fontSize: 10, fontWeight: 500, borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', width: 95, display: 'flex', flexDirection: 'column'}}>
                <Text>Délivré le:</Text>
                <Text style={{textAlign: 'center'}}>{reservation.user.dateEmission}</Text>
              </View>
              <View style={{fontSize: 10, fontWeight: 500, borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', width: 95, display: 'flex', flexDirection: 'column'}}>
                <Text>Par:</Text>
                <Text style={{textAlign: 'center'}}>{reservation.user.ville}</Text>
              </View>
            </View>
            <View style={{ display: 'flex',}}>
              <View style={{fontSize: 10, fontWeight: 500, borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', width: 115, display: 'flex', flexDirection: 'column'}}>
                <Text>Né(e):</Text>
                <Text style={{textAlign: 'center'}}>{reservation.user.dateNaissance}</Text>
              </View>
              <View style={{fontSize: 10, fontWeight: 500, borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', width: 95, display: 'flex', flexDirection: 'column'}}>
                <Text>Lieu:</Text>
                <Text style={{textAlign: 'center'}}>{reservation.user.ville}</Text>
              </View>
              <View style={{fontSize: 10, fontWeight: 500, borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', width: 95, display: 'flex', flexDirection: 'column'}}>
                <Text>Nationalité:</Text>
                <Text style={{textAlign: 'center'}}>{reservation.user.pays}</Text>
              </View>
            </View>
          </View>

          <View style={{ marginBottom: 10, display: 'flex', flexDirection: 'column' }}>
            <Text style={{ alignSelf: 'center', marginBottom: 10}}>2ème Conducteur</Text>
            <Text style={styles.text}>Nom: .......................................................</Text>
            <Text style={styles.text}>Prénom: ...................................................</Text>
            <Text style={styles.text}>Adresse: .......................................................</Text>
            <Text style={styles.text}>...................................................................</Text>
          </View>
          
          <View style={{ marginBottom: 10, display: 'flex', flexDirection: 'column' }}>
            <View style={{ display: 'flex',}}>
              <Text style={{fontSize: 10, fontWeight: 500, borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', paddingBottom: 15, width: 115}}>Permis Nº:</Text>
              <Text style={{fontSize: 10, fontWeight: 500, borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', paddingBottom: 15, width: 95}}>Délivré le:</Text>
              <Text style={{fontSize: 10, fontWeight: 500, borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', paddingBottom: 15, width: 95}}>Par:</Text>
            </View>
            <View style={{ display: 'flex',}}>
              <Text style={{fontSize: 10, fontWeight: 500, borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', paddingBottom: 15, width: 115}}>Né(e):</Text>
              <Text style={{fontSize: 10, fontWeight: 500, borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', paddingBottom: 15, width: 95}}>Lieu:</Text>
              <Text style={{fontSize: 10, fontWeight: 500, borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', paddingBottom: 15, width: 95}}>Nationalité:</Text>
            </View>
            <View style={{ display: 'flex',}}>
              <Text style={{fontSize: 10, fontWeight: 500, marginBottom: 5, borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', paddingBottom: 15, width: 305}}>Observation:</Text>
            </View>
          </View>
        </View>

        <View style={{ width: '50%',}}>
          <View style={{ marginBottom: 10, display: 'flex', flexDirection: 'column', }}>
            <Text style={{ alignSelf: 'center', marginBottom: 5}}>Véhicule</Text>
            <View style={{ display: 'flex',}}>
              <View style={{fontSize: 10, fontWeight: 500, borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', width: 300, display: 'flex', flexDirection: 'column'}}>
                <Text style={styles.text}>Marque/type:</Text>
                <Text style={{textAlign: 'center'}}>{reservation.car.marque} {reservation.car.modele}</Text>
              </View>
              <View style={{fontSize: 10, fontWeight: 500, borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', width: 150, display: 'flex', flexDirection: 'column'}}>
                <Text style={styles.text}>Immatriculation:</Text>
                <Text style={{textAlign: 'center'}}>{reservation.car.immatricule}</Text>
              </View>
            </View>
            <View style={{ display: 'flex',}}>
              <View style={{fontSize: 10, fontWeight: 500, borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', width: 300, display: 'flex', flexDirection: 'column'}}>
                <Text style={styles.text}>Nombre de jours:</Text>
                <Text style={{textAlign: 'center'}}>{calculateNombreJours(reservation.reservation.startDate, reservation.reservation.endDate)} Jours</Text>
              </View>
              <View style={{fontSize: 10, fontWeight: 500, borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', width: 150, display: 'flex', flexDirection: 'column'}}>
                <Text style={styles.text}>Forfait kilométrage:</Text>
                <Text style={{textAlign: 'center'}}>{reservation.car.killometrage} Km</Text>
              </View>
            </View>
            <View style={{ display: 'flex',}}>
              <Text style={{fontSize: 10, fontWeight: 500, borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', paddingTop: 3, paddingBottom: 3, width: 300}}>Date de depart: {reservation.reservation.startDate}</Text>
              <Text style={{fontSize: 10, fontWeight: 500, borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', paddingTop: 3, paddingBottom: 3, width: 150}}>Km/départ:</Text>
            </View>
            <View style={{ display: 'flex',}}>
              <Text style={{fontSize: 10, fontWeight: 500, borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', paddingTop: 3, paddingBottom: 3, width: 300}}>Date de retour: {reservation.reservation.endDate}</Text>
              <Text style={{fontSize: 10, fontWeight: 500, borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', paddingTop: 3, paddingBottom: 3, width: 150}}>Km/prévue:</Text>
            </View>
            <View style={{ display: 'flex',}}>
              <View style={{fontSize: 10, fontWeight: 500, borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', width: 300, display: 'flex', flexDirection: 'column'}}>
                <Text>Prix journée:</Text>
                <Text style={{textAlign: 'center'}}>{reservation.car.prixParJour} Da</Text>
              </View>
              <View style={{display: 'flex', borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', width: 150}}>
                <Text style={{fontSize: 10, fontWeight: 500, paddingBottom: 15, width: '50%', height: '100%'}}>Versé:</Text>
                <Text style={{fontSize: 10, fontWeight: 500, borderLeftStyle: 'solid', borderLeftWidth: 1, borderLeftColor: '#bfbfbf', paddingBottom: 15, width: '50%', height: '100%'}}>Reste:</Text>
              </View>
            </View>
          </View>

          <View style={{ display: 'flex', flexDirection: 'column',}}>
            <Text style={styles.text}>Prepaiement: {calculatePrixTotal(reservation.car, reservation.reservation.startDate, reservation.reservation.endDate) - (calculatePrixTotal(reservation.car, reservation.reservation.startDate, reservation.reservation.endDate) * 19) / 100} Da</Text>
            <Text style={styles.text}>TVA: {(calculatePrixTotal(reservation.car, reservation.reservation.startDate, reservation.reservation.endDate) * 19) / 100} Da</Text>
            <Text style={styles.text}>Montant Net: {calculatePrixTotal(reservation.car, reservation.reservation.startDate, reservation.reservation.endDate)} Da</Text>
          </View>

          <View style={{ marginBottom: 10, display: 'flex', flexDirection: 'column', }}>
            <Text style={{ alignSelf: 'center'}}>État du Véhicule</Text>
            <View style={{ display: 'flex', justifyContent: 'space-between' }}>

              <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Text>ETAT</Text>
                <Text style={styles.text2}>*Roue de secours</Text>
                <Text style={styles.text2}>*Avertisseur</Text>
                <Text style={styles.text2}>*Lavage</Text>
                <Text style={styles.text2}>*Controle des feux Av/Ar</Text>
                <Text style={styles.text2}>*Controle interieur</Text>
                <Text style={styles.text2}>*Crie</Text>
                <Text style={styles.text2}>Trousse a outils</Text>
                <Text style={styles.text2}>Extincteur</Text>
                <Text style={styles.text2}>Enjoliveurs</Text>
                <Text style={styles.text2}>Retroviseurs Int/Ext</Text>
                <Text style={styles.text2}>Radio</Text>
                <Text style={styles.text2}>Carburant</Text>
              </View>

              <View style={{ display: 'flex'}}>
                <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 30,}}>
                  <Text>DEPART</Text>
                  <Text style={styles.text2}>▢</Text>
                  <Text style={styles.text2}>▢</Text>
                  <Text style={styles.text2}>▢</Text>
                  <Text style={styles.text2}>▢</Text>
                  <Text style={styles.text2}>▢</Text>
                  <Text style={styles.text2}>▢</Text>
                  <Text style={styles.text2}>▢</Text>
                  <Text style={styles.text2}>▢</Text>
                  <Text style={styles.text2}>▢</Text>
                  <Text style={styles.text2}>▢</Text>
                  <Text style={styles.text2}>▢</Text>
                  <Text style={styles.text2}>▢</Text>
                </View>

                <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 30}}>
                  <Text>RETOUR</Text>
                  <Text style={styles.text2}>▢</Text>
                  <Text style={styles.text2}>▢</Text>
                  <Text style={styles.text2}>▢</Text>
                  <Text style={styles.text2}>▢</Text>
                  <Text style={styles.text2}>▢</Text>
                  <Text style={styles.text2}>▢</Text>
                  <Text style={styles.text2}>▢</Text>
                  <Text style={styles.text2}>▢</Text>
                  <Text style={styles.text2}>▢</Text>
                  <Text style={styles.text2}>▢</Text>
                  <Text style={styles.text2}>▢</Text>
                  <Text style={styles.text2}>▢</Text>
                </View>
              </View>

            </View>
          </View>
        </View>
      </View>

      <View style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between', marginRight: 40, marginLeft: 40}}>
        <Text style={{ fontSize: 16, borderBottomStyle: 'solid', borderBottomWidth: 2, borderBottomColor: '#bfbfbf', marginBottom: -5}}>SIGNATURE DU CLIENT</Text>
        <Text style={{ fontSize: 16, borderBottomStyle: 'solid', borderBottomWidth: 2, borderBottomColor: '#bfbfbf', marginBottom: -5}}>SIGNATURE DE L&apos;ENTREPRISE</Text>
      </View>

      <View style={{ marginBottom: 10, display: 'flex', marginRight: 20, marginLeft: 20}}>
        <Text style={styles.text}>Je sousigne, delcare avoir accepte les conditions generales de location, je certifie que les renseignement me concernant.</Text>
      </View>


    </Page>
  </Document>
);

export default PDFContrat;
