import * as Mlink from './mlink.js';
import { initializeEvents } from './event.js'; 

// DOM要素を取得
const svg = document.getElementById("drawing-area");
const downloadButton = document.getElementById("download-svg");
const clearCanvasButton = document.getElementById("clear-canvas");

const createModelButton = document.getElementById("create-model");

const joint1Inputs = Mlink.initializeJointInputs("j1");
const joint2Inputs = Mlink.initializeJointInputs("j2");

const toggleButton = document.getElementById("additional-line");
let isDragging = false;
let offsetX, offsetY, selectedElement;


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

initializeEvents(svg, 
  joint1Inputs, joint2Inputs,
  createModelButton, clearCanvasButton, downloadButton);

