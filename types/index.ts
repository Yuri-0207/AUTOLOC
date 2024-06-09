import { IState } from "country-state-city";
import { MouseEventHandler } from "react";

export interface CustomInputProps {
  inputType: string,
  inputId: string,
  inputName: string,
  inputValue?: string,
  inputOnChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
  inputHolder?: string,
  isRequired?: boolean,
  inputStyles?: { valid: string; invalid: string },
  isChecked?: boolean,
  isDisabled?: boolean,
  label?: string,
  errorMessage?: string,
  isValid?: boolean,
  max?: number,
}

export interface CustomButtonProps {
  title: string;
  isDisabled?: boolean;
  isLastStep?: boolean;
  btnType?: "button" | "submit" | "reset";
  containerStyles?: string;
  textStyles?: string;
  rightIcon?: string;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
}

export interface SelectorProps {
  name: string;
  data: any[];
  mb?: boolean;
  selected: any;
  setSelected: (item: any) => void;
  onSelect?: (item: any) => void;
  label?: string;
  placeHolder?: string;
}

export interface DatePickerProps {
  inputId: string,
  inputName: string,
  inputValue?: string,
  inputOnChange?: (event: string) => void,
  inputHolder?: string,
  isRequired?: boolean,
  inputStyles?: string | string[],
  isChecked?: boolean,
  isDisabled?: boolean,
  min?: string;
  max?: string;
  label?: string;
  selected: any;
  setSelected: (item: any) => void;
  onSelect: (item: any) => void;
}

export interface UploaderProps {
  selected: any;
  setSelected: (item: any) => void;
  imagesSelect?: any;
  label?: string;
}

export interface ProfileFormData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  isOwner: boolean;
}

export interface ContactFormData {
  pays: string;
  ville: string;
  commune: string;
  rue: string;
  numeroMaison: string
  numeroTelephone: string;
  numeroTelephoneSecondaire: string;
}

export interface ProfileFormProps {
  onContinue: (formData: ProfileFormData) => void;
}

export interface ContactFormProps {
  onContinue: (formData: ContactFormData) => void;
}

export interface DrivingLicenceFormProps {
  onContinue: (formData: DrivingLicenceFormData) => void;
}

export interface DrivingLicenceFormData {
  paysEmetteur: string;
  dateNaissance: string;
  numeroPermis: string;
  dateEmission: string;
  dateExpiration: string;
  imagePermis: File | string | null;
}

export interface RegisterFormProps {
  onContinue: (formData: RegisterFormData) => void;
}

export interface RegisterFormData {
  nomAgence: string;
  numeroInscription: string;
  dateInscription: string;
  imageRegistre: File | string | null;

}
// --------------------------  USER FORM DATA --------------------------
export interface NormalUserFormData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role: "owner" | "user";

  pays: string;
  ville: string;
  commune: string;
  rue: string;
  numeroMaison: string
  numeroTelephone: string;
  numeroTelephoneSecondaire?: string;

  paysEmetteur: string;
  dateNaissance: string;
  numeroPermis: string;
  dateEmission: string;
  dateExpiration: string;
  imagePermis: File | string | null;
}
// --------------------------  OWNER FORM DATA --------------------------
export interface OwnerFormData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  role: "owner" | "user";

  pays: string;
  ville: string;
  commune: string;
  rue: string;
  numeroMaison: string
  numeroTelephone: string;
  numeroTelephoneSecondaire?: string;

  nomAgence: string;
  numeroInscription: string;
  dateInscription: string;
  imageRegistre: File | string | null;
}

export type UserFormData = NormalUserFormData | OwnerFormData;

export interface RangeFilterProps {
  heading?: string;
  large?: boolean;
}

export interface carCardProps {
  marque?: string;
  modele?: string;
  annee?: string;
  nmbrPlace?: string;
  carburant?: string;
  boiteVitesse?: string;
  imageVoiture?: string[] | string;
  killometrage?: string;
  prixParJour?: number;
  prixTotal?: number;
  onClick?: () => void;
}


export interface UpdateFormData {
  pays: string;
  ville: string;
  commune: string;
  rue: string;
  numeroMaison: string;
  numeroTelephone: string;
  numeroTelephoneSecondaire: string;
}


export interface Availability {
  startDate: string;
  endDate: string;
}


export interface CarFormData {
  idAgence: string;
  categorie: string;
  marque: string;
  modele: string;
  transition: string;
  place: string;
  immatricule: string;
  annee: string;
  willaya: string;
  carburant: string;
  killometrage: string;
  prixParJour: number;
  imagesVoiture: string[];
  availability: Availability[];
}

export interface CarProps extends CarFormData {
  uid: string;
}

export interface ReservationData {
  idAgence: string;
  idUser: string;
  idVoiture: string;
  startDate: string | undefined;
  endDate: string | undefined;
  conducteur: boolean;
  siege: boolean;
  livraison: boolean;
  carburant: boolean;
  prixTotal: number;
  etat: "Accepte" | "Refuse" | "En attente";
  contrat?: string;
}

export interface ReservedCarsData {
  numTel: string;
  numTelSec: string | undefined;
  nomAgence: string;
  marque: string;
  modele: string;
  startDate: string | undefined;
  endDate: string | undefined;
  prixTotal: number;
  imageVoiture: string;
  etat: "Accepte" | "Refuse" | "En attente";
  annee: string;
}

interface ReservationDataExt extends ReservationData {
  id: string;
}
export interface ReservationWithDetails {
  reservation: ReservationDataExt;
  car: CarFormData;
  user: NormalUserFormData;
}