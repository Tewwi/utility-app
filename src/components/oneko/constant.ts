import { TOnekoAnimation, TOnekoSprite } from "./type";

export const onekoInitSprite: TOnekoSprite = {
  status: "idle",
  direction: "right",
  spriteX: 1,
  spriteY: 1,
  x: 24,
  y: 80,
};

export const onekoIdleAnimation = [
  {
    x: 3,
    y: 3,
  },
  {
    x: 7,
    y: 3,
  },
  {
    x: 3,
    y: 3,
  },
  {
    x: 7,
    y: 3,
  },
];

export const onekoIdleSleepAnimation = [
  {
    x: 2,
    y: 0,
  },
  {
    x: 2,
    y: 1,
  },
];

export const onekoAnimation: TOnekoAnimation = {
  up: [
    {
      x: 1,
      y: 2,
    },
    {
      x: 0,
      y: 0,
    },
    {
      x: 0,
      y: 1,
    },
    {
      x: 1,
      y: 3,
    },
  ],
  down: [
    {
      x: 7,
      y: 2,
    },
    {
      x: 7,
      y: 1,
    },
    {
      x: 6,
      y: 2,
    },
    {
      x: 6,
      y: 3,
    },
  ],
  left: [
    {
      x: 4,
      y: 1,
    },
    {
      x: 4,
      y: 2,
    },
    {
      x: 4,
      y: 3,
    },
    {
      x: 4,
      y: 0,
    },
  ],
  right: [
    {
      x: 2,
      y: 3,
    },
    {
      x: 2,
      y: 2,
    },
    {
      x: 3,
      y: 0,
    },
    {
      x: 3,
      y: 1,
    },
  ],
  crossUpLeft: [
    {
      x: 1,
      y: 1,
    },
    {
      x: 1,
      y: 0,
    },
    {
      x: 1,
      y: 1,
    },
    {
      x: 1,
      y: 0,
    },
  ],
  crossUpRight: [
    {
      x: 0,
      y: 3,
    },
    {
      x: 0,
      y: 2,
    },
    {
      x: 0,
      y: 3,
    },
    {
      x: 0,
      y: 2,
    },
  ],
  crossDownLeft: [
    {
      x: 5,
      y: 2,
    },
    {
      x: 5,
      y: 1,
    },
    {
      x: 5,
      y: 2,
    },
    {
      x: 5,
      y: 1,
    },
  ],
  crossDownRight: [
    {
      x: 6,
      y: 1,
    },
    {
      x: 5,
      y: 3,
    },
    {
      x: 6,
      y: 1,
    },
    {
      x: 5,
      y: 3,
    },
  ],
};
