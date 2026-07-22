"use client";

import { useEffect, useRef } from "react";

type LogogramTitleProps = {
  word: "research" | "blog" | "about";
};

type Particle = {
  targetX: number;
  targetY: number;
  startX: number;
  startY: number;
  size: number;
  delay: number;
  seed: number;
  orbit: boolean;
  angle: number;
  radiusX: number;
  radiusY: number;
};

const wordLabels = {
  research: "Research",
  blog: "Blog",
  about: "About",
} as const;

function hashWord(word: string) {
  return [...word].reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0, 2166136261);
}

function seededRandom(seed: number) {
  let value = seed || 1;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function easeOutQuint(value: number) {
  return 1 - Math.pow(1 - value, 5);
}

function createParticles(word: string, width: number, height: number): Particle[] {
  const random = seededRandom(hashWord(word));
  const particles: Particle[] = [];
  const centerX = width / 2;
  const centerY = height * 0.52;
  const label = wordLabels[word as keyof typeof wordLabels].toUpperCase();
  const fontSize = Math.max(34, Math.min(58, width * 0.068));
  const letterSpacing = Math.max(4, fontSize * 0.12);
  const mask = document.createElement("canvas");
  const maskContext = mask.getContext("2d", { willReadFrequently: true });

  mask.width = Math.max(1, Math.round(width));
  mask.height = Math.max(1, Math.round(height));

  if (maskContext) {
    maskContext.clearRect(0, 0, width, height);
    maskContext.fillStyle = "#000";
    maskContext.font = `600 ${fontSize}px \"Playfair Display\", Georgia, serif`;
    maskContext.textBaseline = "middle";

    const characters = [...label];
    const characterWidths = characters.map((character) => maskContext.measureText(character).width);
    const textWidth = characterWidths.reduce((total, characterWidth) => total + characterWidth, 0) +
      letterSpacing * Math.max(0, characters.length - 1);
    let cursor = centerX - textWidth / 2;

    characters.forEach((character, index) => {
      maskContext.fillText(character, cursor, centerY + 2);
      cursor += characterWidths[index] + letterSpacing;
    });

    const image = maskContext.getImageData(0, 0, mask.width, mask.height).data;
    const step = width < 520 ? 5 : 4;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const alpha = image[(Math.floor(y) * mask.width + Math.floor(x)) * 4 + 3];
        if (alpha > 96 && random() > 0.08) {
          const angle = random() * Math.PI * 2;
          const distance = Math.max(width, height) * (0.32 + random() * 0.46);
          particles.push({
            targetX: x + (random() - 0.5) * 1.5,
            targetY: y + (random() - 0.5) * 1.5,
            startX: centerX + Math.cos(angle) * distance,
            startY: centerY + Math.sin(angle) * distance * 0.42,
            size: 0.65 + random() * 1.25,
            delay: random() * 0.32,
            seed: random() * Math.PI * 2,
            orbit: false,
            angle: 0,
            radiusX: 0,
            radiusY: 0,
          });
        }
      }
    }
  }

  const labelWidth = Math.min(width * 0.72, label.length * fontSize * 0.68);
  const radiusX = Math.max(105, Math.min(width * 0.37, labelWidth * 0.72));
  const radiusY = Math.min(height * 0.39, 82);
  const gapCenter = -0.72 + (hashWord(word) % 9) * 0.055;
  const gapSize = word === "research" ? 0.43 : 0.5;
  const ringPoints = Math.max(230, Math.round(radiusX * 2.25));

  for (let index = 0; index < ringPoints; index += 1) {
    const angle = (index / ringPoints) * Math.PI * 2 - Math.PI;
    const distanceFromGap = Math.abs(Math.atan2(Math.sin(angle - gapCenter), Math.cos(angle - gapCenter)));
    if (distanceFromGap < gapSize) continue;

    const layeredAngle = angle + (random() - 0.5) * 0.025;
    const thickness = 1.4 + Math.pow(Math.sin(angle * 1.7 + hashWord(word)), 2) * 7;
    const radialOffset = (random() - 0.5) * thickness;
    const targetX = centerX + Math.cos(layeredAngle) * (radiusX + radialOffset);
    const targetY = centerY + Math.sin(layeredAngle) * (radiusY + radialOffset * 0.5);
    const startAngle = layeredAngle - 1.8 - random() * 0.9;
    const startRadius = radiusX + 90 + random() * width * 0.28;

    particles.push({
      targetX,
      targetY,
      startX: centerX + Math.cos(startAngle) * startRadius,
      startY: centerY + Math.sin(startAngle) * (radiusY + 70 + random() * 35),
      size: 0.55 + random() * 1.55,
      delay: random() * 0.24,
      seed: random() * Math.PI * 2,
      orbit: true,
      angle: layeredAngle,
      radiusX: radiusX + radialOffset,
      radiusY: radiusY + radialOffset * 0.5,
    });
  }

  return particles;
}

