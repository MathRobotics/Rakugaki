import * as Mlink from './mlink.js';

// DOM要素を取得
const svg = document.getElementById("drawing-area");
const downloadButton = document.getElementById("download-svg");
const clearCanvasButton = document.getElementById("clear-canvas");

const createModelButton = document.getElementById("create-model");

const joint1Inputs = Mlink.initializeJointInputs("j1");
const joint2Inputs = Mlink.initializeJointInputs("j2");

const toggleButton = document.getElementById("additional-line");
let isAdditionalLineOn = false;
let isDragging = false;
let offsetX, offsetY, selectedElement;

toggleButton.addEventListener("click", () => {
  isAdditionalLineOn = !isAdditionalLineOn;
  toggleButton.classList.toggle("on", isAdditionalLineOn); // クラスをトグル
  toggleButton.textContent = isAdditionalLineOn ? "Additional Line On" : "Additional Line Off";

  triggerRedraw();
});

// **1. 再描画関数**
function triggerRedraw() {
  clearCanvasButton.click();
  createModelButton.click();
}

// **2. 入力リスナーをセットアップ**
function setupJointInputListeners(jointInputs) {
  Object.values(jointInputs).forEach((input) => {
    input.addEventListener("input", triggerRedraw);
  });

  jointInputs.axis.addEventListener("input", () => {
    jointInputs.axisValue.textContent = jointInputs.axis.value;
    triggerRedraw();
  });
}

setupJointInputListeners(joint1Inputs);
setupJointInputListeners(joint2Inputs);

// **2. ドラッグ機能を追加**
svg.addEventListener("mousedown", (event) => {
  if (event.target.classList.contains("draggable")) {
    isDragging = true;
    selectedElement = event.target;

    // オフセットを計算
    const cx = parseFloat(selectedElement.getAttribute("cx"));
    const cy = parseFloat(selectedElement.getAttribute("cy"));
    offsetX = event.clientX - cx;
    offsetY = event.clientY - cy;

    // カーソルを変更
    selectedElement.style.cursor = "grabbing";
  }
});

svg.addEventListener("mousemove", (event) => {
  if (isDragging && selectedElement) {
    // 新しい位置を計算
    const newX = event.clientX - offsetX;
    const newY = event.clientY - offsetY;

    // 要素の位置を更新
    selectedElement.setAttribute("cx", newX);
    selectedElement.setAttribute("cy", newY);
  }
});

svg.addEventListener("mouseup", () => {
  if (isDragging) {
    isDragging = false;
    if (selectedElement) {
      selectedElement.style.cursor = "grab";
      selectedElement = null;
    }
  }
});

svg.addEventListener("mouseleave", () => {
  if (isDragging) {
    isDragging = false;
    if (selectedElement) {
      selectedElement.style.cursor = "grab";
      selectedElement = null;
    }
  }
});

// モデルの描画
createModelButton.addEventListener("click", () => {
  const joint1Data = {
    cx: parseFloat(joint1Inputs.cx.value),
    cy: parseFloat(joint1Inputs.cy.value),
    radius: parseFloat(joint1Inputs.radius.value),
    axis: parseFloat(joint1Inputs.axis.value),
  };

  const joint2Data = {
    cx: parseFloat(joint2Inputs.cx.value),
    cy: parseFloat(joint2Inputs.cy.value),
    radius: parseFloat(joint2Inputs.radius.value),
    axis: parseFloat(joint2Inputs.axis.value),
  };

  if (Object.values(joint1Data).some(isNaN) || Object.values(joint2Data).some(isNaN)) {
    alert("Please enter valid values for all joints.");
    return;
  }

  // 曲線を描画
  Mlink.drawBody(svg, joint1Data, joint2Data, isAdditionalLineOn); 
});

// SVGをダウンロード
downloadButton.addEventListener("click", () => {
  // **1. バウンディングボックスを取得**
  const bbox = svg.getBBox();

  // **2. 新しいSVG要素を作成**
  const clonedSvg = svg.cloneNode(true);
  clonedSvg.setAttribute("width", bbox.width);
  clonedSvg.setAttribute("height", bbox.height);
  clonedSvg.setAttribute("viewBox", `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);

  // **3. SVGをシリアライズしてBlobを作成**
  const serializer = new XMLSerializer();
  const svgData = serializer.serializeToString(clonedSvg);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svgBlob);

  // **4. ダウンロードリンクを作成してクリック**
  const link = document.createElement("a");
  link.href = url;
  link.download = "trimmed_drawing.svg";
  link.click();

  // **5. メモリ解放**
  URL.revokeObjectURL(url);
});

// キャンバス全体を初期化
clearCanvasButton.addEventListener("click", () => {
  svg.innerHTML = ''; // SVG要素内のすべての子要素を削除
});