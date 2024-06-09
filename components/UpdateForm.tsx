'use client';

import { useState } from 'react';
import { CustomButton, CustomInput } from '@/components';
import { OwnerFormData, UpdateFormData } from '@/types';
import { useUser } from '@/contexts/UserContext';
import { doc, updateDoc } from '@firebase/firestore';
import { db } from '@/firebase/firebase';

const inputStyles = {
  valid: 'focus:outline-turquoise-500 focus:shadow-turquoise-500 focus:shadow-inner',
  invalid: 'focus:outline-red-400 focus:shadow-red-400 text-red-500',
};

const UpdateForm = () => {
  const { user } = useUser();
  const isOwner = user?.data.role === "owner";

  const [updateData, setUpdateData] = useState<UpdateFormData>({
    pays: user?.data.pays || '', 
    ville: user?.data.ville || '', 
    commune: user?.data.commune || '', 
    rue: user?.data.rue || '', 
    numeroMaison: user?.data.numeroMaison || '', 
    numeroTelephone: user?.data.numeroTelephone || '', 
    numeroTelephoneSecondaire: user?.data.numeroTelephoneSecondaire || '', 
  })


  const [inputValidity, setInputValidity] = useState({
    pays: true, 
    ville: true, 
    commune: true, 
    rue: true, 
    numeroMaison: true, 
    numeroTelephone: true, 
    numeroTelephoneSecondaire: true, 
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdateData((prevData) => ({
      ...prevData,
      [name]: value,
    }))

    const isValid = validateInput(name, value);

    setInputValidity((prevValidity) => ({
      ...prevValidity,
      [name]: isValid,
    }));
  };

  const validateInput = (name: string, value: string): boolean => {
    if (name === 'numeroMaison') {
      return /^\d*$/.test(value);
    }
    if (name === 'numeroTelephone' || name === 'numeroTelephoneSecondaire') {
      return /^(?:\+|\d{1,2})?\d+$/.test(value);
    }
    if (name === 'numeroPermis') {
      return /^[a-zA-Z0-9\s]*$/.test(value);
    }
    return true;
  };

  const isFormValid = () => {
    return Object.values(inputValidity).every((valid) => valid);
  };

  const isFormNotEmpty = () => {
    const dataEmptyValues = Object.values(updateData).filter(
      (value) => typeof value === "string" && value.trim() === '' && value !== updateData.numeroTelephoneSecondaire
    )
    return (
      dataEmptyValues.length === 0
    );
  };

  const handleUpdateClick = async () => {
    if (isFormValid() && isFormNotEmpty()) {
      if (user?.uid) {
        const collectionName = isOwner ? 'OwnerUser' : 'NormalUser';
        const userDocRef = doc(db, collectionName, user?.uid);

        try {
          await updateDoc(userDocRef, {
            pays: updateData.pays,
            ville: updateData.ville,
            commune: updateData.commune,
            rue: updateData.rue,
            numeroMaison: updateData.numeroMaison,
            numeroTelephone: updateData.numeroTelephone,
            numeroTelephoneSecondaire: updateData.numeroTelephoneSecondaire,
          });
          console.log("Data updated successfully", updateData);
        } catch (error) {
          console.error("Error updating data: ", error);
        }
      } else {
        console.error("User ID is undefined")
      }
    } else {
      console.log('Form is not valid');
    }
  };


  return (
      <form className="max-w-2xl mx-auto mt-8 mb-4 grid grid-cols-2 gap-6" onSubmit={handleUpdateClick} >
        <div className='flex flex-col gap-1'>
          {isOwner ? <p className='font-bold'>Agence</p> : <p className='font-bold'>Nom</p>}
          {isOwner ? <p className=' text-lg'>{user.data?.nomAgence}</p> : <p className=' text-lg'>{user?.data.nom}</p>}
        </div>
        <div className='flex flex-col gap-1'>
          {isOwner ? <p className='font-bold'></p> : <p className='font-bold'>Prenom</p>}
          {isOwner ? <p className='font-bold'></p> : <p className='text-lg'>{user?.data.prenom}</p>}
        </div>
        <div>
          <CustomInput 
            inputId='pays' 
            inputType='text'
            inputStyles={inputStyles}
            label="Pays"
            inputName="pays"
            isValid={inputValidity.pays}
            inputValue={updateData.pays}
            inputOnChange={handleChange}
          />
        </div>
        <div>
          <CustomInput 
            inputId='ville' 
            inputType='text'
            inputStyles={inputStyles}
            label="Ville"
            inputName="ville"
            isValid={inputValidity.ville}
            inputValue={updateData.ville}
            inputOnChange={handleChange}
          />
        </div>
        <div>
          <CustomInput 
            inputId='commune' 
            inputType='text'
            inputStyles={inputStyles}
            label="Commune"
            inputName="commune"
            isValid={inputValidity.commune}
            inputValue={updateData.commune}
            inputOnChange={handleChange}
          />
        </div>
        <div>
          <CustomInput 
            inputId='rue' 
            inputType='text'
            inputStyles={inputStyles}
            label="Rue"
            inputName="rue"
            isValid={inputValidity.rue}
            inputValue={updateData.rue}
            inputOnChange={handleChange}
          />
        </div>
        <div>
          <CustomInput
            inputId="numeroMaison"
            inputType='text'
            inputStyles={inputStyles}
            label="Numero Maison"
            inputName="numeroMaison"
            isValid={inputValidity.numeroMaison}
            inputValue={updateData.numeroMaison}
            inputOnChange={handleChange}
          />
        </div>
        <div>
          <CustomInput
            inputId="numeroTelephone"
            inputType='text'
            inputStyles={inputStyles}
            label="Numero Telephone"
            inputName="numeroTelephone"
            isValid={inputValidity.numeroTelephone}
            inputValue={updateData.numeroTelephone}
            inputOnChange={handleChange}
          />
        </div>
        <div>
          <CustomInput
            inputId="numeroTelephoneSecondaire"
            inputType='text'
            inputStyles={inputStyles}
            label="Numero Telephone Secondaire"
            inputName="numeroTelephoneSecondaire"
            isValid={inputValidity.numeroTelephoneSecondaire}
            inputValue={updateData.numeroTelephoneSecondaire}
            inputOnChange={handleChange}
          />
        </div>
        <div className="flex justify-center mt-6">
          <button
          onClick={handleUpdateClick}
          type='button'
          className='font-medium border-2 border-casal-700 text-casal-700 hover:text-white py-2 px-8 rounded-full 
          hover:bg-casal-700 hover:outline-none transition-colors duration-200'
          >Mettre a jour vos Infos</button>
        </div>
      </form>
  );
};

export default UpdateForm;