export function LogogramTitle({ word }: LogogramTitleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const container = canvas?.parentElement;
    if (!canvas || !context || !container) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let particles: Particle[] = [];
    let frame = 0;
    let animationStart = performance.now();
    let scrollOffset = window.scrollY;
    let scrollEnergy = 0;
    let previousScroll = scrollOffset;
    let width = 0;
    let height = 0;
    let ink = "#24180f";
    let resizeTimer = 0;

    const readInkColor = () => {
      ink = getComputedStyle(document.documentElement).getPropertyValue("--logogram").trim() || "#24180f";
    };

    const draw = (time: number) => {
      const elapsed = reducedMotion ? 9999 : time - animationStart;
      const baseProgress = Math.min(1, elapsed / 1550);
      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      context.scale(devicePixelRatio, devicePixelRatio);
      context.fillStyle = ink;

      const centerX = width / 2;
      const centerY = height * 0.52;
      const scrollRotation = scrollOffset * 0.0005;

      particles.forEach((particle) => {
        const localProgress = Math.max(0, Math.min(1, (baseProgress - particle.delay) / (1 - particle.delay)));
        const eased = easeOutQuint(localProgress);
        const orbitAngle = particle.angle + scrollRotation;
        const restingX = particle.orbit
          ? centerX + Math.cos(orbitAngle) * particle.radiusX
          : particle.targetX;
        const restingY = particle.orbit
          ? centerY + Math.sin(orbitAngle) * particle.radiusY
          : particle.targetY;
        const curl = Math.sin((1 - eased) * Math.PI + particle.seed) * (1 - eased) * 34;
        const scrollDrift = Math.sin(particle.seed + time * 0.0014) * scrollEnergy * (particle.orbit ? 7 : 2.5);
        const x = particle.startX + (restingX - particle.startX) * eased + curl;
        const y = particle.startY + (restingY - particle.startY) * eased + scrollDrift;
        const alpha = Math.min(1, localProgress * 2.8) * (particle.orbit ? 0.74 : 0.96);

        context.globalAlpha = alpha;
        context.beginPath();
        context.arc(x, y, particle.size, 0, Math.PI * 2);
        context.fill();
      });

      context.restore();
      scrollEnergy *= 0.91;
      frame = window.requestAnimationFrame(draw);
    };

    const resize = () => {
      const bounds = container.getBoundingClientRect();
      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(280, Math.round(bounds.width));
      height = Math.round(bounds.height);
      canvas.width = Math.round(width * devicePixelRatio);
      canvas.height = Math.round(height * devicePixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      particles = createParticles(word, width, height);
      animationStart = performance.now();
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 120);
    };

    const onScroll = () => {
      scrollOffset = window.scrollY;
      scrollEnergy = Math.min(1, scrollEnergy + Math.abs(scrollOffset - previousScroll) * 0.018);
      previousScroll = scrollOffset;
    };

    const onThemeChange = () => readInkColor();
    const themeObserver = new MutationObserver(onThemeChange);

    readInkColor();
    resize();
    document.fonts?.ready.then(() => resize());
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimer);
      themeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [word]);

  const label = wordLabels[word];

  return (
    <div className="logogram-title">
      <canvas ref={canvasRef} role="img" aria-label={`${label}, drawn as an animated particle logogram`} />
    </div>
  );
}
