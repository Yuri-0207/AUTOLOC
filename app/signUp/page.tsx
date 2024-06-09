'use client'

import React, { useState } from 'react';
import { db, uploadImage } from '@/firebase/firebase';
import { ProfileForm, ContactForm, DrivingLicenceForm, RegisterForm } from '@/components';
import { ProfileFormData, ContactFormData, DrivingLicenceFormData, NormalUserFormData, RegisterFormData, OwnerFormData } from '@/types';
import { ConfigProvider, Steps } from 'antd';
import { CgProfile } from "react-icons/cg";
import { RiContactsLine  } from "react-icons/ri";
import { FaRegAddressCard } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import { collection, doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { User, createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import useAuth from '@/utils/useAuth';

const USER_INITIAL_DATA: NormalUserFormData = {
  nom: '',  prenom: '',  email: '',  password: '',  pays: '',  ville: '',  commune: '',  rue: '', role: 'user',
  numeroMaison: '', numeroTelephone: '',  numeroTelephoneSecondaire: '',  paysEmetteur: '',  dateNaissance: '',
  numeroPermis: '', dateEmission: '',  dateExpiration: '',  imagePermis: null,
}
const OWNER_INITIAL_DATA: OwnerFormData = {
  nom: '',  prenom: '',  email: '',  password: '',  pays: '',  ville: '',  commune: '',  rue: '', role: "owner",
  numeroMaison: '', numeroTelephone: '',  numeroTelephoneSecondaire: '', nomAgence: '', 
  numeroInscription: '', dateInscription: '', imageRegistre: null,
}



const Page = () => {
  
  const [userData, setUserData] = useState<NormalUserFormData>(USER_INITIAL_DATA);
  const [ownerData, setOwnerData] = useState<OwnerFormData>(OWNER_INITIAL_DATA);
  const [isOwner, setIsOwner] = useState(false);
  const router = useRouter();
  const { login } = useAuth();


  const handleProfileContinue = (formData: ProfileFormData) => {
    setCurrent(1);
    setIsOwner(formData.isOwner);
    if (formData.isOwner) {
      setOwnerData((prevOwnerData) => ({
        ...prevOwnerData,
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        password: formData.password,
      }));
    } else {
      setUserData((prevUserData) => ({
        ...prevUserData,
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        password: formData.password,
      }));
    }
  }
  const handleContactContinue = (formData: ContactFormData) => {
    setCurrent(2);
    if(isOwner) {
      setOwnerData((prevOwnerData) => ({
        ...prevOwnerData,
        pays: formData.pays,
        ville: formData.ville,
        commune: formData.commune,
        rue: formData.rue,
        numeroMaison: formData.numeroMaison,
        numeroTelephone: formData.numeroTelephone,
        numeroTelephoneSecondaire: formData.numeroTelephoneSecondaire,
      }))
    } else {
      setUserData((prevUserData) => ({
        ...prevUserData,
        pays: formData.pays,
        ville: formData.ville,
        commune: formData.commune,
        rue: formData.rue,
        numeroMaison: formData.numeroMaison,
        numeroTelephone: formData.numeroTelephone,
        numeroTelephoneSecondaire: formData.numeroTelephoneSecondaire,
      }))
    }
  }
  const handleLicenceContinue = async (formData: DrivingLicenceFormData) => {
    setCurrent(3);
    let imageUrl = '';
    try {
      if(formData.imagePermis instanceof File){
        imageUrl = await uploadImage(formData.imagePermis, "/drivingLicences");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setUserData((prevUserData) => ({
      ...prevUserData,
      paysEmetteur: formData.paysEmetteur,
      dateNaissance: formData.dateNaissance,
      numeroPermis: formData.numeroPermis,
      dateEmission: formData.dateEmission,
      dateExpiration: formData.dateExpiration,
      imagePermis: imageUrl,
    }))
  }
  const handleRegisterContinue = async (formData: RegisterFormData) => {
    setCurrent(3);
    let imageUrl = '';
    try {
      if(formData.imageRegistre instanceof File){
        imageUrl = await uploadImage(formData.imageRegistre, "/tradeRegistry");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setOwnerData((prevOwnerData) => ({
      ...prevOwnerData,
      numeroInscription: formData.numeroInscription,
      dateInscription: formData.dateInscription,
      nomAgence: formData.nomAgence,
      imageRegistre: imageUrl,
    }))
  }

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const dataToSubmit = isOwner ? ownerData : userData;
    let user: User | null = null;
  
    try {
      if (dataToSubmit.email && dataToSubmit.password) {
        const auth = getAuth();
        const createUserResult = await createUserWithEmailAndPassword(auth, dataToSubmit.email, dataToSubmit.password);
        user = createUserResult.user;
        console.log("User added to authentication", user);
      }
  
      const collectionRef = isOwner ? collection(db, 'OwnerUser') : collection(db, 'NormalUser');
      const docRef = doc(collectionRef, user?.uid);
  
      await setDoc(docRef, dataToSubmit);
      console.log('User data stored in Firestore:', dataToSubmit);

      await login(dataToSubmit.email, dataToSubmit.password);
      console.log('User logged in');

      setUserData(USER_INITIAL_DATA);
      setOwnerData(OWNER_INITIAL_DATA);
  
      router.push("/");
    } catch (error) {
      console.error('Error creating user or storing data:', error);
    }
  };

  const [current, setCurrent] = useState(0);

  const steps = [
    {  content: <ProfileForm onContinue={handleProfileContinue} /> },
    {  content: <ContactForm onContinue={handleContactContinue} /> },
    {  content: isOwner ? <RegisterForm onContinue={handleRegisterContinue} />
                      : <DrivingLicenceForm onContinue={handleLicenceContinue} /> },
    { content:
      <section className='bg-mystic-100 shadow-lg shadow-mystic-400 rounded transition-all duration-200 mb-2
      border-t-4 border-casal-700'>
        <div className='flex justify-between px-8 py-4'>
          <p className='font-semibold'>Confirmer vos Donnees</p>
        </div>
        <div className="max-w-4xl mx-auto mt-8 mb-4 relative">
          <div className='flex flex-col gap-3 mb-6'>
            <p className='text-xl text-casal-700 font-medium'>Informations de Profile</p>
            <div className='grid grid-cols-2 gap-4'>
              <p>Nom: {isOwner ? ownerData.nom : userData.nom}</p>
              <p>Prenom: {isOwner ? ownerData.prenom : userData.prenom}</p>
              <p>Email: {isOwner ? ownerData.email : userData.email}</p>
              <p>Password: {isOwner ? ownerData.password : userData.password}</p>
            </div>
          </div>
          <div className='flex flex-col gap-3 mb-6'>
            <p className='text-xl text-casal-700 font-medium'>Informations de Contact</p>
            <div className='grid grid-cols-2 gap-4'>
              <p>Pays: {isOwner ? ownerData.pays : userData.pays}</p>
              <p>Ville: {isOwner ? ownerData.ville : userData.ville}</p>
              <p>Commune: {isOwner ? ownerData.commune : userData.commune}</p>
              <p>Rue: {isOwner ? ownerData.rue : userData.rue}</p>
              <p>Numero Maison: Nº {isOwner ? ownerData.numeroMaison : userData.numeroMaison}</p>
              <p>Numeros Telephone: {isOwner ? ownerData.numeroTelephone 
                                            : userData.numeroTelephone} 
                                  /{isOwner ? ownerData.numeroTelephoneSecondaire 
                                            : userData.numeroTelephoneSecondaire}</p>
            </div>
          </div>
          <div className='flex flex-col gap-3 mb-6'>
            <p className='text-xl text-casal-700 font-medium'>Informations de {isOwner ? <span>Registre</span> : <span>Permis</span> }</p>
            <div className='grid grid-cols-2 gap-4'>
              {isOwner ? <p>Nom de l&apos;Agence: {ownerData.nomAgence}</p> 
                      : <p>Pays Emetteur: {userData.paysEmetteur}</p> }
              {isOwner ? <p>Numero du Registre: {ownerData.numeroInscription}</p> 
                      : <p>Date Naissance: {userData.dateNaissance}</p> }
              {isOwner ? <p>Date d&apos;Inscription: {ownerData.dateInscription}</p> 
                      : <p>Numero Permis: {userData.numeroPermis}</p> }
              {isOwner ? "" 
                      : <p>Date Emission: {userData.dateEmission}</p> }
              {isOwner ? "" 
                      : <p>Date Expiration: {userData.dateExpiration}</p> }
            </div>
          </div>
          <div className='w-full flex justify-end'>
          <button type='button' onClick={handleFinalSubmit}
          className="font-medium bg-casal-700 text-white py-2 px-8 rounded-full hover:bg-flamingo-600 transition-colors duration-200"
          >s&apos;Inscrire</button>
          </div>
        </div>
      </section> },
  ]

  
  return (
    <section className='w-5/6 mx-auto flex flex-col gap-2 text-mystic-900'>
      <div className=' mt-28 mb-4'>
        <h1 className='text-2xl font-bold'>Creer votre AUTOLOC Compte</h1>
        <p className='text-sm'>Et facilitez vos opérations de location</p>
      </div>
      <ConfigProvider theme={{ token: { colorPrimary: "#178087" }, components:{ Steps: { iconFontSize: 20,}} }}>
        <Steps className='font-semibold'
          type='navigation'
          onChange={setCurrent}
          current={current}
        >
          <Steps.Step title="Details du Profile" icon={<CgProfile />} />
          <Steps.Step title="Details du Contact" icon={<RiContactsLine />} />
          <Steps.Step title={isOwner ? "Details du Registre" : "Details du Permis"} icon={<FaRegAddressCard />} />
          <Steps.Step title="Confirmation" icon={<GiConfirmed />} />
        </Steps>
      </ConfigProvider>
      {steps[current].content}
    </section>
  )
}

export default Page

//  ########################################  THE VERSION WITH NO CLIENT SIDE ########################################  //

// import ProfilePageClient from "./ProfilePageClient";

// const page = () => {
  
//   return (
//     <div>
//       <ProfilePageClient />
//     </div>
//   )
// }

// export default page

