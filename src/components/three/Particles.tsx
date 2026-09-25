import { useEffect, useRef } from "react";
import { Renderer, Camera, Geometry, Program, Mesh } from "ogl";
import { isDocumentVisible } from "../../lib/documentVisibility";
import "./Particles.css";

/**
 * Particles — the React Bits "Particles" background (https://reactbits.dev),
 * JavaScript + CSS variant, ported to TypeScript. The shaders, the geometry
 * and every visual prop are upstream's, unchanged. What differs is
 * integration only, so the effect can follow this site's performance rules
 * (the same ones Aurora follows):
 *
 *  - `active` is the one prop that isn't in upstream. While it's false the
 *    render loop is cancelled outright — an off-screen hero costs no GPU work
 *    and no per-frame main-thread wakeups. Turning it back on restarts the
 *    loop with the scene intact: no context recreation, no shader recompile.
 *  - `particleColors` can change without rebuilding the scene: each particle
 *    remembers *where in the palette* it landed, and the colour buffer is
 *    re-uploaded in place. (A theme toggle therefore doesn't blink the hero.)
 *  - Rotation is frame-rate independent — upstream adds a fixed step per
 *    frame, so a 120 Hz display would spin twice as fast — and frame deltas
 *    are clamped, so resuming after a pause can never make the field jump.
 *  - Teardown releases the WebGL context and the resize observer, not just
 *    the canvas node.
 *  - The canvas is decorative, so the root is aria-hidden.
 *
 * Only the props below cause the scene to be rebuilt; `active` and
 * `particleColors` never do. Pass `particleColors` with a stable reference
 * (a module-level constant, say) — a new array recolours in place, which is
 * cheap, but there's no reason to do it on every render.
 */

const defaultColors = ["#ffffff", "#ffffff", "#ffffff"];

/** One frame at 60 Hz — the timestep upstream's per-frame rotation assumes. */
const FRAME_MS = 1000 / 60;
/** Longest step the animation clock will take, so a stall can't cause a jump. */
const MAX_FRAME_MS = 100;

const hexToRgb = (hex: string): [number, number, number] => {
  let value = hex.replace(/^#/, "");
  if (value.length === 3) {
    value = value
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const int = parseInt(value.slice(0, 6), 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  return [r, g, b];
};

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vRandom = random;
    vColor = color;
    
    vec3 pos = position * uSpread;
    pos.z *= 10.0;
    
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
    
    vec4 mvPos = viewMatrix * mPos;

    if (uSizeRandomness == 0.0) {
      gl_PointSize = uBaseSize;
    } else {
      gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    }

    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  
  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));
    
    if(uAlphaParticles < 0.5) {
      if(d > 0.5) {
        discard;
      }
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.8;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
    }
  }
