import React, { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";

/**
 * SphereImageGrid — interactieve 3D-bol met afbeeldingen.
 * Fibonacci-verdeling, sleep-rotatie met momentum, optionele auto-rotatie.
 */

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface SphericalPosition {
  theta: number;
  phi: number;
  radius: number;
}

export interface WorldPosition extends Position3D {
  scale: number;
  zIndex: number;
  isVisible: boolean;
  fadeOpacity: number;
  originalIndex: number;
}

export interface ImageData {
  id: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  href?: string;
}

export interface SphereImageGridProps {
  images?: ImageData[];
  containerSize?: number;
  sphereRadius?: number;
  dragSensitivity?: number;
  momentumDecay?: number;
  maxRotationSpeed?: number;
  baseImageScale?: number;
  hoverScale?: number;
  perspective?: number;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  className?: string;
  showModal?: boolean;
  onImageClick?: (image: ImageData) => void;
}

const toRad = (deg: number) => deg * (Math.PI / 180);
const normalizeAngle = (angle: number) => {
  let a = angle;
  while (a > 180) a -= 360;
  while (a < -180) a += 360;
  return a;
};

const SphereImageGrid: React.FC<SphereImageGridProps> = ({
  images = [],
  containerSize = 400,
  sphereRadius = 200,
  dragSensitivity = 0.5,
  momentumDecay = 0.95,
  maxRotationSpeed = 5,
  baseImageScale = 0.12,
  hoverScale = 1.2,
  perspective = 1000,
  autoRotate = false,
  autoRotateSpeed = 0.3,
  className = "",
  showModal = true,
  onImageClick,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [rotation, setRotation] = useState({ x: 15, y: 15, z: 0 });
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [imagePositions, setImagePositions] = useState<SphericalPosition[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const animationFrame = useRef<number | null>(null);
  const velocity = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const moved = useRef(false);

  const actualSphereRadius = sphereRadius || containerSize * 0.5;
  const baseImageSize = containerSize * baseImageScale;

  const clampSpeed = useCallback(
    (speed: number) => Math.max(-maxRotationSpeed, Math.min(maxRotationSpeed, speed)),
    [maxRotationSpeed],
  );

  /* Fibonacci-verdeling over de bol */
  useEffect(() => {
    const count = images.length;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = (2 * Math.PI) / goldenRatio;
    const positions: SphericalPosition[] = [];
    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = angleIncrement * i;
      const phi = 15 + (inclination * (180 / Math.PI) / 180) * 150;
      const theta = (azimuth * (180 / Math.PI)) % 360;
      positions.push({ theta, phi, radius: actualSphereRadius });
    }
    setImagePositions(positions);
  }, [images.length, actualSphereRadius]);

  /* Wereldposities per frame */
  const worldPositions: WorldPosition[] = imagePositions.map((pos, index) => {
    const thetaRad = toRad(pos.theta);
    const phiRad = toRad(pos.phi);
    const rotXRad = toRad(rotation.x);
    const rotYRad = toRad(rotation.y);

    let x = pos.radius * Math.sin(phiRad) * Math.cos(thetaRad);
    let y = pos.radius * Math.cos(phiRad);
    let z = pos.radius * Math.sin(phiRad) * Math.sin(thetaRad);

    const x1 = x * Math.cos(rotYRad) + z * Math.sin(rotYRad);
    const z1 = -x * Math.sin(rotYRad) + z * Math.cos(rotYRad);
    x = x1;
    z = z1;

    const y2 = y * Math.cos(rotXRad) - z * Math.sin(rotXRad);
    const z2 = y * Math.sin(rotXRad) + z * Math.cos(rotXRad);
    y = y2;
    z = z2;

    const depth = (z + actualSphereRadius) / (2 * actualSphereRadius);
    const scale = 0.55 + depth * 0.6;
    const fadeOpacity = 0.45 + depth * 0.55;

    return {
      x,
      y,
      z,
      scale,
      zIndex: Math.round(1000 + z),
      isVisible: true,
      fadeOpacity,
      originalIndex: index,
    };
  });

  /* Animatielus */
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const animate = () => {
      if (!dragging.current) {
        velocity.current = {
          x: velocity.current.x * momentumDecay,
          y: velocity.current.y * momentumDecay,
        };
        if (Math.abs(velocity.current.x) < 0.005) velocity.current.x = 0;
        if (Math.abs(velocity.current.y) < 0.005) velocity.current.y = 0;

        setRotation((prev) => ({
          x: normalizeAngle(prev.x + clampSpeed(velocity.current.x)),
          y: normalizeAngle(
            prev.y + clampSpeed(velocity.current.y) + (autoRotate ? autoRotateSpeed : 0),
          ),
          z: prev.z,
        }));
      }
      animationFrame.current = requestAnimationFrame(animate);
    };
    animationFrame.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [isMounted, momentumDecay, autoRotate, autoRotateSpeed, clampSpeed]);

  /* Sleep- en aanraakinteractie */
  useEffect(() => {
    if (!isMounted) return;

    const move = (clientX: number, clientY: number) => {
      if (!dragging.current) return;
      const deltaX = clientX - lastMousePos.current.x;
      const deltaY = clientY - lastMousePos.current.y;
      if (Math.abs(deltaX) + Math.abs(deltaY) > 3) moved.current = true;
      const rx = -deltaY * dragSensitivity;
      const ry = deltaX * dragSensitivity;
      setRotation((prev) => ({
        x: normalizeAngle(prev.x + clampSpeed(rx)),
        y: normalizeAngle(prev.y + clampSpeed(ry)),
        z: prev.z,
      }));
      velocity.current = { x: clampSpeed(rx), y: clampSpeed(ry) };
      lastMousePos.current = { x: clientX, y: clientY };
    };

    const onMouseMove = (e: MouseEvent) => move(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging.current) return;
      const t = e.touches[0];
      move(t.clientX, t.clientY);
    };
    const onUp = () => {
      dragging.current = false;
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onUp);
    };
  }, [isMounted, dragSensitivity, clampSpeed]);

  const startDrag = (x: number, y: number) => {
    dragging.current = true;
    moved.current = false;
    velocity.current = { x: 0, y: 0 };
    lastMousePos.current = { x, y };
  };

  if (!images.length) return null;

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${className}`}
      style={{
        width: containerSize,
        height: containerSize,
        perspective,
        cursor: "grab",
        touchAction: "pan-y",
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        startDrag(e.clientX, e.clientY);
      }}
      onTouchStart={(e) => {
        const t = e.touches[0];
        startDrag(t.clientX, t.clientY);
      }}
    >
      <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
        {images.map((image, index) => {
          const position = worldPositions[index];
          if (!position) return null;
          const size = baseImageSize * position.scale;
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={image.id}
              className="absolute left-1/2 top-1/2 flex items-center justify-center rounded-xl border border-brand-line bg-white p-3 shadow-sm transition-[box-shadow,border-color] duration-200"
              style={{
                width: size,
                height: size,
                marginLeft: -size / 2,
                marginTop: -size / 2,
                transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isHovered ? hoverScale : 1})`,
                opacity: position.fadeOpacity,
                zIndex: position.zIndex,
                transitionProperty: "transform, opacity",
                transitionDuration: "120ms",
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => {
                if (onImageClick) onImageClick(image);
                else if (showModal) setSelectedImage(image);
              }}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          );
        })}
      </div>

      {showModal && selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 p-6 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-md rounded-xl border border-border bg-card p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              aria-label="Sluiten"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="mx-auto max-h-40 object-contain"
            />
            {selectedImage.title && (
              <h3 className="mt-6 font-display text-lg font-bold">{selectedImage.title}</h3>
            )}
            {selectedImage.description && (
              <p className="mt-2 text-sm text-muted-foreground">{selectedImage.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SphereImageGrid;
