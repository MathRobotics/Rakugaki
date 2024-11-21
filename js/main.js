import { drawBody } from './mlink.js'

// DOM要素を取得
const svg = document.getElementById("drawing-area");
const downloadButton = document.getElementById("download-svg");
const clearCanvasButton = document.getElementById("clear-canvas");

const createModelButton = document.getElementById("create-model");

const joint1CxInput = document.getElementById("j1-cx-input");
const joint1CyInput = document.getElementById("j1-cy-input");
const joint1RadiusInput = document.getElementById("j1-radius-input");
const joint1AxisInput = document.getElementById("j1-axis-input");
const joint1AxisValue = document.getElementById("j1-axis-value");

const joint2CxInput = document.getElementById("j2-cx-input");
const joint2CyInput = document.getElementById("j2-cy-input");
const joint2RadiusInput = document.getElementById("j2-radius-input");
const joint2AxisInput = document.getElementById("j2-axis-input");
const joint2AxisValue = document.getElementById("j2-axis-value");

const toggleButton = document.getElementById("additional-line");
let isAdditionalLineOn = false;

toggleButton.addEventListener("click", () => {
  isAdditionalLineOn = !isAdditionalLineOn;
  toggleButton.classList.toggle("on", isAdditionalLineOn); // クラスをトグル
  toggleButton.textContent = isAdditionalLineOn ? "Additional Line On" : "Additional Line Off";

  // 再描画（必要に応じて）
  clearCanvasButton.click(); // キャンバスをクリア
  createModelButton.click(); // 再描画
});

// 傾きスライダーの値をリアルタイムで表示
joint1AxisInput.addEventListener("input", () => {
  joint1AxisValue.textContent = joint1AxisInput.value;
});

joint2AxisInput.addEventListener("input", () => {
  joint2AxisValue.textContent = joint2AxisInput.value;
});

// モデルの描画
createModelButton.addEventListener("click", () => {
  const j1_cx = parseFloat(joint1CxInput.value); 
  const j1_cy = parseFloat(joint1CyInput.value); 
  const j1_radius = parseFloat(joint1RadiusInput.value); 
  const j1_axis = parseFloat(joint1AxisInput.value);  

  const j2_cx = parseFloat(joint2CxInput.value); 
  const j2_cy = parseFloat(joint2CyInput.value); 
  const j2_radius = parseFloat(joint2RadiusInput.value); 
  const j2_axis = parseFloat(joint2AxisInput.value);  

  // 入力値が有効か確認
  if (
    isNaN(j1_cx) || isNaN(j1_cy) || isNaN(j1_radius) ||
    isNaN(j2_cx) || isNaN(j2_cy) || isNaN(j2_radius)
  ) {
    alert("Please enter valid values for all joints.");
    return;
  }

  const joint1Data = {
    cx: j1_cx,
    cy: j1_cy,
    axis: j1_axis,
    radius: j1_radius
  }

  const joint2Data = {
    cx: j2_cx,
    cy: j2_cy,
    axis: j2_axis,
    radius: j2_radius
  }

  // 曲線を描画
  drawBody(svg, joint1Data, joint2Data, isAdditionalLineOn); 
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

// キャンバス全体を初期化
clearCanvasButton.addEventListener("click", () => {
  svg.innerHTML = ''; // SVG要素内のすべての子要素を削除
});