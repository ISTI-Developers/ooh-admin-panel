import PropTypes from "prop-types";
import { IoArrowForwardSharp, IoArrowBackSharp, IoArrowDownSharp, IoArrowUpSharp } from "react-icons/io5";

export const ParapetBookButton = ({
  onClick,
  text,
  className,
  isDisabled,
  isBlocked,
  isLargeParapet,
  widthLabel,
  heightLabel,
}) => {
  return (
    <div className="flex items-stretch">
      <div className="flex flex-col">
        {widthLabel && (
          <div className="flex justify-between items-center">
            <IoArrowBackSharp />
            <span className="text-black font-bold text-xs">{widthLabel}</span>
            <IoArrowForwardSharp />
          </div>
        )}

        {/* Button */}
        <button
          onClick={onClick}
          className={`
          ${isDisabled ? "bg-gray-500 hover:bg-gray-600 cursor-not-allowed" : ""} 
          ${isBlocked ? "bg-custom-gray cursor-not-allowed" : "bg-blue-700 hover:bg-blue-800"} 
          ${isLargeParapet ? "h-[5.75rem] w-[7rem]" : "h-[2.875rem] min-w-[3.3rem]"}
          relative overflow-hidden text-white font-bold ${className}`}
        >
          {isBlocked && (
            <>
              <div className="absolute inset-0 before:content-[''] before:absolute before:w-[2px] before:h-[300%] before:bg-white before:rotate-65 before:top-[-100%] before:left-1/2 before:translate-x-[-50%]" />
              <div className="absolute inset-0 after:content-[''] after:absolute after:w-[2px] after:h-[300%] after:bg-white after:-rotate-65 after:top-[-100%] after:left-1/2 after:translate-x-[-50%]" />
            </>
          )}
          {text}
        </button>
      </div>

      {heightLabel && (
        <div className="flex flex-col justify-between items-center">
          <IoArrowUpSharp />
          <span className="text-black font-bold text-xs transform rotate-90">{heightLabel}</span>
          <IoArrowDownSharp />
        </div>
      )}
    </div>
  );
};

ParapetBookButton.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string,
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
  isBlocked: PropTypes.bool,
  isLargeParapet: PropTypes.bool,
  isPending: PropTypes.bool,
  isSelected: PropTypes.bool,
  widthLabel: PropTypes.string,
  heightLabel: PropTypes.string,
};

export const BacklitBookButton = ({ onClick, text, className, isDisabled }) => {
  const baseClasses = "h-[3.125rem] w-[12.0625rem] text-white font-bold rounded";
  const enabledClasses = "bg-pink-700 hover:bg-pink-800";
  const disabledClasses = "bg-gray-500 hover:bg-gray-600 cursor-not-allowed";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isDisabled ? disabledClasses : enabledClasses} ${className}`}
    >
      {text}
    </button>
  );
};
BacklitBookButton.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string,
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
  isSelected: PropTypes.bool,
};
export const EntryExitButton = ({ className, onClick }) => {
  return (
    <button onClick={onClick} className={`bg-black h-[92px] w-[126px] text-white font-bold ${className}`}>
      ENTRY/EXIT
    </button>
  );
};
EntryExitButton.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
};
