import { useEffect, useRef } from 'react';

const SNOW_COUNT = 100;
const MIN_SIZE   = 1;
const MAX_SIZE   = 4;
const MIN_SPEED  = 0.2;
const MAX_SPEED  = 0.8;
const WIND       = 0.4;
const OPACITY    = 0.6;
const WOBBLE_AMP = 2.5;

const rand = (min, max) => Math.random() * (max - min) + min;

const createFlakes = (canvas) => {
  return Array.from({ length: SNOW_COUNT }, () => ({
    x: rand(0, canvas.width),
    y: rand(-canvas.height, 0),
    r: rand(MIN_SIZE, MAX_SIZE),
    speed: rand(MIN_SPEED, MAX_SPEED),
    wind: rand(-0.8, 0.8) + WIND,
    opacity: rand(0.3, OPACITY),
    wobble: rand(0, Math.PI * 2),
    wobbleSpeed: rand(0.008, 0.02),
  }));
};

const SnowEffect = () => {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const flakesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      flakesRef.current = createFlakes(canvas);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      flakesRef.current.forEach(f => {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
        ctx.fill();

        f.wobble += f.wobbleSpeed;
        f.x += f.wind + Math.sin(f.wobble) * WOBBLE_AMP;
        f.y += f.speed;

        if (f.y > canvas.height + f.r) {
          f.y = -f.r;
          f.x = rand(0, canvas.width);
        }
        if (f.x > canvas.width + f.r) f.x = -f.r;
        if (f.x < -f.r) f.x = canvas.width + f.r;
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

export default SnowEffect;
