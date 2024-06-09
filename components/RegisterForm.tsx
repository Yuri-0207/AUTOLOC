'use client';

// components/SignUpForm.tsx
import { useEffect, useState } from 'react';

import { CustomButton, CustomInput, DatePicker, Selector, Uploader } from '@/components';
import { RegisterFormData, RegisterFormProps } from '@/types';
import { TfiArrowCircleRight } from 'react-icons/tfi';

const inputStyles = {
  valid: 'focus:outline-turquoise-500 focus:shadow-turquoise-500 focus:shadow-inner',
  invalid: 'focus:outline-red-400 focus:shadow-red-400 text-red-500',
}


const RegisterForm: React.FC<RegisterFormProps> = ({ onContinue }) => {

  
// ##############################  DATE INSCRIPTION  ##############################
  const [dateInscription, setDateInscription] = useState<string>('')
  const handleInscriptionSelect = (dateInscription: string) => {
    setDateInscription(dateInscription);
  };
// ##############################  IMAGE REGISTRE COMMERCE  ##############################
  const [images, setImages] = useState<string>();

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      dateInscription: dateInscription || '',
      imageRegistre: images || '',
    }));
  }, [dateInscription, images])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    const isValid = validateInput(name, value);
    setInputValidity((prevValidity) => ({
      ...prevValidity,
      [name]: isValid,
    }))
  };

  const [formData, setFormData] = useState<RegisterFormData>({
    nomAgence: '',
    numeroInscription: '',
    dateInscription: '',
    imageRegistre: '',
  });

  const isFormNotEmpty = () => {
    const emptyValues = Object.values(formData).filter(value => typeof value === 'string' && value.trim() === '');
    return emptyValues.length === 0;
  }
  
  const [inputValidity, setInputValidity] = useState({ nomAgence: true, numeroInscription: true });
  const isFormValid = () => {
    return Object.values(inputValidity).every((valid) => valid);
  }
  const validateInput = (name: string, value: string): boolean => {
    if(name === "numeroInscription" || name === "nomAgence") {
      return /^[a-zA-Z0-9\s]*$/.test(value);
    }
    return true;
  }
  
  const handleContinueButtonClick = () => {
    if(isFormValid() && isFormNotEmpty()) {
      onContinue(formData);
    } else {
      console.log("Form is not valid");
    }
  };

  // #################################################################################################################################################



// #################################################################################################################################################
  return (
    <section className={`bg-mystic-100 shadow-lg shadow-mystic-400 rounded transition-all duration-200 mb-4
    border-t-4 border-casal-700`}>
      {/* -------------  LICENCE FORM TITLE  ------------- */}
      <div className='flex justify-between px-8 py-4'>
        <p className='font-semibold'>Details du registre commerce</p>
      </div>
      {/* -------------  LICENCE FORM BODY  ------------- */}
      <div className="max-w-2xl mx-auto mt-8 mb-4">
      {/* -------------  NOM AGENCE START  ------------- */}
      <div className='mb-4'>
        <CustomInput 
          inputType='text' 
          inputId='nomAgence' 
          inputName='nomAgence' 
          label="Nom de l'Agence*"
          isRequired 
          isValid={inputValidity.nomAgence}
          inputStyles={inputStyles} 
          inputOnChange={handleChange}
        />
      </div>
      {/* -------------  NOM AGENCE END  ------------- */}

      {/* -------------  NUMERO INSCRIPTION START  ------------- */}
      <div className='mb-4'>
        <CustomInput 
        inputType='text' 
        inputId='numeroInscription' 
        inputName='numeroInscription' 
        label="Numero d'Inscription du Registre commerce*"
        isRequired 
        inputStyles={inputStyles}
        isValid={inputValidity.numeroInscription}
        inputOnChange={handleChange}
        errorMessage='Il ne doit pas contenir des caracteres speciaux'
        />
      </div>
      {/* -------------  NUMERO INSCRIPTION END  ------------- */}

      {/* -------------  DATE INSCRIPTION START  ------------- */}
      <div className="mb-4 w-3/5">
        <DatePicker 
        selected={dateInscription}
        setSelected={setDateInscription}
        onSelect={handleInscriptionSelect}
        inputId="dateInscription"
        inputName="dateInscription"
        inputHolder='mm-jj-aaaa'
        isRequired
        inputStyles='w-full border rounded-md p-2 transition-all duration-200 focus:outline-turquoise-500 
        focus:shadow-turquoise-500 focus:shadow-inner'
        min='01-01-2000'
        max={new Date().toISOString().split('T')[0]}
        label="Date d'inscription (MM/JJ/AAAA)*"
        />
      </div>
      {/* -------------  DATE INSCRIPTION END  ------------- */}

      {/* -------------  IMAGE REGISTRE START  ------------- */}
      <div>
        <Uploader 
        selected={images} 
        setSelected={setImages}
        label='Image de Registre Commerce*'
        />
      </div>
      {/* -------------  IMAGE REGISTRE END  ------------- */}

      {/* SUBMIT BUTTON */}
      <div className="mb-4 flex justify-end mt-8 gap-2">
        <CustomButton title='Remmetre' btnType='reset'
        containerStyles='font-medium border-2 border-casal-700 text-casal-700 py-2 px-8 rounded-full hover:bg-casal-100
        focus:outline-none transition-colors duration-200 flex items-center gap-2' />
        <button
          type="button"
          className=" font-medium bg-casal-700 text-white py-2 px-8 rounded-full hover:bg-flamingo-600
            focus:outline-none transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-default"
          onClick={handleContinueButtonClick} disabled={!isFormValid()}
        >
          Continuer
          <TfiArrowCircleRight />
        </button>
      </div>
    </div>
    </section>
  );
};

export default RegisterForm;