`;

export interface ParticlesProps {
  /** The number of particles to generate. */
  particleCount?: number;
  /** How far particles are spread from the center. */
  particleSpread?: number;
  /** Speed factor controlling the animation pace. */
  speed?: number;
  /** Hex colours the particles are drawn from (repeat an entry to weight it). */
  particleColors?: string[];
  /** Whether particles drift in response to the pointer. */
  moveParticlesOnHover?: boolean;
  /** Multiplier for the pointer-driven drift. */
  particleHoverFactor?: number;
  /** Soft, translucent discs instead of solid ones. */
  alphaParticles?: boolean;
  /** The base size of the particles. */
  particleBaseSize?: number;
  /** Variation in particle sizes (0 = every particle the same size). */
  sizeRandomness?: number;
  /** Distance from the camera to the particle system. */
  cameraDistance?: number;
  /** Stops the particle system from rotating. */
  disableRotation?: boolean;
  /** Pixel ratio the canvas renders at. */
  pixelRatio?: number;
  /**
   * When false the render loop is cancelled (no GPU work, no per-frame
   * wakeups) without tearing the scene down, so resuming is instant. Not
   * part of upstream React Bits. Defaults to true.
   */
  active?: boolean;
  className?: string;
}

/** What a live scene exposes so `active` / palette changes never rebuild it. */
interface SceneControls {
  setActive: (next: boolean) => void;
  setPalette: (hexes: readonly string[] | undefined) => void;
}

export default function Particles({
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleColors,
  moveParticlesOnHover = false,
  particleHoverFactor = 1,
  alphaParticles = false,
  particleBaseSize = 100,
  sizeRandomness = 1,
  cameraDistance = 20,
  disableRotation = false,
  pixelRatio = 1,
  active = true,
  className,
}: ParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const controlsRef = useRef<SceneControls | null>(null);
  // The latest `active` / palette, read when a scene is (re)built. Kept in
  // refs — and pushed to a live scene via `controlsRef` — so neither ever
  // appears in the main effect's dependency array below.
  const activeRef = useRef(active);
  const paletteRef = useRef(particleColors);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      dpr: pixelRatio,
      depth: false,
      alpha: true,
    });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, cameraDistance);

    // Resizing reallocates the canvas (and clears it), so only do it when the
    // size really changed — ResizeObserver also reports once on `observe`.
    let lastWidth = 0;
    let lastHeight = 0;
    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;
      if (width === lastWidth && height === lastHeight) return;
      lastWidth = width;
      lastHeight = height;
      renderer.setSize(width, height);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current = { x, y };
    };

    if (moveParticlesOnHover) {
      container.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);
    // Where in the palette (0–1) each particle landed — not a colour — so the
    // palette can be swapped later without reshuffling who gets which colour.
    const palettePick = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      let x: number, y: number, z: number, len: number;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x * x + y * y + z * z;
      } while (len > 1 || len === 0);
      const r = Math.cbrt(Math.random());
      positions[i * 3] = x * r;
      positions[i * 3 + 1] = y * r;
      positions[i * 3 + 2] = z * r;
      randoms[i * 4] = Math.random();
      randoms[i * 4 + 1] = Math.random();
      randoms[i * 4 + 2] = Math.random();
      randoms[i * 4 + 3] = Math.random();
      palettePick[i] = Math.random();
    }

    const paintColors = (hexes: readonly string[] | undefined) => {
      const source = hexes && hexes.length > 0 ? hexes : defaultColors;
      const palette = source.map(hexToRgb);
      for (let i = 0; i < count; i++) {
        const slot = Math.min(palette.length - 1, Math.floor(palettePick[i] * palette.length));
        const [r, g, b] = palette[slot];
        colors[i * 3] = r;
        colors[i * 3 + 1] = g;
        colors[i * 3 + 2] = b;
      }
    };
    paintColors(paletteRef.current);

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors },
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: particleSpread },
        uBaseSize: { value: particleBaseSize * pixelRatio },
        uSizeRandomness: { value: sizeRandomness },
        uAlphaParticles: { value: alphaParticles ? 1 : 0 },
      },
      transparent: true,
      depthTest: false,
    });

    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    let animationFrameId = 0;
    let running = false;
    let lastTime = 0;
    let elapsed = 0;

    const update = (t: number) => {
      animationFrameId = requestAnimationFrame(update);
      const delta = Math.min(Math.max(t - lastTime, 0), MAX_FRAME_MS);
      lastTime = t;
      // Backgrounded tab: keep the clock current but skip the GPU submission.
      if (!isDocumentVisible()) return;

      elapsed += delta * speed;

      program.uniforms.uTime.value = elapsed * 0.001;

      if (moveParticlesOnHover) {
        particles.position.x = -mouseRef.current.x * particleHoverFactor;
        particles.position.y = -mouseRef.current.y * particleHoverFactor;
      }

      if (!disableRotation) {
        particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
        particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
        particles.rotation.z += 0.01 * speed * (delta / FRAME_MS);
      }

      renderer.render({ scene: particles, camera });
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(update);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(animationFrameId);
    };

    controlsRef.current = {
      setActive: (next) => {
        if (next) start();
        else stop();
      },
      setPalette: (hexes) => {
        paintColors(hexes);
        // ogl re-uploads a flagged attribute (same typed array) on next draw.
        geometry.attributes.color.needsUpdate = true;
      },
    };

    if (activeRef.current) start();

    return () => {
      stop();
      controlsRef.current = null;
      resizeObserver.disconnect();
      if (moveParticlesOnHover) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    particleCount,
    particleSpread,
    speed,
    moveParticlesOnHover,
    particleHoverFactor,
    alphaParticles,
    particleBaseSize,
    sizeRandomness,
    cameraDistance,
    disableRotation,
    pixelRatio,
  ]);

  useEffect(() => {
    activeRef.current = active;
    controlsRef.current?.setActive(active);
  }, [active]);

  useEffect(() => {
    paletteRef.current = particleColors;
    controlsRef.current?.setPalette(particleColors);
  }, [particleColors]);

  return (
    <div
      ref={containerRef}
      className={className ? `particles-container ${className}` : "particles-container"}
      aria-hidden="true"
    />
  );
}
