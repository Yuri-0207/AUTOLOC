"use client";

// components/SignUpForm.tsx
import { useState, useEffect} from "react";

import { TfiArrowCircleRight } from "react-icons/tfi";
import { CustomInput, CustomButton, Selector } from "@/components";
import { Country, State, City, ICountry, IState, ICity } from "country-state-city";
import "react-phone-input-2/lib/high-res.css";
import { ContactFormData, ContactFormProps } from "@/types";

const inputStyles = {
  valid: 'focus:outline-turquoise-500 focus:shadow-turquoise-500 focus:shadow-inner',
  invalid: 'focus:outline-red-400 focus:shadow-red-400 text-red-500',
}

const ContactForm: React.FC<ContactFormProps> = ({onContinue}) => {
  // ------------------- ADDRESS SELECTORS START ------------------------
  const countryData = Country.getAllCountries();
  const [stateData, setStateData] = useState<IState[]>([])
  const [cityData, setCityData] = useState<ICity[]>([])

  const [country, setCountry] = useState<ICountry>({} as ICountry);
  const [state, setState] = useState<IState>({} as IState);
  const [city, setCity] = useState<ICity>({} as ICity);

  const handleCountrySelect = (country: ICountry) => {
    setInputValidity((prevValidity) => ({
      ...prevValidity,
      pays: validateInput("pays", country.name)
    }))
    setCountry(country);
  };

  const handleStateSelect = (state: IState) => {
    setState(state);
  };

  const handleCitySelect = (city: ICity) => {
    setCity(city);
  };

  useEffect(() => {
    setStateData(State.getStatesOfCountry(country?.isoCode))
  }, [country?.isoCode])

  useEffect(() => {
      setCityData(City.getCitiesOfState(country?.isoCode, state?.isoCode));
  }, [country?.isoCode, state?.isoCode])
  

    useEffect(() => {
      setFormData((prevData) => ({
        ...prevData,
        pays: country?.name || '',
        ville: state?.name || '',
        commune: city?.name || '',
      }));
    }, [country, state, city])
  // ------------------- ADDRESS SELECTORS END ------------------------

  // ------------------- FORM VISIBILITY START ------------------------
  const [isFormVisible, setIsFromVisible] = useState(false);
  const toggleFormVisibility = () => {
    setIsFromVisible((prev) => !prev);
  }; // ------------------- FORM VISIBILITY END ------------------------
  
  const [formData, setFormData] = useState<ContactFormData>({
    pays: '',
    ville: '',
    commune: '',
    rue: '',
    numeroMaison: '',
    numeroTelephone: '',
    numeroTelephoneSecondaire: '',
  });
  const handleContinueButtonClick = () => {
    if(isFormValid() && isFormNotEmpty()) {
      onContinue(formData);
    } else {
      console.log("Form is not valid")
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let transformedValue = value;
    if(name === 'numeroTelephone' || name === 'numeroTelephoneSecondaire') {
      if(country && country.phonecode) {
        transformedValue = `+${country.phonecode}${value.startsWith('0') ? value.substring(1) : value}`;
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: transformedValue,
    }));

    const isValid = validateInput(name, value);

    setInputValidity((prevValidity) => ({
      ...prevValidity,
      [name]: isValid,
    }));
    
  };

  // ------------------- FORM VALIDITY START ------------------------

  const validateInput = (name: string, value: string): boolean => {
    if(name === "pays" || name === "ville" || name === "commune") {
      return !(value.trim() === '');
    }
    if(name === "rue") {
      return /^[a-zA-Z0-9À-ÿ\s]*$/.test(value);
    }
    if(name === "numeroMaison" || name === "numeroTelephone" || name === "numeroTelephoneSecondaire") {
      return /^\d*$/.test(value);
    }
    return true;
  }

  const isFormValid = () => {
    return Object.values(inputValidity).every((valid) => valid);
  };
  const isFormNotEmpty = () => {
    const attributes = Object.keys(formData).filter(attr => attr !== "numeroTelephoneSecondaire");
    return attributes.every(attr => (formData[attr as keyof ContactFormData] as string).trim() !== '');
  }

  const [inputValidity, setInputValidity] = useState({ 
      pays: true, ville: true, commune: true, rue: true, 
      numeroMaison: true, numeroTelephone: true, 
      numeroTelephoneSecondaire: true
    });

  // ------------------- FORM VALIDITY END  ------------------------

  const handleFormReset = () => {
    setFormData({
      pays: '',  ville: '',  commune: '',  rue: '',
      numeroMaison: '',  numeroTelephone: '',  numeroTelephoneSecondaire: '',
    });
    setInputValidity({
      pays: true,  ville: true,  commune: true,  rue: true,
      numeroMaison: true,  numeroTelephone: true,  numeroTelephoneSecondaire: true,
    });
    setCountry({} as ICountry); setState({} as IState); setCity({} as ICity);
  };

  return (
    <section
      className={`bg-mystic-100 shadow-lg shadow-mystic-400 rounded transition-all duration-200 mb-2
    border-t-4 border-casal-700`}
    >
      {/* -------------  CONTACT FORM TITLE  ------------- */}
      <div
        className="flex justify-between px-8 py-4"
        onClick={toggleFormVisibility}
      >
        <p className="font-semibold">Details du contact</p>
      </div>
      {/* -------------  CONTACT FORM BODY  ------------- */}
        <div className="max-w-2xl mx-auto mt-8 mb-4" onReset={handleFormReset}>
          {/* RESIDENCE COUNTRY INPUT */}
          <div>
            <Selector mb name="pays" data={countryData} selected={country} setSelected={handleCountrySelect}  label='Pays de residence*' />
            <div className="flex justify-between gap-4">
            <div className="w-1/2">
            <Selector mb name="ville" data={stateData} selected={state} setSelected={setState} onSelect={handleStateSelect} label='Ville*' />
            </div>
            <div className="w-1/2">
            <Selector mb name="commune" data={cityData} selected={city} setSelected={setCity} onSelect={handleCitySelect} label='Commune*' />
            </div>
            </div>
          </div>
          
          {/* ADDRESS INPUT */}
          <div className="flex justify-between gap-2 mb-4">
            {/* STREET INPUT */}
            <div className="mb-4 w-3/5">
              <CustomInput
                inputType="text"
                inputId="rue"
                inputName="rue"
                inputHolder="Colonel Lotfi"
                inputOnChange={handleChange}
                isRequired
                inputStyles={inputStyles}
                label="Rue*"
                isValid={inputValidity.rue}
                errorMessage="Inserer nom de rue valide"
              />
            </div>
            {/* HOUSE NUMBER INPUT */}
            <div className="mb-4 w-1/3">
              <label
                htmlFor="numeroMaison"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Numero*
              </label>
              <div className="flex justify-center items-center gap-2">
                <label htmlFor="numeroMaison" className="text-lg font-semibold">
                  N&deg;
                </label>
                <CustomInput inputType="text" inputId="numeroMaison" inputName="numeroMaison"
                  inputHolder="45" inputOnChange={handleChange} isRequired inputStyles={inputStyles}
                  isValid={inputValidity.numeroMaison} errorMessage="Seulement des chiffres"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between mb-4 gap-4">
          {/* PRINCIPAL PHONE NUMBER */}
          <div className="w-1/2">
          <CustomInput inputType='text' inputId='numTel' inputName='numeroTelephone' label="Numero Telephone*"
          inputHolder='540242655' isRequired inputStyles={inputStyles} inputOnChange={handleChange} max={10}
          isValid={inputValidity.numeroTelephone} errorMessage="Inserer numero valide"
          />
          </div>
          {/* SECONDARY PHONE NUMBER */}
          <div className="w-1/2">
          <CustomInput inputType='text' inputId='numTelSec' inputName='numeroTelephoneSecondaire' label="Numero Telephone secondaire"
          inputHolder='540242655' isRequired inputStyles={inputStyles} inputOnChange={handleChange} max={10}
          isValid={inputValidity.numeroTelephoneSecondaire} errorMessage="Inserer numero valide"
          />
          </div>
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

export default ContactForm;
