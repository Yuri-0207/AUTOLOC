'use client';

// components/SignUpForm.tsx
import { useEffect, useState } from 'react';

import { CustomButton, CustomInput, DatePicker, Selector, Uploader } from '@/components';
import { DrivingLicenceFormProps, DrivingLicenceFormData } from '@/types';
import { Country, ICountry } from 'country-state-city';
import { TfiArrowCircleRight } from 'react-icons/tfi';

const inputStyles = {
  valid: 'focus:outline-turquoise-500 focus:shadow-turquoise-500 focus:shadow-inner',
  invalid: 'focus:outline-red-400 focus:shadow-red-400 text-red-500',
}

const DrivingLicenceForm: React.FC<DrivingLicenceFormProps> = ({ onContinue }) => {

  

// ##############################  PAYS EMETTEUR  ##############################
  const countryData = Country.getAllCountries();
  const [country, setCountry] = useState<ICountry>(countryData[3] as ICountry);
  const handleCountrySelect = (country: ICountry) => {
    setCountry(country);
  };

// ##############################  DATE NAISSANCE  ##############################
  const [dateNaissance, setDateNaissance] = useState<string>('')
  const handleBirthdaySelect = (dateNaissance: string) => {
    setDateNaissance(dateNaissance);
  };
  const [dateEmission, setDateEmission] = useState<string>('')
  const handleEmissionSelect = (dateEmission: string) => {
    setDateEmission(dateEmission);
  };
  const [dateExpiration, setDateExpiration] = useState<string>('')
  const handleExpirationSelect = (dateExpiration: string) => {
    setDateExpiration(dateExpiration);
  };
  
  const [images, setImages] = useState<File>();

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      paysEmetteur: country?.name || '',
      dateNaissance: dateNaissance || '',
      dateEmission: dateEmission || '',
      dateExpiration: dateExpiration || '',
      imagePermis: images || '',
    }));
  }, [dateNaissance, country, dateEmission, dateExpiration, images])



  const [isFormVisible, setIsFromVisible] = useState(false);
  const toggleFormVisibility = () => {
    setIsFromVisible((prev) => !prev);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    const isValid = validateInput(name, value);

    setInputValidity((prevValidity) => ({
      ...prevValidity,
      [name]: isValid,
    }));
  };

  const [formData, setFormData] = useState<DrivingLicenceFormData>({
    paysEmetteur: '',
    dateNaissance: '',
    numeroPermis: '',
    dateEmission: '',
    dateExpiration: '',
    imagePermis: null,
  });
  const handleContinueButtonClick = () => {
    if(isFormValid() && isFormNotEmpty()) {
      onContinue(formData);
    } else {
      console.log("Form is not valid")
    }
  };

  const validateInput = (name: string, value: string): boolean => {
    if(name === "numeroPermis") {
      return /^[a-zA-Z0-9\s]*$/.test(value);
    }
    return true;
  }

  const isFormValid = () => {
    return Object.values(inputValidity).every((valid) => valid);
  };
  const isFormNotEmpty = () => {
    const emptyValues = Object.values(formData).filter(value => typeof value === 'string' && value.trim() === '');
    return emptyValues.length === 0;
  }

  const [inputValidity, setInputValidity] = useState({ 
    paysEmetteur: true, dateNaissance: true, numeroPermis: true, 
    dateEmission: true, dateExpiration: true, imagePermis: true
  });

  const handleFormReset = () => {
    setFormData({
      paysEmetteur: '', dateNaissance: '', numeroPermis: '', 
      dateEmission: '', dateExpiration: '', imagePermis: null
    });
    setInputValidity({
      paysEmetteur: true, dateNaissance: true, numeroPermis: true, 
      dateEmission: true, dateExpiration: true, imagePermis: true
    });
  };
// #################################################################################################################################################



