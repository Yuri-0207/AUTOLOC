'use client';

import { useState } from 'react';
import { CustomButton, CustomInput } from '@/components';
import { BiHide, BiShowAlt } from 'react-icons/bi';
import { TfiArrowCircleRight } from 'react-icons/tfi';
import { ProfileFormProps,ProfileFormData } from '@/types';

const ProfileForm: React.FC<ProfileFormProps> = ({onContinue}) => {

  const inputStyles = {
    valid: 'focus:outline-turquoise-500 focus:shadow-turquoise-500 focus:shadow-inner',
    invalid: 'focus:outline-red-400 focus:shadow-red-400 text-red-500',
  }

  const [formData, setFormData] = useState<ProfileFormData>({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    isOwner: false,
  });
  
  const [passValid, setPassValid] = useState({min: true, special: true, num: true});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value, type, checked } = e.target;

  if(name === "password") {
    setPassValid((prevValid) => ({
      ...prevValid,
      min: value.length >= 8,
      special: /[!@#$%^&*]/.test(value),
      num: /[0-9]/.test(value),
    }))
  }

  setFormData((prevData) => ({
    ...prevData,
    [name]: type === 'checkbox' ? checked : value,
  }));
  
  const isValid = validateInput(name, value);

  setInputValidity((prevValidity) => ({
    ...prevValidity,
    [name]: isValid,
  }));
};

  const validateInput = (name: string, value: string): boolean => {
    if(name === "nom" || name === "prenom") {
      return /^[a-zA-ZÀ-ÿ\s]*$/.test(value);
    }
    if(name === "email") {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    if(name === "password") {
      return value.length >= 8 && /[0-9]/.test(value) && /[!@#$%^&*]/.test(value);
    }
    if(name === "passwordConfirmation") {
      setInputValidity((e) => ({ ...e, password: value === formData.password}))
      return value === formData.password;
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
  const [inputValidity, setInputValidity] = useState({ nom: true, prenom: true, email: true, password: true, passwordConfirmation: true});

  const handleContinueButtonClick = () => {
    if(isFormValid() && isFormNotEmpty()) {
      onContinue(formData);
    } else {
      console.log("Form is not valid");
    }
  };

  // ---------------------   SHOW / HIDE PASSWORD    ----------------------
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleFormReset = () => {
    setFormData({
      nom: '',  prenom: '',  email: '',  password: '', isOwner: false
    });
    setInputValidity({
      nom: true,  prenom: true,  email: true,  password: true, passwordConfirmation: true
    });
    setPassValid({ min: true, special: true, num: true })
  };

  return (
    <section className={`bg-mystic-100 shadow-lg shadow-mystic-400 rounded transition-all duration-200 mb-2
    border-t-4 border-casal-700`}>
      {/* -------------  PROFILE FORM TITLE  ------------- */}
      <div className='flex justify-between px-8 py-4'>
        <p className='font-semibold'>Details du Profile</p>
      </div>
      {/* -------------  PROFILE FORM BODY  ------------- */}
      <div className="max-w-2xl mx-auto mt-8 mb-4" onReset={handleFormReset}>
        <div className='flex flex-row justify-between'>
        {/* NAME INPUT */}
          <div className="mb-4 w-5/12">
            <CustomInput 
            inputType='text' 
            inputId='nom' 
            inputName='nom' 
            label='Nom*' 
            inputStyles={inputStyles} 
            isValid={inputValidity.nom}
            inputHolder='nom' 
            inputOnChange={handleChange} 
            isRequired 
            errorMessage='seulement les caracteres'
            />
          </div>
        {/* PRENOM INPUT */}
          <div className="mb-4 w-5/12">
            <CustomInput 
            inputType='text' 
            inputId='prenom' 
            inputName='prenom' 
            label='Prenom*' 
            inputStyles={inputStyles} 
            isValid={inputValidity.prenom}
            inputHolder='prenom' 
            inputOnChange={handleChange} 
            isRequired 
            errorMessage='seulement les caracteres'
            />
          </div>
        </div>
      {/* EMAIL INPUT */}
      <div className="mb-4">
        <CustomInput 
        inputType='email' 
        inputId='email' 
        inputName='email' 
        label='Email*' 
        isValid={inputValidity.email}
        inputHolder='example@email.com' 
        inputOnChange={handleChange} 
        isRequired 
        inputStyles={inputStyles}
        />
      </div>
      {/* ---------   PASSWORD HANDLING   --------- */}
      <div className='flex flex-row justify-between items-center'>
        <div className='w-1/2'>
            {/* PASSWORD INPUT */}
          <div className="mb-4 relative">
              <CustomInput 
              inputType={showPassword ? 'text' : 'password'} 
              inputId='password' 
              inputName='password' 
              label='Mot de passe*'
              inputHolder='********' 
              inputOnChange={handleChange} 
              isRequired 
              inputStyles={inputStyles} 
              isValid={inputValidity.password}
              />
              <button type='button' onClick={togglePasswordVisibility}
              className="absolute bottom-[5px] right-0 p-2 flex items-center hover:text-turquoise-500 focus:outline-none text-mystic-900"
              >
              {showPassword ? (<BiShowAlt />) : (<BiHide />)}
              </button>
          </div>
          {/* PASSWORD CONFIRMATION INPUT */}
          <div className="mb-4 relative">
              <CustomInput 
              inputType={showPassword ? 'text' : 'password'} 
              inputId='passwordConfirmation' 
              inputName='passwordConfirmation'
              inputHolder='********' 
              inputOnChange={handleChange} 
              isRequired 
              inputStyles={inputStyles} 
              isValid={inputValidity.passwordConfirmation}
              label='Confirmer le mot de passe*'
              />
              <button type='button' onClick={togglePasswordVisibility}
              className="absolute bottom-[5px] right-0 p-2 flex items-center hover:text-turquoise-500 focus:outline-none text-mystic-900"
              >
              {showPassword ? (<BiShowAlt />) : (<BiHide />)}
              </button>
          </div>
        </div>
        <div className='text-sm flex flex-col gap-4 pr-8'>
          <p className={passValid.min ? 'text-casal-600' : 'text-red-500 font-semibold'}>Minimum 8 caracteres</p>
          <p className={passValid.special ? 'text-casal-600' : 'text-red-500 font-semibold'}>Caractere special [!@#$%^&*]</p>
          <p className={passValid.num ? 'text-casal-600' : 'text-red-500 font-semibold'}>Chiffre (numero)</p>
        </div>
      </div>
      {/* CHACKBOX INPUT */}
      <div className="my-6 flex flex-row gap-4 items-center">
        <input type='checkbox' id='isRentalAgencyOwner' name='isRentalAgencyOwner'
        className='form-checkbox text-turquoise-500 h-4 w-4 appearance-none
        bg-mystic-100 border-[3px] rounded-sm border-mystic-100 outline outline-casal-900 checked:bg-casal-900 checked:outline-casal-900
        transition-color duration-200 '
        onChange={(e) => setFormData((prevData) => ({ ...prevData, isOwner: e.target.checked}))}
        />
        <label htmlFor='isRentalAgencyOwner' className="text-md font-medium">Propriétaire d&apos;un bureau de location ?</label>
      </div>
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

export default ProfileForm;
