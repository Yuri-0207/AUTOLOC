// DatePicker.tsx
'use client';

import React from 'react';
import { DatePickerProps } from '@/types';

const inputFocus =
  'focus:outline-turquoise-500 focus:shadow-turquoise-500 focus:shadow-inner';
const inputDisabled =
  'disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none';
const inputInvalid =
  'focus:invalid:outline-red-400 focus:invalid:shadow-red-400 invalid:text-red-500';
const inputClassName = `w-full border rounded-md p-2 transition-all duration-200 ${inputFocus} ${inputDisabled}`;

const DatePicker: React.FC<DatePickerProps> = ({selected, setSelected, onSelect, inputId, inputName, 
  inputOnChange, inputHolder, isRequired, isChecked, isDisabled, inputStyles, min, max, label}: DatePickerProps) => {

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedDate = event.target.value;
      setSelected(selectedDate);
      if (inputOnChange) {
        inputOnChange(selectedDate);
      }
    };

  return (
    <div className='mb-4'>
    <label htmlFor={inputId} className="block text-mystic-900 text-sm font-bold mb-4">{label}</label>
      <input
        type='date'
        id={inputId}
        name={inputName}
        placeholder={inputHolder}
        value={selected}
        onChange={handleDateChange}
        onSelect={onSelect}
        className= {Array.isArray(inputStyles) ? inputStyles.join(' ') : inputStyles}
        required={isRequired}
        checked={isChecked}
        disabled={isDisabled}
        min={min}
        max={max}
      />
    </div>
  );
};

export default DatePicker;