// #################################################################################################################################################
  return (
    <section className={`bg-mystic-100 shadow-lg shadow-mystic-400 rounded transition-all duration-200 mb-4
    border-t-4 border-casal-700`}>
      {/* -------------  LICENCE FORM TITLE  ------------- */}
      <div className='flex justify-between px-8 py-4' onClick={toggleFormVisibility}>
        <p className='font-semibold'>Details du permis de conduire</p>
      </div>
      {/* -------------  LICENCE FORM BODY  ------------- */}
      <div className="max-w-2xl mx-auto mt-8 mb-4" onReset={handleFormReset}>
      {/* -------------  PAYS EMETTEUR START  ------------- */}
        <Selector mb name='paysEmetteur' data={countryData} selected={country} setSelected={setCountry} onSelect={handleCountrySelect} label='Pays emetteur*' />
      {/* -------------  PAYS EMETTEUR END  ------------- */}

      {/* -------------  DATE NAISSANCE START  ------------- */}
        <div className="mb-4 w-1/2">
        <DatePicker 
        selected={dateNaissance}
        setSelected={setDateNaissance}
        onSelect={handleBirthdaySelect}
        inputId="dateNaissance"
        inputName="dateNaissance"
        inputHolder='mm-jj-aaaa'
        isRequired
        inputStyles='w-full border rounded-md p-2 transition-all duration-200 focus:outline-turquoise-500 
        focus:shadow-turquoise-500 focus:shadow-inner'
        min='01-01-2000'
        max={new Date().toISOString().split('T')[0]}
        label='Date de Naissacne(MM/JJ/AAAA)*'
        />
      </div>
      {/* -------------  DATE NAISSANCE END  ------------- */}

      {/* -------------  NUMERO PERMIS START  ------------- */}
      <div className="mb-4 w-3/5">
        <CustomInput
          inputType="text"
          inputId="numeroPermis"
          inputName="numeroPermis"
          inputHolder="A02956938"
          inputOnChange={handleChange}
          isRequired
          inputStyles={inputStyles}
          label="Numero de permis de conduire*"
          isValid={inputValidity.numeroPermis}
          errorMessage='Il ne doit pas contenir des caracteres speciaux'
        />
        </div>
      {/* -------------  NUMERO PERMIS END  ------------- */}

      {/* -------------  DATE EMISSION START  ------------- */}
      <div className='flex flex-row justify-between items-center gap-4'>
      <div className="mb-4 w-1/2">
        <DatePicker 
        selected={dateEmission}
        setSelected={setDateEmission}
        onSelect={handleEmissionSelect}
        inputId="dateEmission"
        inputName="dateEmission"
        inputHolder='mm-jj-aaaa'
        isRequired
        inputStyles='w-full border rounded-md p-2 transition-all duration-200 focus:outline-turquoise-500 
        focus:shadow-turquoise-500 focus:shadow-inner'
        min='01-01-2000'
        max={new Date().toISOString().split('T')[0]}
        label="Date d'emission (MM/JJ/AAAA)*"
        />
      </div>
      {/* -------------  DATE EMISSION END  ------------- */}
        {/* -------------  DATE EXPIRATION START  ------------- */}
      <div className="mb-4 w-1/2">
        <DatePicker 
        selected={dateExpiration}
        setSelected={setDateExpiration}
        onSelect={handleExpirationSelect}
        inputId="dateExpiration"
        inputName="dateExpiration"
        inputHolder='mm-jj-aaaa'
        isRequired
        inputStyles='w-full border rounded-md p-2 transition-all duration-200 focus:outline-turquoise-500 
        focus:shadow-turquoise-500 focus:shadow-inner'
        min='01-01-2000'
        label="Date d'expiration (MM/JJ/AAAA)*"
        />
      </div>
      </div>
      {/* -------------  DATE EXPIRATION END  ------------- */}


      {/* -------------  IMAGE PERMIS START  ------------- */}
      <div>
        <Uploader 
        selected={images} 
        setSelected={setImages}
        label='Image de Permis de conduire*'
        />
      </div>
      {/* -------------  IMAGE PERMIS END  ------------- */}

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

export default DrivingLicenceForm;
