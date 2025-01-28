import { MdKeyboardArrowLeft } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

function NavigateBack({ to }) {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    //regex testing if the url has edit in it
    const isEditing = /edit/.test(location.pathname);
    if (isEditing) {
      navigate(-1); // Navigates back to the previous location
    } else {
      navigate(to);
    }
  };

  return (
    <button
      onClick={goBack}
      className="text-xs xl:text-sm underline flex items-center w-fit"
    >
      <MdKeyboardArrowLeft />
      Back
    </button>
  );
}

export default NavigateBack;
