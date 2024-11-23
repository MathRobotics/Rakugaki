export const SVG_NS = "http://www.w3.org/2000/svg";

export const universalColors = {
  blue: "#0072B2",  // 青
  orange: "#D55E00", // 橙
};

function downloadTrimmedSVG(svg) {
  const bbox = svg.getBBox();
  const clonedSvg = svg.cloneNode(true);
  clonedSvg.setAttribute("width", bbox.width);
  clonedSvg.setAttribute("height", bbox.height);
  clonedSvg.setAttribute("viewBox", `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);

  const serializer = new XMLSerializer();
  const svgBlob = new Blob([serializer.serializeToString(clonedSvg)], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svgBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "trimmed_drawing.svg";
  link.click();
  URL.revokeObjectURL(url);
}

function clearCanvas(svg) {
  svg.innerHTML = '';
}

export { downloadTrimmedSVG, clearCanvas };