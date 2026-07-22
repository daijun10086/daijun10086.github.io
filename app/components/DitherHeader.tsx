"use client";

import { useEffect, useRef } from "react";

const bayer = [
  0, 8, 2, 10,
  12, 4, 14, 6,
  3, 11, 1, 9,
  15, 7, 13, 5,
];

export function DitherHeader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastDraw = 0;
    let width = 0;
    let height = 0;

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas!.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width * ratio));
      height = Math.max(1, Math.round(rect.height * ratio));
      canvas!.width = width;
      canvas!.height = height;
      context!.setTransform(1, 0, 0, 1, 0, 0);
    }

    function draw(time: number) {
      if (!width || !height) resize();
      context!.clearRect(0, 0, width, height);

      const styles = getComputedStyle(document.documentElement);
      const ink = styles.getPropertyValue("--dither-ink").trim() || "#8a5b2d";
      const cell = Math.max(5, Math.round(width / 240));
      const speed = reduceMotion.matches ? 0 : time * 0.00006;

      context!.fillStyle = ink;

      for (let y = 0; y < height; y += cell) {
        const vertical = y / height;
        const bottomFade = Math.pow(Math.max(0, 1 - vertical), 1.8);

        for (let x = 0; x < width; x += cell) {
          const horizontal = x / width;
          const ridge =
            0.34 +
            Math.sin(horizontal * 13.2 + speed * 7) * 0.075 +
            Math.sin(horizontal * 31.5 - speed * 11) * 0.035;
          const distance = Math.abs(vertical - ridge);
          const waveBand = Math.max(0, 1 - distance * 7.2);
          const secondary =
            (Math.sin(horizontal * 47 + vertical * 19 + speed * 4) + 1) * 0.12;
          const edge =
            Math.min(1, horizontal * 8) * Math.min(1, (1 - horizontal) * 8);
          const density = (waveBand * 0.72 + secondary) * bottomFade * edge;
          const threshold = bayer[((y / cell) % 4) * 4 + ((x / cell) % 4)] / 16;

          if (density > threshold) {
            const size = Math.max(1, cell * 0.42);
            context!.fillRect(x, y, size, size);
          }
        }
      }
    }

    function animate(time: number) {
      if (time - lastDraw > 72 || reduceMotion.matches) {
        draw(time);
        lastDraw = time;
      }
      if (!reduceMotion.matches) frame = requestAnimationFrame(animate);
    }

    const observer = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });

    observer.observe(canvas);
    resize();
    draw(performance.now());
    if (!reduceMotion.matches) frame = requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="dither-header" aria-hidden="true" />;
}
