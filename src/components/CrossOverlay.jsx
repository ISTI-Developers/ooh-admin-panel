import { useEffect } from "react";
import PropTypes from "prop-types";

export default function AutoCrosses({ targetKeywords = ["TURNSTILE", "General", "Rectangle"] }) {
  useEffect(() => {
    const svgNS = "http://www.w3.org/2000/svg";

    // Draws an X across the given element
    function drawCross(el) {
      if (el.dataset.hasCross === "true") return; // avoid duplicates
      const bbox = el.getBBox?.();
      if (!bbox) return;

      const svg = el.ownerSVGElement;
      if (!svg) return;

      // Create group for cross lines
      const crossGroup = document.createElementNS(svgNS, "g");
      crossGroup.classList.add("auto-cross");
      crossGroup.setAttribute("pointer-events", "none");
      crossGroup.setAttribute("stroke", "#000");
      crossGroup.setAttribute("stroke-width", "3");

      // ✅ Apply same rotation/transform as element
      const transform = el.getAttribute("transform");
      if (transform) crossGroup.setAttribute("transform", transform);

      // Helper to create a line
      const makeLine = (x1, y1, x2, y2) => {
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        return line;
      };

      // Two diagonal lines
      const line1 = makeLine(bbox.x, bbox.y, bbox.x + bbox.width, bbox.y + bbox.height);
      const line2 = makeLine(bbox.x + bbox.width, bbox.y, bbox.x, bbox.y + bbox.height);
      crossGroup.append(line1, line2);

      // Append cross to same SVG root (so transform applies correctly)
      svg.appendChild(crossGroup);

      // Mark element so we don’t add again
      el.dataset.hasCross = "true";
    }

    // Finds which shapes should get crosses
    function applyCrosses() {
      // --- 1️⃣ All <rect> elements that are NOT inside a <g> ---
      const allRects = Array.from(document.querySelectorAll("rect"));
      const loneRects = allRects.filter((rect) => !rect.closest("g"));
      loneRects.forEach(drawCross);

      // --- 2️⃣ All <g> and <path> with matching keywords ---
      const allGroupsAndPaths = Array.from(document.querySelectorAll("g, path"));
      const matched = allGroupsAndPaths.filter((el) => {
        const id = (el.id || "").toLowerCase();
        const cls = el.className?.baseVal?.toLowerCase?.() || "";
        return targetKeywords.some((kw) => id.includes(kw.toLowerCase()) || cls.includes(kw.toLowerCase()));
      });
      matched.forEach(drawCross);
    }

    // Run after SVG render
    const timeout = setTimeout(applyCrosses, 100);

    // Cleanup on unmount
    return () => {
      clearTimeout(timeout);
      document.querySelectorAll(".auto-cross").forEach((el) => el.remove());
    };
  }, [targetKeywords]);

  return null;
}

AutoCrosses.propTypes = {
  targetKeywords: PropTypes.arrayOf(PropTypes.string),
};
