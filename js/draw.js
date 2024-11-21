import { SVG_NS } from './utils.js'

// 描画用の関数
/**
 * SVGに円を追加する関数
 * @param {number} cx - 円の中心X座標
 * @param {number} cy - 円の中心Y座標
 * @param {number} radius - 円の半径
 * @param {string} strokeColor - 円のストロークの色
 */
export function drawCircle(svg, cx, cy, radius, strokeColor = 'black') {
  const circle = document.createElementNS(SVG_NS, "circle");
  circle.setAttribute("cx", cx.toString());
  circle.setAttribute("cy", cy.toString());
  circle.setAttribute("r", radius.toString());
  circle.setAttribute("fill", "none");
  circle.setAttribute("stroke", strokeColor);
  circle.setAttribute("stroke-width", "3");
  svg.appendChild(circle);
}

/**
 * SVGに点を追加する関数
 * @param {number} cx - 点のX座標
 * @param {number} cy - 点のY座標
 */
export function drawPoint(svg, cx, cy, point_color = 'black') {
  const point = document.createElementNS(SVG_NS, "circle");
  point.setAttribute("cx", cx.toString());
  point.setAttribute("cy", cy.toString());
  point.setAttribute("r", "3");
  point.setAttribute("fill", "none");
  point.setAttribute("stroke", point_color);
  point.setAttribute("stroke-width", "1");
  svg.appendChild(point);
}

// 点を描画する関数（補助表示）
export function drawPoints(svg, points) {
  points.forEach(([x, y]) => {
    const point = document.createElementNS(SVG_NS, "circle");
    point.setAttribute("cx", x);
    point.setAttribute("cy", y);
    point.setAttribute("r", 2);
    point.setAttribute("fill", "red");
    svg.appendChild(point);
  });
}

/**
 * SVGにLineを追加する関数
 * @param {number} start_x
 * @param {number} start_y
 * @param {number} end_x
 * @param {number} end_y
 */
export function drawLine(svg, start_x, start_y, end_x, end_y, line_color = 'black') {
  const point = document.createElementNS(SVG_NS, "line");
  point.setAttribute("x1", start_x.toString());
  point.setAttribute("y1", start_y.toString());
  point.setAttribute("x2", end_x.toString());
  point.setAttribute("y2", end_y.toString());
  point.setAttribute("stroke", line_color);
  point.setAttribute("stroke-width", "1");
  svg.appendChild(point);
}

// ベジェ曲線を描画する関数
export function drawBezierCurve(svg, controlPoints, line_color = "black") {
  const [P0, P1, P2, P3] = controlPoints;
  const pathData = `
    M ${P0[0]} ${P0[1]}
    C ${P1[0]} ${P1[1]}, ${P2[0]} ${P2[1]}, ${P3[0]} ${P3[1]}
  `;
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", pathData);
  path.setAttribute("stroke", line_color);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke-width", "1");
  svg.appendChild(path);
}

// Catmull-Romスプラインで曲線を描画する関数
export function drawCatmullRomSpline(svg, points, tension = 0.5, line_color = 'black') {
  if (points.length < 2) return; // 点が2つ未満の場合は描画しない

  let pathData = `M ${points[0][0]} ${points[0][1]}`; // 開始点

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i]; // 前の点（最初の点の場合は自身）
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || points[i + 1]; // 次の次の点（最後の点の場合は自身）

    // 制御点を計算
    const cp1x = p1[0] + (p2[0] - p0[0]) * tension / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) * tension / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) * tension / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) * tension / 6;

    // 曲線セグメントを追加
    pathData += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`;
  }

  // SVGにパスを描画
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", pathData);
  path.setAttribute("stroke", line_color);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke-width", "3");
  svg.appendChild(path);
}

// 円を部分的に描画
export function drawPartialCircle(svg, cx, cy, r, start, end, color = "black") {
  const startAngle = Math.atan2(start[1] - cy, start[0] - cx);
  const endAngle = Math.atan2(end[1] - cy, end[0] - cx);

  const largeArcFlag = startAngle - endAngle <= Math.PI ? 1 : 0;

  const pathData = `
    M ${start[0]} ${start[1]}
    A ${r} ${r} 0 1 ${largeArcFlag} ${end[0]} ${end[1]}
  `;

  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", pathData);
  path.setAttribute("stroke", color);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke-width", "3");
  svg.appendChild(path);
}