import * as Mlink from './mlink.js';
import * as Utils from './utils.js';

function createModel(svg, joint1Inputs, joint2Inputs, isAdditionalLineOn){
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
}

export function initializeEvents(svg, 
  joint1Inputs, joint2Inputs,
  createModelButton, clearCanvasButton, downloadButton) {
  let isAdditionalLineOn = false;

  // **再描画関数**
  function triggerRedraw() {
    Utils.clearCanvas(svg);
    createModel(svg, joint1Inputs, joint2Inputs, isAdditionalLineOn);
  }

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

  // モデルの描画
  createModelButton.addEventListener("click", () => {
    createModel(svg, joint1Inputs, joint2Inputs, isAdditionalLineOn);
  });

  // キャンバス全体を初期化
  clearCanvasButton.addEventListener("click", () => {
    Utils.clearCanvas(svg);
  });

  // SVGをダウンロード
  downloadButton.addEventListener("click", () => {
    Utils.downloadTrimmedSVG(svg);
  });
}
