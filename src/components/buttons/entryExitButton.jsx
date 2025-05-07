import PropTypes from "prop-types";
const EntryExitButton = ({ className, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-black h-[92px] w-[168px] text-white font-bold ${className}`}
    >
      ENTRY/EXIT
    </button>
  );
};
EntryExitButton.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
};
export default EntryExitButton;
