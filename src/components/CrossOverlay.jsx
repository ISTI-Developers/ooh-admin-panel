import { useEffect } from "react";
import PropTypes from "prop-types";

export default function AutoCrosses({ targetKeywords = ["TURNSTILE", "General", "Rectangle"] }) {
  useEffect(() => {
    const svgNS = "http://www.w3.org/2000/svg";

    function drawCross(el) {
      if (!el || el.dataset.hasCross === "true") return;
      const bbox = el.getBBox?.();
      if (!bbox) return;

      const svg = el.ownerSVGElement;
      if (!svg) return;

      const crossGroup = document.createElementNS(svgNS, "g");
      crossGroup.classList.add("auto-cross");
      crossGroup.setAttribute("pointer-events", "none");
      crossGroup.setAttribute("stroke", "#000");
      crossGroup.setAttribute("stroke-width", "3");

      const transform = el.getAttribute("transform");
      if (transform) crossGroup.setAttribute("transform", transform);

      const makeLine = (x1, y1, x2, y2) => {
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        return line;
      };

      const line1 = makeLine(bbox.x, bbox.y, bbox.x + bbox.width, bbox.y + bbox.height);
      const line2 = makeLine(bbox.x + bbox.width, bbox.y, bbox.x, bbox.y + bbox.height);
      crossGroup.append(line1, line2);

      svg.appendChild(crossGroup);
      el.dataset.hasCross = "true";
    }

    function applyCrosses() {
      const allRects = Array.from(document.querySelectorAll("rect"));
      const loneRects = allRects.filter((rect) => !rect.closest("g"));
      loneRects.forEach(drawCross);

      const allGroupsAndPaths = Array.from(document.querySelectorAll("g, path"));
      const matched = allGroupsAndPaths.filter((el) => {
        const id = (el.id || "").toLowerCase();
        const cls = el.className?.baseVal?.toLowerCase?.() || "";
        return targetKeywords.some((kw) => id.includes(kw.toLowerCase()) || cls.includes(kw.toLowerCase()));
      });
      matched.forEach(drawCross);
    }

    let redrawTimeout;
    function debouncedApply() {
      clearTimeout(redrawTimeout);
      redrawTimeout = setTimeout(applyCrosses, 120);
    }

    const mainSvg = document.querySelector("svg");
    if (mainSvg) {
      applyCrosses(); // first run

      const observer = new MutationObserver(() => debouncedApply());
      observer.observe(mainSvg, { childList: true, subtree: true });

      return () => {
        clearTimeout(redrawTimeout);
        observer.disconnect();
      };
    }
  }, [targetKeywords]);

  return null;
}

AutoCrosses.propTypes = {
  targetKeywords: PropTypes.arrayOf(PropTypes.string),
};
