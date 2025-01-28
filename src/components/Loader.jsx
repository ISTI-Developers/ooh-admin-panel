import PropTypes from "prop-types";

function Loader({ height = "2rem" }) {
  return (
    <div className="rounded-md overflow-hidden" style={{ height: height }}>
      <div className="w-full min-h-full bg-slate-300 animate-pulse" />;
    </div>
  );
}

Loader.propTypes = {
  height: PropTypes.string,
};

export default Loader;
