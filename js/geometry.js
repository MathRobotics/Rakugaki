// ベジェ曲線上の点を計算
function getBezierPoint(controlPoints, t) {
  const [P0, P1, P2, P3] = controlPoints;
  const x =
    (1 - t) ** 3 * P0[0] +
    3 * (1 - t) ** 2 * t * P1[0] +
    3 * (1 - t) * t ** 2 * P2[0] +
    t ** 3 * P3[0];
  const y =
    (1 - t) ** 3 * P0[1] +
    3 * (1 - t) ** 2 * t * P1[1] +
    3 * (1 - t) * t ** 2 * P2[1] +
    t ** 3 * P3[1];
  return [x, y];
}

// ベジェ曲線上の接線ベクトルを計算する関数
function getTangentVector(controlPoints, t) {
  const [P0, P1, P2, P3] = controlPoints;
  const dx = 3 * (1 - t) ** 2 * (P1[0] - P0[0]) +
             6 * (1 - t) * t * (P2[0] - P1[0]) +
             3 * t ** 2 * (P3[0] - P2[0]);
  const dy = 3 * (1 - t) ** 2 * (P1[1] - P0[1]) +
             6 * (1 - t) * t * (P2[1] - P1[1]) +
             3 * t ** 2 * (P3[1] - P2[1]);
  return [dx, dy];
}

// 法線ベクトルを計算して制御点をオフセットする
export function getParallelControlPoints(controlPoints, offsetStart, offsetEnd, steps = 100) {
  const parallelPoints = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // ベジェ曲線上の点を計算
    const [px, py] = getBezierPoint(controlPoints, t);
    // 接線ベクトルを計算
    const [dx, dy] = getTangentVector(controlPoints, t);
    const length = Math.sqrt(dx ** 2 + dy ** 2);
    const normal = [-dy / length, dx / length]; // 法線ベクトル
    // 線形補間でオフセットを計算
    const offset = (1 - t) * offsetStart + t * offsetEnd;
    parallelPoints.push([px + normal[0] * offset, py + normal[1] * offset]);
  }
  return parallelPoints;
}

// **円の外部にある点群を抽出**
export function filterOutsidePoints(points, circle) {
  const outsidePoints = [];
  for (const [x, y] of points) {
    const dx = x - circle.cx;
    const dy = y - circle.cy;
    if (dx ** 2 + dy ** 2 > circle.radius ** 2) {
      outsidePoints.push([x, y]);
    }
  }
  return outsidePoints;
}

// **円と線分の交点を計算**
function getCircleLineIntersection(p1, p2, circle) {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  const { cx, cy, radius } = circle;

  // 線分のベクトル
  const dx = x2 - x1;
  const dy = y2 - y1;

  // 二次方程式の係数
  const a = dx ** 2 + dy ** 2;
  const b = 2 * (dx * (x1 - cx) + dy * (y1 - cy));
  const c = (x1 - cx) ** 2 + (y1 - cy) ** 2 - radius ** 2;

  // 判別式
  const discriminant = b ** 2 - 4 * a * c;

  if (discriminant < 0) {
    return []; // 交点なし
  }

  // tの値を計算（線分上の比率）
  const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
  const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);

  // tが0～1の範囲内の場合、交点を計算
  const intersections = [];
  if (t1 >= 0 && t1 <= 1) {
    intersections.push([x1 + t1 * dx, y1 + t1 * dy]);
  }
  if (t2 >= 0 && t2 <= 1) {
    intersections.push([x1 + t2 * dx, y1 + t2 * dy]);
  }

  return intersections;
}

// **外部セグメントを取得**
export function filterOutsideSegments(points, circle) {
  const segments = [];  

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    // 円と線分の交点を計算
    const intersections = getCircleLineIntersection(p1, p2, circle);

    // 点p1が円の外側にあるか
    const isP1Outside = (p1[0] - circle.cx) ** 2 + (p1[1] - circle.cy) ** 2 > circle.radius ** 2;

    if (isP1Outside) {
      segments.push(p1);
    }

    // 交点をセグメントに追加
    for (const intersection of intersections) {
      segments.push(intersection);
    }
  }

  return segments;
}

