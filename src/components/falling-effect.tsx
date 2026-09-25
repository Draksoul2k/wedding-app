'use client';

import React, { useEffect, useRef } from 'react';

interface FallingEffectProps {
  type?: 'petals' | 'hearts' | 'sparkles' | 'none';
}

export const FallingEffect: React.FC<FallingEffectProps> = ({ type = 'petals' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (type === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const itemCount = 25;
    const items: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      rotation: number;
      rotSpeed: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < itemCount; i++) {
      items.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: Math.random() * 12 + 10,
        speedX: Math.random() * 1.5 - 0.75,
        speedY: Math.random() * 1.5 + 1,
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 2 - 1,
        opacity: Math.random() * 0.4 + 0.4,
      });
    }

    const drawPetal = (x: number, y: number, size: number, rotation: number, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.fillStyle = `rgba(239, 68, 68, ${opacity})`;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(size / 2, -size / 2, size, 0, 0, size);
      ctx.bezierCurveTo(-size, 0, -size / 2, -size / 2, 0, 0);
      ctx.fill();
      ctx.restore();
    };

    const drawHeart = (x: number, y: number, size: number, rotation: number, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.fillStyle = `rgba(244, 63, 94, ${opacity})`;
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size);
      ctx.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      ctx.fill();
      ctx.restore();
    };

    const drawSparkle = (x: number, y: number, size: number, rotation: number, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.fillStyle = `rgba(250, 204, 21, ${opacity})`;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        item.y += item.speedY;
        item.x += Math.sin(item.y * 0.01) + item.speedX;
        item.rotation += item.rotSpeed;

        if (item.y > height + 20) {
          item.y = -20;
          item.x = Math.random() * width;
        }

        if (type === 'hearts') {
          drawHeart(item.x, item.y, item.size, item.rotation, item.opacity);
        } else if (type === 'sparkles') {
          drawSparkle(item.x, item.y, item.size, item.rotation, item.opacity);
        } else {
          drawPetal(item.x, item.y, item.size, item.rotation, item.opacity);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [type]);

  if (type === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
};
