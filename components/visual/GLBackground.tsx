"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// Pixelated, domain-warped fbm "smoke" field, quantized to hard posterized
// bands in --surface / --accent. No soft gradients - brutalist duotone only.
// Cursor/touch position stirs the field with a local swirl; scroll velocity
// advects it. See docs/DESIGN.md §4 for the design rationale.
const FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uScrollVelocity;
  uniform float uPixelSize;

  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                         -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
           + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Fractal brownian motion - layered noise octaves give the roiling,
  // billowing structure of smoke instead of a single flat noise plane.
  float fbm(vec2 p) {
    float sum = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      sum += amp * snoise(p);
      p *= 2.02;
      amp *= 0.55;
    }
    return sum;
  }

  void main() {
    // Quantize screen position to a coarse pixel grid before sampling noise -
    // the chunky, pixel-sim look the brutalist direction calls for.
    vec2 grid = floor(gl_FragCoord.xy / uPixelSize) * uPixelSize;
    vec2 uv = grid / uResolution;

    vec2 aspectUv = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
    vec2 mouseInfluence = (uMouse - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
    float distToMouse = distance(aspectUv, mouseInfluence);

    float t = uTime * 0.06;

    // Domain warp: smoke advects through its own noise field rather than
    // sampling a single static octave stack.
    vec2 warpA = vec2(fbm(aspectUv * 1.4 + t), fbm(aspectUv * 1.4 - t * 0.8));
    vec2 warped = aspectUv + warpA * 0.6 + vec2(t * 0.05, 0.0);

    // Cursor/touch stirs the field locally with a soft rotational swirl
    // instead of a hard ripple, staying subtle per the design brief.
    float swirlStrength = smoothstep(0.7, 0.0, distToMouse) * 0.35;
    float angle = swirlStrength * 3.0;
    float ca = cos(angle);
    float sa = sin(angle);
    vec2 rel = warped - mouseInfluence;
    rel = mat2(ca, -sa, sa, ca) * rel;
    warped = mouseInfluence + rel;

    float density = fbm(warped * 2.2 + uScrollVelocity * 0.4);
    density = density * 0.5 + 0.5;
    density += smoothstep(0.75, 0.0, distToMouse) * 0.12;

    // Posterize into hard bands - no smooth gradients, matching the
    // hard-edge/no-soft-shadow brutalist component language.
    const float bands = 5.0;
    float posterized = floor(clamp(density, 0.0, 1.0) * bands) / bands;

    vec3 surface = vec3(0.039, 0.039, 0.043);
    vec3 accent = vec3(0.776, 0.973, 0.306);
    vec3 color = mix(surface, accent * 0.9, posterized * 0.55);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const TARGET_FPS = 30;
const FRAME_INTERVAL = 1 / TARGET_FPS;

function SmokeField({ paused }: { paused: boolean }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport, invalidate } = useThree();
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const scrollVelocity = useRef(0);
  const lastScroll = useRef(0);
  const accumulator = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uScrollVelocity: { value: 0 },
      uPixelSize: { value: 5 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Cap to TARGET_FPS via a manual accumulator rather than throttling the
  // R3F render loop directly, so the demand-driven canvas only re-renders
  // as often as the shader actually needs to animate (ADR-004: capped fps).
  useFrame((state, delta) => {
    if (paused || !materialRef.current) return;
    accumulator.current += delta;
    if (accumulator.current < FRAME_INTERVAL) {
      invalidate();
      return;
    }
    accumulator.current = 0;

    const y = window.scrollY;
    scrollVelocity.current = (y - lastScroll.current) * 0.02;
    lastScroll.current = y;

    const mat = materialRef.current;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uResolution.value.set(size.width, size.height);
    mat.uniforms.uMouse.value.lerp(
      new THREE.Vector2(mouse.current.x, mouse.current.y),
      0.05
    );
    mat.uniforms.uScrollVelocity.value = THREE.MathUtils.lerp(
      mat.uniforms.uScrollVelocity.value,
      scrollVelocity.current,
      0.1
    );
    invalidate();
  });

  return (
    <mesh
      scale={[viewport.width, viewport.height, 1]}
      onPointerMove={(e) => {
        mouse.current = { x: e.uv?.x ?? 0.5, y: e.uv?.y ?? 0.5 };
      }}
    >
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={uniforms}
      />
    </mesh>
  );
}

/**
 * Full-viewport generative background: a pixelated, domain-warped smoke
 * simulation in the app's surface/accent duotone. Freezes to a single static
 * frame under prefers-reduced-motion (no animation loop started at all) and
 * pauses when the tab is hidden. Rendered on a demand-driven canvas capped at
 * 30fps. Lazy-loaded via next/dynamic with ssr:false from the root layout.
 */
export function GLBackground() {
  // Lazy initializers read the real values on first client render (this
  // component is only ever mounted via next/dynamic with ssr:false).
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [hidden, setHidden] = useState(() => document.hidden);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(media.matches);
    media.addEventListener("change", onChange);

    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      media.removeEventListener("change", onChange);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 opacity-70">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "low-power" }}
        frameloop={reduced ? "never" : "demand"}
      >
        <SmokeField paused={reduced || hidden} />
      </Canvas>
    </div>
  );
}