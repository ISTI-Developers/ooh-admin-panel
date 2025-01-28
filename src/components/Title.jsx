import PropTypes from "prop-types";

function Title({
  children,
  className = "flex items-center gap-2 font-semibold text-lg text-main-300",
}) {
  return <h2 className={className}>{children}</h2>;
}

Title.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Title;
