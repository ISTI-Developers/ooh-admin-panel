import PropTypes from "prop-types";
import Skeleton from "./Skeleton";

function Loader({ height = "2rem" }) {
  return (
    <div className="rounded-md overflow-hidden" style={{ height: height }}>
      <Skeleton />
    </div>
  );
}

Loader.propTypes = {
  height: PropTypes.string,
};

export default Loader;
