import { universalColors } from './utils.js'

import { drawCircle, drawPoint, drawPoints, drawLine, drawBezierCurve, drawCatmullRomSpline, drawPartialCircle} from './draw.js';
import { getParallelControlPoints, filterOutsidePoints, filterOutsideSegments} from './geometry.js';

// モデルパラメータ
const mLink = {
  control_length: 100, // リンクの曲線におけるコントロールポイントと始点，終点との距離
  joint_body_width: 15, // jointの円とbodyの円の距離
  link_body_width_raito: 0.9, // linkの幅
  body_curve_param : 0.5 
};

function drawBody(svg, startJoint, endJoint, isAdditionalLineOn, controlDistance = mLink.control_length) { 
 // 始点の制御点を計算
  const control1X = startJoint.cx + Math.cos(startJoint.axis) * controlDistance;
  const control1Y = startJoint.cy - Math.sin(startJoint.axis) * controlDistance;

  // 終点の制御点を計算
  const control2X = endJoint.cx + Math.cos(endJoint.axis) * controlDistance;
  const control2Y = endJoint.cy - Math.sin(endJoint.axis) * controlDistance;

  const P0 = [startJoint.cx, startJoint.cy];
  const P1 = [control1X, control1Y];
  const P2 = [control2X, control2Y];
  const P3 = [endJoint.cx, endJoint.cy];
  const points = [P0, P1, P2, P3]

  // jointを描画
  drawCircle(svg, startJoint.cx, startJoint.cy, startJoint.radius, universalColors.blue);
  drawCircle(svg, endJoint.cx, endJoint.cy, endJoint.radius, universalColors.blue);

  if(isAdditionalLineOn){
    drawBezierCurve(svg, points);

    drawPoint(svg, startJoint.cx, startJoint.cy);
    drawPoint(svg, endJoint.cx, endJoint.cy);

    drawPoint(svg, control1X, control1Y, universalColors.orange);
    drawPoint(svg, control2X, control2Y, universalColors.orange);

    drawLine(svg, startJoint.cx, startJoint.cy, control1X, control1Y);
    drawLine(svg, endJoint.cx, endJoint.cy, control2X, control2Y);
  }

  const startBodyJoint = {
    cx: startJoint.cx,
    cy: startJoint.cy,
    radius: startJoint.radius+mLink.joint_body_width
  }

  const endBodyJoint = {
    cx: endJoint.cx,
    cy: endJoint.cy,
    radius: endJoint.radius+mLink.joint_body_width
  }

  const parallelPoints1 = getParallelControlPoints(points, startJoint.radius*mLink.link_body_width_raito, endJoint.radius*mLink.link_body_width_raito);
  const curvePoints1 = filterOutsideSegments(filterOutsideSegments(parallelPoints1, startBodyJoint), endBodyJoint);
  drawCatmullRomSpline(svg, curvePoints1, mLink.body_curve_param, universalColors.blue);

  const parallelPoints2 = getParallelControlPoints(points, -startJoint.radius*mLink.link_body_width_raito, -endJoint.radius*mLink.link_body_width_raito);
  const curvePoints2 = filterOutsideSegments(filterOutsideSegments(parallelPoints2, startBodyJoint), endBodyJoint);
  drawCatmullRomSpline(svg, curvePoints2, mLink.body_curve_param, universalColors.blue);

  // joint周りのbodyを描画
  const start_curve1 = curvePoints1.at(0)
  const start_curve2 = curvePoints2.at(0)

  const end_curve1 = curvePoints1.at(-1)
  const end_curve2 = curvePoints2.at(-1)

  drawPartialCircle(svg, startJoint.cx, startJoint.cy, startJoint.radius+mLink.joint_body_width,
                    start_curve1, start_curve2, universalColors.blue);


  drawPartialCircle(svg, endJoint.cx, endJoint.cy, endJoint.radius+mLink.joint_body_width,
                    end_curve1, end_curve2, universalColors.blue);
}

export { drawBody, initializeJointInputs, setupInputListeners };