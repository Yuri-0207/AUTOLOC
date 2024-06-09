import { CustomButtonProps } from "@/types";

const Button = ({ isDisabled, btnType, containerStyles, textStyles, title, rightIcon: RightIcon, handleClick, isLastStep }: CustomButtonProps) => (
  <button
    disabled={isDisabled}
    type= { isLastStep ? "submit" : btnType || "button"}
    className={`custom-btn ${containerStyles}`}
    onClick={handleClick}
  >
    <span className={`flex-1 ${textStyles}`}>{title}</span>
    {RightIcon && !isLastStep && (
        <RightIcon />
    )}
  </button>
);

export default Button;