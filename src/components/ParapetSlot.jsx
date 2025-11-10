// Reusable slot
import PropTypes from "prop-types";

export const ParapetSlot = ({
  item,
  pos,
  onClick,
  sizeLarge = { width: 96, height: 20 },
  sizeSmall = { width: 96, height: 20 },
  radius = 6,
  colors = {
    normal: "#1D4ED8",
    hover: "#1E40AF",
    blocked: "#A3A3A3",
    disabled: "#525252",
    label: "white",
    cross: "white",
  },
  showBlockedCross = true,
  className,
}) => {
  const isLarge = item.asset_size === "LARGE";
  const isBlocked = item.asset_status === "BLOCKED";
  const isDisabled = item.asset_status === "TAKEN";

  const width = isLarge ? sizeLarge.width : sizeSmall.width;
  const height = isLarge ? sizeLarge.height : sizeSmall.height;

  const fill = isDisabled ? colors.disabled : isBlocked ? colors.blocked : colors.normal;
  const hoverFill = isDisabled || isBlocked ? fill : colors.hover;

  const centerX = pos.x + width / 2;
  const centerY = pos.y + height / 2;

  const label = isLarge
    ? "WALL"
    : item.brand
    ? item.brand.length > 15
      ? `${item.brand.slice(0, 15)}...`
      : item.brand
    : "Parapet";

  return (
    <g
      transform={`rotate(${pos.rotate ?? 0}, ${pos.x}, ${pos.y})`}
      cursor={isDisabled || isBlocked ? "not-allowed" : "pointer"}
      onClick={() => onClick && onClick(item)}
      className={className}
    >
      <rect
        x={pos.x}
        y={pos.y}
        rx={radius}
        ry={radius}
        width={width}
        height={height}
        fill={fill}
        stroke="none"
        className="transition-colors duration-200 hover:fill-[var(--hover)]"
        style={{ "--hover": hoverFill }}
      />

      {isBlocked && showBlockedCross && (
        <>
          <line x1={pos.x} y1={pos.y} x2={pos.x + width} y2={pos.y + height} stroke={colors.cross} strokeWidth="2" />
          <line x1={pos.x + width} y1={pos.y} x2={pos.x} y2={pos.y + height} stroke={colors.cross} strokeWidth="2" />
        </>
      )}

      {!isBlocked && (
        <text
          x={centerX}
          y={centerY + 4}
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontWeight="600"
          fontSize="14"
          fill={colors.label}
          pointerEvents="none"
        >
          {label}
        </text>
      )}
    </g>
  );
};

ParapetSlot.propTypes = {
  item: PropTypes.object.isRequired,
  pos: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    rotate: PropTypes.number,
  }).isRequired,
  onClick: PropTypes.func,
  sizeLarge: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  sizeSmall: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  radius: PropTypes.number,
  colors: PropTypes.shape({
    normal: PropTypes.string,
    hover: PropTypes.string,
    blocked: PropTypes.string,
    disabled: PropTypes.string,
    label: PropTypes.string,
    cross: PropTypes.string,
  }),
  showBlockedCross: PropTypes.bool,
  className: PropTypes.string,
};

// Reusable Backlit slot
export const BacklitSlot = ({
  item,
  pos,
  onClick,
  size = { width: 96.5, height: 25 },
  fontSize = 14,
  radius = 4,
  colors = {
    normal: "#4F46E5",
    hover: "#4338CA",
    disabled: "#525252",
    label: "white",
  },
  className,
}) => {
  const isDisabled = item.asset_status === "TAKEN";
  const brand = item.brand ? (item.brand.length > 15 ? `${item.brand.slice(0, 15)}...` : item.brand) : "Backlit";

  return (
    <g
      transform={`rotate(${pos.rotate || 0}, ${pos.x}, ${pos.y})`}
      cursor={isDisabled ? "not-allowed" : "pointer"}
      onClick={() => onClick && onClick(item)}
      className={className}
    >
      <rect
        x={pos.x}
        y={pos.y}
        rx={radius}
        ry={radius}
        width={size.width}
        height={size.height}
        fill={isDisabled ? colors.disabled : colors.normal}
        stroke="none"
      />
      {!isDisabled && (
        <rect
          x={pos.x}
          y={pos.y}
          rx={radius}
          ry={radius}
          width={size.width}
          height={size.height}
          fill={colors.hover}
          opacity="0"
          className="hover:opacity-100 transition-opacity duration-200"
        />
      )}
      <text
        x={pos.x + size.width / 2}
        y={pos.y + size.height * 0.68}
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontWeight="600"
        fontSize={fontSize}
        fill={colors.label}
        pointerEvents="none"
      >
        {brand}
      </text>
    </g>
  );
};
BacklitSlot.propTypes = {
  item: PropTypes.object.isRequired,
  pos: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    rotate: PropTypes.number,
  }).isRequired,
  onClick: PropTypes.func,
  size: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  fontSize: PropTypes.number,
  radius: PropTypes.number,
  colors: PropTypes.shape({
    normal: PropTypes.string,
    hover: PropTypes.string,
    disabled: PropTypes.string,
    label: PropTypes.string,
  }),
  className: PropTypes.string,
};
