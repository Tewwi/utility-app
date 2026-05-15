import React, { useEffect, useRef, useState } from "react";
import {
  calcAngleFromElementToMouse,
  calcDirectionFromAngle,
  convertToPixel,
} from "./utils";
import {
  onekoAnimation,
  onekoIdleAnimation,
  onekoIdleSleepAnimation,
  onekoInitSprite,
} from "./constant";
import { TOnekoDirection, TOnekoSprite } from "./type";

const SPRITE_FPS = 6; // Sprite animation speed (frames per second)
const SPRITE_FRAME_DURATION = 1000 / SPRITE_FPS;

interface OnekoProps {
  isHasCat: boolean;
}

const Oneko = ({ isHasCat }: OnekoProps) => {
  const [onekoSprite, setOnekoSprite] = useState<TOnekoSprite>(onekoInitSprite);
  const { x, y } = convertToPixel(onekoSprite.spriteX, onekoSprite.spriteY);
  const frameIndexRef = React.useRef(0);
  const onekoRef = useRef<HTMLDivElement>(null);
  const targetMouseRef = useRef<{ x: number; y: number }>({
    x: onekoInitSprite.x,
    y: onekoInitSprite.y,
  });
  const catIdleStatusRef = useRef<boolean>(false);
  const onekoSpriteRef = useRef<TOnekoSprite>(onekoInitSprite);

  const animate = (frameIdx: number) => {
    const currentSprite = onekoSpriteRef.current;
    let newX = currentSprite.x;
    let newY = currentSprite.y;
    let status = currentSprite.status;
    const animationIdle = catIdleStatusRef.current
      ? onekoIdleSleepAnimation
      : onekoIdleAnimation;

    // Calculate distance to target
    const dx = targetMouseRef.current.x - currentSprite.x;
    const dy = targetMouseRef.current.y - currentSprite.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 1) {
      // If at the target, set status to idle and snap to target
      newX = targetMouseRef.current.x;
      newY = targetMouseRef.current.y;
      status = "idle";
    } else {
      // Move one step toward the target and set status to walk
      newX = currentSprite.x + Math.sign(dx);
      newY = currentSprite.y + Math.sign(dy);
      status = "walk";
    }

    const frames =
      status === "idle"
        ? animationIdle
        : onekoAnimation[currentSprite.direction] || onekoAnimation.right;
    const animation = frames[frameIdx % frames.length] || frames[0];
    if (!animation) return;

    setOnekoSprite((prev: TOnekoSprite) => ({
      ...prev,
      spriteX: animation.x || 0,
      spriteY: animation.y || 0,
      status,
      x: newX,
      y: newY,
    }));
  };

  const handleMouseMove = (x: number, y: number) => {
    const angle = calcAngleFromElementToMouse(onekoRef, x, y);
    if (angle === null) return;
    const direction = calcDirectionFromAngle(angle);
    if (catIdleStatusRef.current) {
      catIdleStatusRef.current = false;
    }
    setOnekoSprite((prev: TOnekoSprite) => ({
      ...prev,
      direction: direction as TOnekoDirection,
    }));
    targetMouseRef.current = { x, y };
  };

  const handleMouseOut = (e: MouseEvent) => {
    if (!e.relatedTarget) {
      handleMouseMove(onekoInitSprite.x, onekoInitSprite.y);
      catIdleStatusRef.current = true;
    }
  };

  useEffect(() => {
    if (!isHasCat) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;
      frameIndexRef.current += delta / SPRITE_FRAME_DURATION;
      const frameIdx = Math.floor(frameIndexRef.current);
      animate(frameIdx);
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHasCat]);

  useEffect(() => {
    if (!isHasCat) return;

    const handleWindowMouseMove = (e: MouseEvent) => {
      handleMouseMove(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      document.removeEventListener("mouseout", handleMouseOut);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHasCat]);

  useEffect(() => {
    onekoSpriteRef.current = onekoSprite;
  }, [onekoSprite]);

  if (!isHasCat) return null;

  return (
    <div
      id="oneko"
      ref={onekoRef}
      style={{
        backgroundImage: "url('/spirits/oneko.gif')",
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
        backgroundPosition: `-${x}px -${y}px`,
        height: "32px",
        width: "32px",
        position: "fixed",
        top: `${onekoSprite.y}px`,
        left: `${onekoSprite.x}px`,
        zIndex: 60,
        pointerEvents: "none",
      }}
    ></div>
  );
};

export default Oneko;
