import { CustomInputProps } from "@/types";


const CustomInput: React.FC<CustomInputProps> = ({ inputType, inputId, inputName, inputValue, inputOnChange
  , inputHolder, isRequired, isChecked, isDisabled, inputStyles = {valid: '', invalid: ''}
  , label, isValid, errorMessage, max}: CustomInputProps) => {

  const inputClassName = `w-full border rounded-md p-2 transition-all duration-200
  ${isValid ? inputStyles.valid : inputStyles.invalid}`
  

  return (
    <div>
      { label &&
      <label htmlFor={inputId} className="block text-mystic-900 text-sm font-bold mb-2">{label}</label>
      }
      <input
        type={inputType}
        id={inputId}
        name={inputName}
        placeholder={inputHolder}
        value={inputValue}
        onChange={inputOnChange}
        className= {inputClassName}
        required={isRequired}
        checked={isChecked}
        disabled={isDisabled}
        max={max}
      />
      {!isValid ? <p className="text-red-500 text-sm text-end">{errorMessage}</p> : ''}
    </div>
  )
}

export default CustomInput
