export type TOnekoDirection =
  | "left"
  | "right"
  | "up"
  | "down"
  | "crossUpLeft"
  | "crossUpRight"
  | "crossDownLeft"
  | "crossDownRight";

export type TOnekoStatus = "idle" | "walk";

export type TOnekoSprite = {
  status: TOnekoStatus;
  direction: TOnekoDirection;
  spriteX: number;
  spriteY: number;
  x: number;
  y: number;
};

export type TOnekoAnimation = Record<
  TOnekoDirection,
  { x: number; y: number }[]
>;
