// DOM要素を取得
const svg = document.getElementById("drawing-area");
const addCircleButton = document.getElementById("add-circle");
const addRectangleButton = document.getElementById("add-rectangle");
const radiusInput = document.getElementById("radius-input");
const updateRadiusButton = document.getElementById("update-radius");
const downloadButton = document.getElementById("download-svg");

// SVGの命名空間
const SVG_NS = "http://www.w3.org/2000/svg";

// 図形の選択
let selectedElement = null;

// 図形をドラッグするためのイベント
function enableDrag(element) {
  let offsetX, offsetY;

  element.addEventListener("mousedown", (event) => {
    selectedElement = element;
    offsetX = event.offsetX - parseFloat(element.getAttribute("x") || element.getAttribute("cx"));
    offsetY = event.offsetY - parseFloat(element.getAttribute("y") || element.getAttribute("cy"));
  });

  svg.addEventListener("mousemove", (event) => {
    if (selectedElement) {
      if (selectedElement.tagName === "rect") {
        selectedElement.setAttribute("x", event.offsetX - offsetX);
        selectedElement.setAttribute("y", event.offsetY - offsetY);
      } else if (selectedElement.tagName === "circle") {
        selectedElement.setAttribute("cx", event.offsetX - offsetX);
        selectedElement.setAttribute("cy", event.offsetY - offsetY);
      }
    }
  });

  svg.addEventListener("mouseup", () => {
    selectedElement = null;
  });
}

// 円を追加
addCircleButton.addEventListener("click", () => {
  const circle = document.createElementNS(SVG_NS, "circle");
  circle.setAttribute("cx", "100");
  circle.setAttribute("cy", "100");
  circle.setAttribute("r", "30");
  circle.setAttribute("fill", "blue");
  svg.appendChild(circle);
  enableDrag(circle);
  selectElement(circle);
});

// 円を選択して編集可能にする
function selectElement(element) {
  selectedElement = element;
  if (selectedElement && selectedElement.tagName === "circle") {
    const radius = selectedElement.getAttribute("r");
    radiusInput.value = radius; // 現在の半径を入力欄に表示
  }
}

// 半径を更新
updateRadiusButton.addEventListener("click", () => {
  if (selectedElement && selectedElement.tagName === "circle") {
    const newRadius = parseFloat(radiusInput.value);
    if (!isNaN(newRadius) && newRadius > 0) {
      selectedElement.setAttribute("r", newRadius.toString());
    } else {
      alert("Please enter a valid radius.");
    }
  } else {
    alert("Select a circle to update its radius.");
  }
});

// 矩形を追加
addRectangleButton.addEventListener("click", () => {
  const rect = document.createElementNS(SVG_NS, "rect");
  rect.setAttribute("x", "150");
  rect.setAttribute("y", "150");
  rect.setAttribute("width", "100");
  rect.setAttribute("height", "50");
  rect.setAttribute("fill", "green");
  svg.appendChild(rect);
  enableDrag(rect);
});

// SVGをダウンロード
downloadButton.addEventListener("click", () => {
  const serializer = new XMLSerializer();
  const svgBlob = new Blob([serializer.serializeToString(svg)], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svgBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "drawing.svg";
  link.click();

  URL.revokeObjectURL(url);
});
