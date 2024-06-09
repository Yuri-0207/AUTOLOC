import { CarFormData, CarProps } from "@/types";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);

export const convertCarFormDataToCarProps = (car: CarFormData, uid: string): CarProps => ({
  ...car,
  uid,
});

export const convertCarPropsToCarFormData = (car: CarProps): CarFormData => {
  const { uid, ...carFormData } = car;
  return carFormData;
};

export const capitalizeFirstLetter = (str: string | undefined | null): string => {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

export const calculateNombreJours = (startDate: string | undefined, endDate: string | undefined) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const days = end.diff(start, 'day') + 1;
  return days;
}

export const calculatePrixTotal = (car: CarFormData | undefined, startDate: string | undefined, endDate: string | undefined) => {
  if (!car) {
    throw new Error("Car data is required");
  }

  const days = calculateNombreJours(startDate, endDate);
  return days * car.prixParJour;
};

export const isCarAvailable = (car: CarFormData, startDate: string | undefined, endDate: string | undefined) => {
  const selectedStartDate = dayjs(startDate);
  const selectedEndDate = dayjs(endDate);

  return car.availability.every(({ startDate, endDate }) => {
    const carStartDate = dayjs(startDate);
    const carEndDate = dayjs(endDate);

    return !(
      (selectedStartDate.isBetween(carStartDate, carEndDate, null, '[]')) ||
      (selectedEndDate.isBetween(carStartDate, carEndDate, null, '[]')) ||
      (carStartDate.isBetween(selectedStartDate, selectedEndDate, null, '[]')) ||
      (carEndDate.isBetween(selectedStartDate, selectedEndDate, null, '[]'))
    );
  })
}
