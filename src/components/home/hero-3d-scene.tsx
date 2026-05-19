"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, Icosahedron, Torus, Octahedron, MeshDistortMaterial } from "@react-three/drei";
import { Suspense, useRef, useMemo } from "react";
import * as THREE from "three";

function LyokoCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.15;
      meshRef.current.rotation.y = t * 0.2;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = -t * 0.3;
      innerRef.current.rotation.z = t * 0.25;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2;
      ringRef.current.rotation.z = t * 0.4;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <Icosahedron ref={meshRef} args={[1.8, 2]}>
        <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={0.35} />
      </Icosahedron>

      <Icosahedron ref={innerRef} args={[1.2, 1]}>
        <MeshDistortMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.8}
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.9}
          transparent
          opacity={0.6}
        />
      </Icosahedron>

      <Torus ref={ringRef} args={[2.6, 0.02, 16, 100]}>
        <meshBasicMaterial color="#00ff88" transparent opacity={0.6} />
      </Torus>

      <pointLight position={[0, 0, 0]} intensity={2} color="#00d4ff" distance={8} />
    </group>
  );
}

function FloatingShapes() {
  const shapes = useMemo(
    () => [
      { pos: [-4, 2, -2] as [number, number, number], color: "#00ff88", size: 0.3 },
      { pos: [4, -1.5, -1] as [number, number, number], color: "#a855f7", size: 0.4 },
      { pos: [3, 2.5, -3] as [number, number, number], color: "#fbbf24", size: 0.25 },
      { pos: [-3.5, -2, -2] as [number, number, number], color: "#00d4ff", size: 0.35 },
      { pos: [-2, 3, -4] as [number, number, number], color: "#ff2244", size: 0.28 },
      { pos: [2.5, -3, -3] as [number, number, number], color: "#00ff88", size: 0.32 },
    ],
    []
  );

  return (
    <>
      {shapes.map((s, i) => (
        <Float key={i} speed={1.5 + i * 0.2} rotationIntensity={1.5} floatIntensity={2}>
          <Octahedron args={[s.size, 0]} position={s.pos}>
            <meshBasicMaterial color={s.color} wireframe transparent opacity={0.7} />
          </Octahedron>
        </Float>
      ))}
    </>
  );
}

function GridFloor() {
  const ref = useRef<THREE.GridHelper>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.z = (state.clock.elapsedTime * 0.5) % 2;
    }
  });
  return (
    <gridHelper
      ref={ref}
      args={[40, 40, "#00d4ff", "#001a33"]}
      position={[0, -3.5, 0]}
    />
  );
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const x = state.pointer.x * 0.3;
      const y = state.pointer.y * 0.2;
      groupRef.current.rotation.y += (x - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (-y - groupRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} color="#00d4ff" />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#a855f7" />

      <Stars radius={60} depth={40} count={3000} factor={4} saturation={0} fade speed={1} />

      <LyokoCore />
      <FloatingShapes />
      <GridFloor />

      <fog attach="fog" args={["#050a18", 6, 18]} />
    </group>
  );
}

export function Hero3DScene() {
  return (
    <div className="absolute inset-0 -z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
