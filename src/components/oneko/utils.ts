export const convertToPixel = (x: number, y: number) => {
  return {
    x: x * 32,
    y: y * 32,
  };
};

/**
 * Calculates the angle (in degrees) from the center of a DOM element to the mouse position.
 * @param elementRef - React ref to the DOM element
 * @param mouseX - Mouse X coordinate (clientX)
 * @param mouseY - Mouse Y coordinate (clientY)
 * @returns Angle in degrees (0 = right, 90 = down, etc.)
 */
export function calcAngleFromElementToMouse(
  elementRef: React.RefObject<HTMLElement | null>,
  mouseX: number,
  mouseY: number,
): number | null {
  const el = elementRef.current;
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dx = mouseX - centerX;
  const dy = mouseY - centerY;
  const radians = Math.atan2(dy, dx);
  const degrees = radians * (180 / Math.PI);
  return degrees;
}

export const calcDirectionFromAngle = (angle: number) => {
  // Normalize angle to [0, 360)
  let normAngle = angle % 360;
  if (normAngle < 0) normAngle += 360;

  // 8 directions, each 45 degrees
  // 0: right (337.5 to 22.5)
  // 1: crossDownRight (22.5 to 67.5)
  // 2: down (67.5 to 112.5)
  // 3: crossDownLeft (112.5 to 157.5)
  // 4: left (157.5 to 202.5)
  // 5: crossUpLeft (202.5 to 247.5)
  // 6: up (247.5 to 292.5)
  // 7: crossUpRight (292.5 to 337.5)
  const directions = [
    "right",
    "crossDownLeft",
    "down",
    "crossDownRight",
    "left",
    "crossUpLeft",
    "up",
    "crossUpRight",
  ];
  const sector = Math.floor((normAngle + 22.5) / 45) % 8;
  return directions[sector];
};
