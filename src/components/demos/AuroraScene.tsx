"use client";

import { useMemo, useRef, type ComponentRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Icosahedron, Torus, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

/** Scroll progress 0..1, written by the page and read inside useFrame. */
const scroll = { v: 0 };
export function setAuroraScroll(v: number) {
  scroll.v = v;
}

const PALETTE = [
  new THREE.Color("#7c3aed"),
  new THREE.Color("#ec4899"),
  new THREE.Color("#06b6d4"),
  new THREE.Color("#f59e0b"),
];

function Core() {
  const mesh = useRef<THREE.Mesh>(null);
  const wire = useRef<THREE.Mesh>(null);
  const mat = useRef<ComponentRef<typeof MeshDistortMaterial>>(null);
  const color = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    const p = scroll.v;
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.22;
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.18 + p * 1.2;
      mesh.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.025 - p * 0.18);
    }
    if (wire.current) {
      wire.current.rotation.y -= delta * 0.1;
      wire.current.rotation.z += delta * 0.05;
    }
    if (mat.current) {
      mat.current.distort = 0.22 + Math.sin(state.clock.elapsedTime * 0.6) * 0.05 + p * 0.3;
      const t = p * (PALETTE.length - 1);
      const i = Math.min(PALETTE.length - 2, Math.floor(t));
      color.copy(PALETTE[i]).lerp(PALETTE[i + 1], t - i);
      // тёмная база + слабое свечение: иначе emissive забивает отражения и шар плоский
      mat.current.color.copy(color).multiplyScalar(0.45);
      mat.current.emissive.copy(color).multiplyScalar(0.05);
    }
  });

  return (
    <group>
      <Icosahedron ref={mesh} args={[0.92, 24]}>
        <MeshDistortMaterial
          ref={mat}
          speed={1.5}
          distort={0.24}
          roughness={0.08}
          metalness={1}
          flatShading={false}
        />
      </Icosahedron>
      {/* каркас поверх — даёт объём там, где нет env-карты */}
      <Icosahedron ref={wire} args={[1.5, 2]}>
        <meshBasicMaterial wireframe color="#a78bfa" transparent opacity={0.22} />
      </Icosahedron>
    </group>
  );
}

function Rings() {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.z += delta * 0.12;
    group.current.rotation.x = 0.5 + scroll.v * 0.9;
    group.current.children.forEach((c, i) => {
      c.rotation.y = state.clock.elapsedTime * (0.15 + i * 0.08);
    });
  });
  return (
    <group ref={group}>
      {[1.35, 1.7, 2.1].map((r, i) => (
        <Torus key={r} args={[r, 0.004, 8, 200]} rotation={[Math.PI / 2 + i * 0.25, 0, 0]}>
          <meshBasicMaterial color="#a78bfa" transparent opacity={0.35 - i * 0.08} />
        </Torus>
      ))}
    </group>
  );
}

function Particles({ count = 900 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // shell distribution, so the core stays readable
      const r = 2.4 + Math.random() * 4.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      a[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      a[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      a[i * 3 + 2] = r * Math.cos(phi);
    }
    return a;
  }, [count]);

  useFrame((state, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * 0.04;
    points.current.rotation.x = -scroll.v * 0.5;
    const m = points.current.material as THREE.PointsMaterial;
    m.opacity = 0.5 + Math.sin(state.clock.elapsedTime) * 0.1;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#c4b5fd"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Сдвигает объект вправо, когда экран широкий: слева живёт текст. */
function Stage({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const target = state.size.width >= 900 ? 1.7 : 0;
    group.current.position.x += (target - group.current.position.x) * 0.25;
    group.current.position.y += (0.15 - group.current.position.y) * 0.08;
  });
  return <group ref={group}>{children}</group>;
}

function Rig() {
  useFrame((state) => {
    const p = scroll.v;
    // pull the camera back and drift it up as the story unfolds
    const targetZ = 7.6 + p * 2.4;
    const targetY = p * 0.85;
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.05;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.05;
    state.camera.position.x += (state.pointer.x * 0.5 - state.camera.position.x) * 0.04;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export function AuroraScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.6], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 5, 3]} intensity={1.6} color="#ffffff" />
      <directionalLight position={[-5, -2, -3]} intensity={2.2} color="#22d3ee" />
      <pointLight position={[-3, 2, 1.5]} intensity={6} distance={9} color="#ec4899" />
      <Stage>
        <Environment resolution={256}>
        <Lightformer form="rect" intensity={6} color="#ffffff" position={[3, 3, 4]} scale={[6, 6, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={4} color="#7c3aed" position={[-4, 1, 2]} scale={[5, 8, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={3} color="#06b6d4" position={[0, -4, 2]} scale={[8, 4, 1]} target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={5} color="#ec4899" position={[2, -1, -3]} scale={4} target={[0, 0, 0]} />
      </Environment>
      <Core />
        <Rings />
      </Stage>
      <Particles />
      <Rig />
      <fog attach="fog" args={["#05030f", 11, 24]} />
    </Canvas>
  );
}
