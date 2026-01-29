import { useState, useEffect, useRef } from "react";

export default function ZoomableSVG({ children }) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    const handleCtrlZoom = (e) => {
      if (e.ctrlKey) e.preventDefault();
    };
    window.addEventListener("wheel", handleCtrlZoom, { passive: false });
    return () => window.removeEventListener("wheel", handleCtrlZoom);
  }, []);

  // Center SVG initially
  useEffect(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    if (container && svg) {
      const containerRect = container.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();

      const initialX = (containerRect.width - svgRect.width) / 2;
      const initialY = (containerRect.height - svgRect.height) / 2;

      setPos({ x: initialX, y: initialY });
    }
  }, [children]);

  const handleWheel = (e) => {
    if (!containerRef.current.contains(e.target)) return;
    if (e.ctrlKey) {
      e.preventDefault();
      const zoomSpeed = 0.1;
      setScale((prev) =>
        e.deltaY < 0 ? Math.min(prev + zoomSpeed, 5) : Math.max(prev - zoomSpeed, 0.3)
      );
    }
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    setOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseUp = () => setDragging(false);

  const handleSliderChange = (e) => setScale(parseFloat(e.target.value));

  const handleReset = () => {
    setScale(1);
    if (containerRef.current && svgRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const svgRect = svgRef.current.getBoundingClientRect();
      setPos({
        x: (containerRect.width - svgRect.width) / 2,
        y: (containerRect.height - svgRect.height) / 2,
      });
    } else {
      setPos({ x: 0, y: 0 });
    }
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative w-full overflow-hidden border border-gray-300 select-none"
    >
      {/* Fixed Zoom Bar (top-right) */}
      <div
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className="absolute z-20 right-4 top-4 flex items-center gap-3 bg-white/90 rounded-full shadow-md px-4 py-2 backdrop-blur-sm border border-gray-200"
      >
        <button
          onClick={() => setScale((s) => Math.max(s - 0.1, 0.3))}
          className="text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:scale-90 transition"
        >
          −
        </button>

        <input
          type="range"
          min="0.3"
          max="5"
          step="0.05"
          value={scale}
          onChange={handleSliderChange}
          onMouseDown={() => setIsSliding(true)}
          onMouseUp={() => setIsSliding(false)}
          className="w-40 accent-gray-700 cursor-pointer"
        />

        <button
          onClick={() => setScale((s) => Math.min(s + 0.1, 5))}
          className="text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:scale-90 transition"
        >
          +
        </button>

        <button
          onClick={handleReset}
          className="text-sm font-medium px-3 py-2 rounded-full bg-blue-100 hover:bg-blue-200 active:scale-95 transition"
        >
          Reset
        </button>
      </div>

      {/* === SVG Canvas === */}
      <div
        ref={svgRef}
        onMouseDown={handleMouseDown}
        className={`transition-transform duration-150 ease-out ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
          transformOrigin: "0 0",
          transition: isSliding ? "none" : "transform 0.15s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
}
