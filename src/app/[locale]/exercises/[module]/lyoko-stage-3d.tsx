"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Grid, Float, Text, Torus, Capsule, RoundedBox, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { Suspense, useEffect } from "react";
import { type GameState, type LevelDef, type HeroId, COLS, ROWS } from "@/lib/lyoko-engine";

const CELL = 2;

// ═══ TOON GRADIENT (3 bands: shadow / mid / light) ═══
function useToon() {
    return useMemo(() => {
        const d = new Uint8Array([50, 50, 80, 255, 140, 140, 170, 255, 255, 255, 255, 255]);
        const t = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat);
        t.minFilter = t.magFilter = THREE.NearestFilter;
        t.needsUpdate = true;
        return t;
    }, []);
}

function M({ color, g, emissive, ei = 0 }: { color: string; g: THREE.DataTexture; emissive?: string; ei?: number }) {
    return <meshToonMaterial color={color} gradientMap={g} emissive={emissive ?? "#000"} emissiveIntensity={ei} />;
}
function Outline({ s = 1.05 }: { s?: number }) {
    return <mesh scale={s}><meshBasicMaterial color="#000000" side={THREE.BackSide} transparent opacity={0.6} /></mesh>;
}

// ═══ CAMERA CONTROLLER ═══
import { useThree } from "@react-three/fiber";

function CameraController({ targetX, targetZ, prevX, prevZ, animProgress }: { targetX: number, targetZ: number, prevX: number, prevZ: number, animProgress: number }) {
    const { camera, controls } = useThree();
    const lastTarget = useRef(new THREE.Vector3(prevX, 0, prevZ));

    useFrame(() => {
        if (!controls) return;
        const orbit = controls as any;

        // Calculate exact visual position of the hero
        const interpX = THREE.MathUtils.lerp(prevX, targetX, animProgress);
        const interpZ = THREE.MathUtils.lerp(prevZ, targetZ, animProgress);
        const currentCenter = new THREE.Vector3(interpX, 0, interpZ);

        // Get current relative offset from target
        const offset = camera.position.clone().sub(orbit.target);

        // Force strict camera lock onto the hero
        orbit.target.copy(currentCenter);
        camera.position.copy(currentCenter).add(offset);
        orbit.update();
    });
    return null;
}

// ═══ DAY/NIGHT CYCLE (ENVIRONMENT) ═══
function EnvironmentLighting() {
    const { scene } = useThree();
    const ambientRef = useRef<THREE.AmbientLight>(null);
    const dirRef = useRef<THREE.DirectionalLight>(null);

    // Create initial fog if it doesn't exist
    useMemo(() => {
        scene.background = new THREE.Color("#000000");
        scene.fog = new THREE.Fog("#020b06", 5, 25);
    }, [scene]);

    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        // 3 minutes cycle = 180 seconds.
        const cycle = (t % 180) / 180;
        // Use cos to easily oscillate between 1 (day) and 0 (night)
        const timeFactor = Math.pow((Math.cos(cycle * Math.PI * 2) + 1) / 2, 1.5);

        const dayFog = new THREE.Color("#021206");
        const nightFog = new THREE.Color("#010205");

        if (scene.fog) {
            (scene.fog as THREE.Fog).color.copy(nightFog).lerp(dayFog, timeFactor);
        }

        if (ambientRef.current) {
            ambientRef.current.intensity = 0.15 + timeFactor * 0.45;
            ambientRef.current.color.set("#0044aa").lerp(new THREE.Color("#00ff66"), timeFactor);
        }
        if (dirRef.current) {
            dirRef.current.intensity = 0.2 + timeFactor * 1.5;
            dirRef.current.color.set("#221144").lerp(new THREE.Color("#e6f2ff"), timeFactor);
        }
    });

    return (
        <>
            <ambientLight ref={ambientRef} intensity={0.5} color="#00ff66" />
            <directionalLight ref={dirRef} position={[10, 20, 10]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
            <pointLight position={[(COLS / 2) * CELL, 5, (ROWS / 2) * CELL]} intensity={0.4} color="#00ff66" distance={15} />
        </>
    );
}

// ═══ ANIME EYE ═══
function AnimeEye({ x, color = "#333" }: { x: number; color?: string }) {
    return (
        <group position={[x, 0, 0]}>
            {/* White */}
            <mesh><boxGeometry args={[0.11, 0.095, 0.01]} /><meshBasicMaterial color="#f0f0f8" /></mesh>
            {/* Iris */}
            <mesh position={[0, 0, 0.003]}><boxGeometry args={[0.09, 0.082, 0.01]} /><meshBasicMaterial color={color} /></mesh>
            {/* Pupil */}
            <mesh position={[0.01, -0.01, 0.006]}><boxGeometry args={[0.04, 0.045, 0.01]} /><meshBasicMaterial color="#000" /></mesh>
            {/* Highlight */}
            <mesh position={[-0.02, 0.02, 0.009]}><boxGeometry args={[0.025, 0.025, 0.01]} /><meshBasicMaterial color="#ffffffee" /></mesh>
            {/* Upper lash */}
            <mesh position={[0, 0.053, 0.003]}><boxGeometry args={[0.13, 0.016, 0.01]} /><meshBasicMaterial color="#111" /></mesh>
        </group>
    );
}

// ═══ EXTERNAL GLTF CHARACTER LOADER ═══
// Error boundary to catch useGLTF failures without crashing the entire canvas
class GLTFErrorBoundary extends React.Component<{ fallback: React.ReactNode, children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(err: any) { console.warn("External GLTF model failed to load:", err); }
    render() {
        if (this.state.hasError) return this.props.fallback;
        return this.props.children;
    }
}

function ExternalCharacterModel({ modelPath }: { modelPath: string }) {
    const group = useRef<THREE.Group>(null);
    const { scene, animations } = useGLTF(modelPath) as any;
    const { actions } = useAnimations(animations, group);

    useEffect(() => {
        if (actions && Object.keys(actions).length > 0) {
            // Play the first available animation
            const firstAction = Object.values(actions)[0];
            if (firstAction) {
                firstAction.reset().fadeIn(0.5).play();
            }
        }
    }, [actions]);

    const clonedScene = useMemo(() => {
        const clone = scene.clone();
        // Lyoko lighting material adjustments
        clone.traverse((child: any) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                    child.material.metalness = Math.min(child.material.metalness || 0.5, 0.8);
                    child.material.roughness = Math.max(child.material.roughness || 0.5, 0.2);
                }
            }
        });
        return clone;
    }, [scene]);

    // Bionicle model scale adjustment
    return (
        <group ref={group} scale={1.2} position={[0, 0, 0]}>
            <primitive object={clonedScene} />
        </group>
    );
}

// ═══ ULRICH (Fallback Primitive Model) ═══
function UlrichModel({ g }: { g: THREE.DataTexture }) {
    const root = useRef<THREE.Group>(null);
    const torso = useRef<THREE.Group>(null);
    const head = useRef<THREE.Group>(null);
    const armL = useRef<THREE.Group>(null);
    const armR = useRef<THREE.Group>(null);
    const legL = useRef<THREE.Group>(null);
    const legR = useRef<THREE.Group>(null);
    const katana = useRef<THREE.Group>(null);
    useFrame((s, dt) => {
        if (!root.current) return;
        const t = s.clock.elapsedTime;
        // Slow idle rotation so user can see character
        root.current.rotation.y += dt * 0.35;
        // Subtle lateral sway (weight shift)
        root.current.rotation.z = Math.sin(t * 0.9) * 0.025;
        // Breathing: torso rises and falls
        if (torso.current) {
            torso.current.scale.y = 1 + Math.sin(t * 1.8) * 0.025;
            torso.current.position.y = 1.0 + Math.sin(t * 1.8) * 0.018;
        }
        // Head looks around naturally
        if (head.current) {
            head.current.rotation.y = Math.sin(t * 0.7) * 0.28;
            head.current.rotation.z = Math.sin(t * 0.5) * 0.04;
            head.current.rotation.x = Math.sin(t * 0.4) * 0.06;
        }
        // Arms pendulum (opposite phase)
        if (armL.current) {
            armL.current.rotation.x = Math.sin(t * 1.8) * 0.25;
            armL.current.rotation.z = 0.28 + Math.sin(t * 0.9) * 0.05;
        }
        if (armR.current) {
            armR.current.rotation.x = -Math.sin(t * 1.8) * 0.12; // arm with katana: less swing
            armR.current.rotation.z = -0.22 - Math.sin(t * 0.9) * 0.04;
        }
        // Legs: subtle weight shift
        if (legL.current) legL.current.rotation.x = Math.sin(t * 1.8) * 0.08;
        if (legR.current) legR.current.rotation.x = -Math.sin(t * 1.8) * 0.08;
        // Katana idle micro-tremble
        if (katana.current) {
            katana.current.rotation.z = Math.sin(t * 3.5) * 0.04;
            katana.current.rotation.x = -0.35 + Math.sin(t * 2.2) * 0.06;
        }
    });
    return (
        <group ref={root}>
            {/* LEGS — individual refs for stepping */}
            <group ref={legL} position={[-0.19, 0.42, 0]}>
                <Capsule args={[0.1, 0.48, 4, 8]}><M color="#1a1a44" g={g} /></Capsule>
                <Outline />
                <mesh position={[0, -0.34, 0.05]}><boxGeometry args={[0.21, 0.17, 0.3]} /><M color="#111122" g={g} /></mesh>
            </group>
            <group ref={legR} position={[0.19, 0.42, 0]}>
                <Capsule args={[0.1, 0.48, 4, 8]}><M color="#1a1a44" g={g} /></Capsule>
                <Outline />
                <mesh position={[0, -0.34, 0.05]}><boxGeometry args={[0.21, 0.17, 0.3]} /><M color="#111122" g={g} /></mesh>
            </group>
            {/* TORSO — animated breathing */}
            <group ref={torso} position={[0, 1.0, 0]}>
                <RoundedBox args={[0.6, 0.65, 0.34]} radius={0.04}><M color="#d4a017" g={g} /></RoundedBox>
                <Outline />
                {/* Chest V */}
                <mesh position={[0, 0.08, 0.18]}><boxGeometry args={[0.3, 0.32, 0.01]} /><M color="#b08010" g={g} /></mesh>
                {/* Belt */}
                <mesh position={[0, -0.3, 0]}><boxGeometry args={[0.62, 0.1, 0.36]} /><M color="#5a3a00" g={g} /></mesh>
                {/* Shoulder pads */}
                {[-0.42, 0.42].map((x, i) => (
                    <mesh key={i} position={[x, 0.2, 0]} rotation={[0, 0, i === 0 ? 0.4 : -0.4]}>
                        <boxGeometry args={[0.24, 0.1, 0.32]} /><M color="#c09010" g={g} />
                    </mesh>
                ))}
            </group>
            {/* LEFT ARM — animated pendulum */}
            <group ref={armL} position={[-0.46, 0.93, 0]} rotation={[0, 0, 0.28]}>
                <Capsule args={[0.09, 0.42, 4, 8]}><M color="#d4a017" g={g} /></Capsule>
                <mesh position={[0, -0.3, 0]}><sphereGeometry args={[0.1, 8, 8]} /><M color="#e8c880" g={g} /></mesh>
            </group>
            {/* RIGHT ARM + KATANA — animated with katana */}
            <group ref={armR} position={[0.46, 0.93, 0]} rotation={[0, 0, -0.22]}>
                <Capsule args={[0.09, 0.42, 4, 8]}><M color="#d4a017" g={g} /></Capsule>
                {/* Hand — grip point */}
                <mesh position={[0, -0.3, 0]}><sphereGeometry args={[0.1, 8, 8]} /><M color="#e8c880" g={g} /></mesh>
                {/* KATANA — enhanced details */}
                <group ref={katana} position={[0, -0.32, 0]} rotation={[-0.35, 0.1, 0]}>
                    {/* Handle (manche) in the fist */}
                    <mesh position={[0, 0, 0]}>
                        <cylinderGeometry args={[0.032, 0.032, 0.44, 12]} />
                        <meshStandardMaterial color="#3a1a00" roughness={0.9} />
                    </mesh>
                    {/* Handle wrapping detail (tsuka-ito) */}
                    <mesh position={[0, 0, 0]}>
                        <cylinderGeometry args={[0.035, 0.035, 0.38, 6]} />
                        <meshStandardMaterial color="#d4a017" roughness={0.6} wireframe />
                    </mesh>
                    {/* Pommel */}
                    <mesh position={[0, -0.22, 0]}>
                        <sphereGeometry args={[0.045, 8, 8]} />
                        <meshStandardMaterial color="#aaaaaa" metalness={0.9} />
                    </mesh>
                    {/* Tsuba (guard) */}
                    <mesh position={[0, 0.24, 0]}>
                        <cylinderGeometry args={[0.08, 0.08, 0.045, 8]} />
                        <meshStandardMaterial color="#666666" metalness={1} roughness={0.2} />
                    </mesh>
                    {/* Blade — Digital glowing Katana */}
                    <mesh position={[0, 0.78, 0]}>
                        <boxGeometry args={[0.028, 0.95, 0.06]} />
                        <meshStandardMaterial color="#ffffff" metalness={1} roughness={0} emissive="#00ddff" emissiveIntensity={2.5} />
                    </mesh>
                    <mesh position={[0, 0.78, 0.02]}>
                        <boxGeometry args={[0.035, 0.95, 0.015]} />
                        <meshStandardMaterial color="#aaccff" metalness={0.9} emissive="#0055ff" emissiveIntensity={1.5} />
                    </mesh>
                    {/* Blade tip */}
                    <mesh position={[0, 1.3, 0]}>
                        <coneGeometry args={[0.015, 0.16, 4]} />
                        <meshStandardMaterial color="#ffffff" metalness={1} roughness={0} emissive="#00eeff" emissiveIntensity={3} />
                    </mesh>
                    <pointLight position={[0, 0.9, 0]} intensity={8} color="#00ccff" distance={3.5} />
                </group>
            </group>
            {/* HEAD — looks around */}
            <group ref={head} position={[0, 1.63, 0]}>
                <RoundedBox args={[0.42, 0.46, 0.38]} radius={0.06}><M color="#f0c8a0" g={g} /></RoundedBox>
                <Outline />
                {/* Hair — swept sides + back */}
                <mesh position={[0, 0.21, 0]}><boxGeometry args={[0.44, 0.2, 0.42]} /><M color="#3d1f0a" g={g} /></mesh>
                <mesh position={[0, 0.3, -0.15]} rotation={[0.25, 0, 0]}><boxGeometry args={[0.4, 0.14, 0.22]} /><M color="#3d1f0a" g={g} /></mesh>
                <mesh position={[-0.24, 0.08, 0]} rotation={[0, 0, -0.3]}><boxGeometry args={[0.08, 0.28, 0.12]} /><M color="#3d1f0a" g={g} /></mesh>
                <mesh position={[0.24, 0.08, 0]} rotation={[0, 0, 0.3]}><boxGeometry args={[0.08, 0.28, 0.12]} /><M color="#3d1f0a" g={g} /></mesh>
                {/* Brown eyebrows (serious look) */}
                <mesh position={[-0.12, 0.14, 0.2]}><boxGeometry args={[0.1, 0.022, 0.01]} /><meshBasicMaterial color="#2d1205" /></mesh>
                <mesh position={[0.12, 0.14, 0.2]} rotation={[0, 0, 0.1]}><boxGeometry args={[0.1, 0.022, 0.01]} /><meshBasicMaterial color="#2d1205" /></mesh>
                {/* Eyes */}
                <group position={[0, 0.04, 0.2]}>
                    <AnimeEye x={-0.12} color="#3a5fa0" />
                    <AnimeEye x={0.12} color="#3a5fa0" />
                </group>
                {/* Nose */}
                <mesh position={[0, -0.05, 0.2]}><boxGeometry args={[0.025, 0.04, 0.01]} /><meshBasicMaterial color="#d4a080" /></mesh>
                {/* Determined mouth */}
                <mesh position={[0, -0.13, 0.2]}><boxGeometry args={[0.12, 0.02, 0.01]} /><meshBasicMaterial color="#c07050" /></mesh>
            </group>
        </group>
    );
}

// ═══ AELITA ═══
function AelitaModel({ g }: { g: THREE.DataTexture }) {
    const root = useRef<THREE.Group>(null);
    const torso = useRef<THREE.Group>(null);
    const head = useRef<THREE.Group>(null);
    const armL = useRef<THREE.Group>(null);
    const armR = useRef<THREE.Group>(null);
    useFrame((s, dt) => {
        if (!root.current) return;
        const t = s.clock.elapsedTime;
        root.current.rotation.y += dt * 0.35;
        // Gentle floating — Aelita is light and magic
        root.current.position.y = Math.sin(t * 1.4) * 0.06;
        root.current.rotation.z = Math.sin(t * 0.6) * 0.02;
        // Breathing
        if (torso.current) {
            torso.current.scale.y = 1 + Math.sin(t * 1.6) * 0.028;
            torso.current.position.y = 1.06 + Math.sin(t * 1.6) * 0.02;
        }
        // Head: curious tilt, looking around gracefully
        if (head.current) {
            head.current.rotation.y = Math.sin(t * 0.6) * 0.32;
            head.current.rotation.z = Math.sin(t * 0.9) * 0.08;
            head.current.rotation.x = Math.sin(t * 0.45) * 0.07;
        }
        // Arms: graceful fairy-like floating
        if (armL.current) {
            armL.current.rotation.x = Math.sin(t * 1.4 + 0.5) * 0.3;
            armL.current.rotation.z = 0.28 + Math.sin(t * 0.8) * 0.12;
        }
        if (armR.current) {
            armR.current.rotation.x = Math.sin(t * 1.4) * 0.3;
            armR.current.rotation.z = -0.28 - Math.sin(t * 0.8) * 0.12;
        }
    });
    return (
        <group ref={root}>
            {/* Dress layers */}
            <group position={[0, 0.52, 0]}>
                <mesh><cylinderGeometry args={[0.44, 0.3, 0.78, 10]} /><M color="#fce7f3" g={g} /></mesh>
                <Outline />
                <mesh position={[0, -0.35, 0]}><cylinderGeometry args={[0.45, 0.45, 0.07, 10]} /><M color="#e879f9" g={g} /></mesh>
                {/* Dress detail bands */}
                {[0.1, -0.1].map((y, i) => (
                    <mesh key={i} position={[0, y, 0]}><cylinderGeometry args={[0.432, 0.432, 0.03, 10]} /><M color="#f9a8d4" g={g} /></mesh>
                ))}
            </group>
            {/* Torso — breathing */}
            <group ref={torso} position={[0, 1.06, 0]}>
                <RoundedBox args={[0.46, 0.48, 0.3]} radius={0.05}><M color="#fce7f3" g={g} /></RoundedBox>
                <Outline />
                <mesh position={[0, 0.06, 0.16]}><boxGeometry args={[0.32, 0.28, 0.01]} /><M color="#f9a8d4" g={g} /></mesh>
                {/* Collar */}
                <mesh position={[0, 0.22, 0]}><cylinderGeometry args={[0.16, 0.2, 0.08, 8]} /><M color="#e879f9" g={g} /></mesh>
            </group>
            {/* Arms — graceful fairy movement */}
            <group ref={armL} position={[-0.36, 1.0, 0]} rotation={[0, 0, 0.28]}>
                <Capsule args={[0.075, 0.46, 4, 8]}><M color="#fde8d8" g={g} /></Capsule>
                <mesh position={[0, -0.29, 0]}><sphereGeometry args={[0.085, 8, 8]} /><M color="#fde8d8" g={g} /></mesh>
                <mesh position={[0, -0.35, 0]}><sphereGeometry args={[0.09, 8, 8]} /><M color="#f9a8d4" g={g} /></mesh>
            </group>
            <group ref={armR} position={[0.36, 1.0, 0]} rotation={[0, 0, -0.28]}>
                <Capsule args={[0.075, 0.46, 4, 8]}><M color="#fde8d8" g={g} /></Capsule>
                <mesh position={[0, -0.29, 0]}><sphereGeometry args={[0.085, 8, 8]} /><M color="#fde8d8" g={g} /></mesh>
                <mesh position={[0, -0.35, 0]}><sphereGeometry args={[0.09, 8, 8]} /><M color="#f9a8d4" g={g} /></mesh>
            </group>
            {/* Boots */}
            {[-0.14, 0.14].map((x, i) => (
                <group key={i} position={[x, 0.12, 0]}>
                    <Capsule args={[0.09, 0.3, 4, 8]}><M color="#c084fc" g={g} /></Capsule>
                    <mesh position={[0, -0.22, 0.03]}><boxGeometry args={[0.2, 0.16, 0.28]} /><M color="#7c3aed" g={g} /></mesh>
                </group>
            ))}
            {/* Holographic Fairy Wings */}
            <group position={[0, 1.25, -0.16]}>
                {[-1, 1].map(s => (
                    <group key={s} rotation={[0, s * -0.3, 0]}>
                        {/* Wing animations uses the same fairy timing */}
                        <mesh position={[s * 0.3, 0, 0]} rotation={[0, 0, s * -0.5]}>
                            <planeGeometry args={[0.5, 0.9]} />
                            <meshStandardMaterial
                                color="#ffb3e6"
                                emissive="#ff69b4"
                                emissiveIntensity={2.5}
                                transparent
                                opacity={0.35}
                                side={THREE.DoubleSide}
                                depthWrite={false}
                            />
                        </mesh>
                        <mesh position={[s * 0.2, -0.3, 0]} rotation={[0, 0, s * -0.7]}>
                            <planeGeometry args={[0.3, 0.6]} />
                            <meshStandardMaterial
                                color="#ff99dd"
                                emissive="#ff1493"
                                emissiveIntensity={1.5}
                                transparent
                                opacity={0.25}
                                side={THREE.DoubleSide}
                                depthWrite={false}
                            />
                        </mesh>
                    </group>
                ))}
            </group>
            {/* HEAD — looks around gracefully */}
            <group ref={head} position={[0, 1.68, 0]}>
                <RoundedBox args={[0.38, 0.44, 0.36]} radius={0.07}><M color="#fde8d8" g={g} /></RoundedBox>
                <Outline />
                {/* Multi-layer pink hair */}
                <mesh position={[0, 0.2, 0]}><boxGeometry args={[0.4, 0.19, 0.38]} /><M color="#f472b6" g={g} /></mesh>
                <mesh position={[0, 0.3, 0]}><sphereGeometry args={[0.2, 8, 6]} /><M color="#ec4899" g={g} /></mesh>
                <mesh position={[0, 0.1, -0.2]} rotation={[-0.2, 0, 0]}><boxGeometry args={[0.36, 0.36, 0.14]} /><M color="#f472b6" g={g} /></mesh>
                {[-0.24, 0.24].map((x, i) => (
                    <mesh key={i} position={[x, -0.04, 0]}><boxGeometry args={[0.065, 0.35, 0.14]} /><M color="#f472b6" g={g} /></mesh>
                ))}
                {/* Elf ears */}
                {[-1, 1].map(s => (
                    <group key={s} position={[s * 0.21, 0.03, 0]}>
                        <mesh rotation={[0, 0, s * -0.5]}>
                            <coneGeometry args={[0.055, 0.25, 6]} /><M color="#fde8d8" g={g} />
                        </mesh>
                        <mesh rotation={[0, 0, s * -0.5]} position={[s * 0.01, 0.05, 0]}>
                            <coneGeometry args={[0.035, 0.18, 5]} /><M color="#fcc5b5" g={g} />
                        </mesh>
                    </group>
                ))}
                {/* Eyebrows */}
                {[-0.12, 0.12].map((x, i) => (
                    <mesh key={i} position={[x, 0.15, 0.19]}><boxGeometry args={[0.1, 0.02, 0.01]} /><meshBasicMaterial color="#c06090" /></mesh>
                ))}
                {/* Big anime eyes */}
                <group position={[0, 0.05, 0.19]}>
                    <AnimeEye x={-0.12} color="#10b981" />
                    <AnimeEye x={0.12} color="#10b981" />
                </group>
                {/* Nose + Smile */}
                <mesh position={[0, -0.06, 0.19]}><boxGeometry args={[0.02, 0.035, 0.01]} /><meshBasicMaterial color="#e8a080" /></mesh>
                <mesh position={[0, -0.15, 0.19]} rotation={[0, 0, 0.05]}><boxGeometry args={[0.09, 0.022, 0.01]} /><meshBasicMaterial color="#e8906a" /></mesh>
            </group>
            <pointLight position={[0, 2, 0.5]} intensity={6} color="#f472b6" distance={5} />
        </group>
    );
}

// ═══ YUMI ═══
function YumiModel({ g }: { g: THREE.DataTexture }) {
    const root = useRef<THREE.Group>(null);
    const torso = useRef<THREE.Group>(null);
    const head = useRef<THREE.Group>(null);
    const armL = useRef<THREE.Group>(null);
    const armR = useRef<THREE.Group>(null);
    const fanL = useRef<THREE.Group>(null);
    const fanR = useRef<THREE.Group>(null);
    useFrame((s, dt) => {
        if (!root.current) return;
        const t = s.clock.elapsedTime;
        root.current.rotation.y += dt * 0.35;
        // Yumi: controlled, precise — minimal body sway
        root.current.position.y = Math.sin(t * 1.6) * 0.035;
        root.current.rotation.z = Math.sin(t * 0.5) * 0.015;
        // Breathing: subtle, controlled
        if (torso.current) {
            torso.current.scale.y = 1 + Math.sin(t * 1.5) * 0.02;
            torso.current.position.y = 1.02 + Math.sin(t * 1.5) * 0.015;
        }
        // Head: proud, scans the battlefield slowly
        if (head.current) {
            head.current.rotation.y = Math.sin(t * 0.5) * 0.22;
            head.current.rotation.z = Math.sin(t * 0.35) * 0.04;
            head.current.rotation.x = Math.sin(t * 0.3) * 0.04;
        }
        // Arms: precise ninja combat stance — minimal but sharp
        if (armL.current) {
            armL.current.rotation.x = Math.sin(t * 1.5 + 0.8) * 0.18;
            armL.current.rotation.z = 0.26 + Math.sin(t * 0.7) * 0.06;
        }
        if (armR.current) {
            armR.current.rotation.x = Math.sin(t * 1.5) * 0.18;
            armR.current.rotation.z = -0.26 - Math.sin(t * 0.7) * 0.06;
        }
        // Fans swing dynamically
        const swing = Math.sin(t * 2.2) * 0.25;
        if (fanL.current) fanL.current.rotation.z = swing + 0.5;
        if (fanR.current) fanR.current.rotation.z = -swing - 0.5;
    });
    return (
        <group ref={root}>
            {/* Pants/legs */}
            {[-0.17, 0.17].map((x, i) => (
                <group key={i} position={[x, 0.44, 0]}>
                    <Capsule args={[0.1, 0.5, 4, 8]}><M color="#111" g={g} /></Capsule>
                    <mesh position={[0, -0.35, 0.04]}><boxGeometry args={[0.2, 0.16, 0.28]} /><M color="#0a0a0a" g={g} /></mesh>
                </group>
            ))}
            {/* Torso + obi — breathing */}
            <group ref={torso} position={[0, 1.02, 0]}>
                <RoundedBox args={[0.5, 0.58, 0.3]} radius={0.04}><M color="#111" g={g} /></RoundedBox>
                <Outline />
                <mesh position={[0, -0.24, 0]}><boxGeometry args={[0.52, 0.12, 0.32]} /><M color="#cc0000" g={g} /></mesh>
                <mesh position={[0, -0.18, 0.16]}><boxGeometry args={[0.18, 0.1, 0.01]} /><M color="#dd0000" g={g} /></mesh>
                {/* Collar V */}
                <mesh position={[0, 0.22, 0.15]} rotation={[0.1, 0, 0]}><boxGeometry args={[0.2, 0.08, 0.01]} /><M color="#cc0000" g={g} /></mesh>
            </group>
            {/* Arms — ninja precision pendulum */}
            <group ref={armL} position={[-0.37, 0.97, 0]} rotation={[0, 0, 0.26]}>
                <Capsule args={[0.085, 0.44, 4, 8]}><M color="#111" g={g} /></Capsule>
                <mesh position={[0, -0.28, 0]}><sphereGeometry args={[0.09, 8, 8]} /><M color="#f0c8a0" g={g} /></mesh>
            </group>
            <group ref={armR} position={[0.37, 0.97, 0]} rotation={[0, 0, -0.26]}>
                <Capsule args={[0.085, 0.44, 4, 8]}><M color="#111" g={g} /></Capsule>
                <mesh position={[0, -0.28, 0]}><sphereGeometry args={[0.09, 8, 8]} /><M color="#f0c8a0" g={g} /></mesh>
            </group>
            {/* Animated Fans (Tessens) - Larger and more prominent */}
            {[[-1, fanL], [1, fanR]].map(([side, ref], idx) => (
                <group key={idx} ref={ref as React.RefObject<THREE.Group>} position={[(side as number) * 0.65, 0.88, 0]}>
                    {[0, 1, 2, 3, 4, 5, 6].map(i => (
                        <mesh key={i} rotation={[0, 0, (i / 6) * 2.0 - 1.0]} position={[(side as number) * 0.22, 0, 0]}>
                            <boxGeometry args={[0.45, 0.02, 0.26]} />
                            <meshStandardMaterial color={i % 2 === 0 ? "#cc0000" : "#880000"} emissive="#550000" emissiveIntensity={0.8} />
                        </mesh>
                    ))}
                    {/* Fan blades metal edges */}
                    <mesh position={[(side as number) * 0.44, 0, 0]}>
                        <cylinderGeometry args={[0.27, 0.27, 0.025, 16, 1, false, -1.0, 2.0]} />
                        <meshStandardMaterial color="#aaaaaa" metalness={1} roughness={0.2} emissive="#ffffff" emissiveIntensity={0.5} />
                    </mesh>
                    <mesh position={[(side as number) * 0.01, 0, 0]}><sphereGeometry args={[0.05, 8, 8]} /><meshStandardMaterial color="#aaaaaa" metalness={0.9} /></mesh>
                </group>
            ))}
            {/* HEAD — proud/alert */}
            <group ref={head} position={[0, 1.66, 0]}>
                <RoundedBox args={[0.38, 0.43, 0.35]} radius={0.06}><M color="#f0c8a0" g={g} /></RoundedBox>
                <Outline />
                {/* Hair bun */}
                <mesh position={[0, 0.22, 0]}><sphereGeometry args={[0.22, 10, 10]} /><M color="#111" g={g} /></mesh>
                <mesh position={[0, 0.34, 0]}><sphereGeometry args={[0.11, 8, 8]} /><M color="#222" g={g} /></mesh>
                <mesh position={[0, 0.18, -0.14]}><boxGeometry args={[0.3, 0.2, 0.1]} /><M color="#111" g={g} /></mesh>
                {/* Side strands */}
                {[-0.22, 0.22].map((x, i) => (
                    <mesh key={i} position={[x, 0, 0]}><boxGeometry args={[0.06, 0.22, 0.1]} /><M color="#111" g={g} /></mesh>
                ))}
                {/* Eyebrows */}
                {[-0.1, 0.1].map((x, i) => (
                    <mesh key={i} position={[x, 0.14, 0.18]}><boxGeometry args={[0.1, 0.022, 0.01]} /><meshBasicMaterial color="#111" /></mesh>
                ))}
                <group position={[0, 0.04, 0.18]}>
                    <AnimeEye x={-0.11} color="#6b21a8" />
                    <AnimeEye x={0.11} color="#6b21a8" />
                </group>
                <mesh position={[0, -0.14, 0.18]}><boxGeometry args={[0.1, 0.02, 0.01]} /><meshBasicMaterial color="#c07850" /></mesh>
            </group>
        </group>
    );
}

// ═══ ODD ═══
function OddModel({ g }: { g: THREE.DataTexture }) {
    const root = useRef<THREE.Group>(null);
    const torso = useRef<THREE.Group>(null);
    const head = useRef<THREE.Group>(null);
    const armL = useRef<THREE.Group>(null);
    const armR = useRef<THREE.Group>(null);
    const tail = useRef<THREE.Group>(null);
    const arrowL = useRef<THREE.Mesh>(null);
    const arrowR = useRef<THREE.Mesh>(null);
    useFrame((s, dt) => {
        if (!root.current) return;
        const t = s.clock.elapsedTime;
        root.current.rotation.y += dt * 0.35;
        // Odd bounces — super energetic!
        root.current.position.y = Math.abs(Math.sin(t * 3.0)) * 0.065;
        root.current.rotation.z = Math.sin(t * 1.3) * 0.03;
        // Breathing: fast (he runs a lot)
        if (torso.current) {
            torso.current.scale.y = 1 + Math.sin(t * 2.4) * 0.03;
            torso.current.position.y = 0.98 + Math.sin(t * 2.4) * 0.02;
        }
        // Head: playful, looks around fast
        if (head.current) {
            head.current.rotation.y = Math.sin(t * 1.2) * 0.38;
            head.current.rotation.z = Math.sin(t * 1.6) * 0.1;
            head.current.rotation.x = Math.sin(t * 0.9) * 0.08;
        }
        // Arms: big energetic swing (he runs and fights aggressively)
        if (armL.current) {
            armL.current.rotation.x = Math.sin(t * 3.0) * 0.45;
            armL.current.rotation.z = 0.3 + Math.sin(t * 1.2) * 0.1;
        }
        if (armR.current) {
            armR.current.rotation.x = -Math.sin(t * 3.0) * 0.45;
            armR.current.rotation.z = -0.3 - Math.sin(t * 1.2) * 0.1;
        }
        // Vivid tail wag
        if (tail.current) tail.current.rotation.z = Math.sin(t * 4.0) * 0.55;
        // Pulsing arrows
        const glow = 1.5 + Math.sin(t * 5) * 0.8;
        if (arrowL.current) (arrowL.current.material as THREE.MeshStandardMaterial).emissiveIntensity = glow;
        if (arrowR.current) (arrowR.current.material as THREE.MeshStandardMaterial).emissiveIntensity = glow;
    });
    return (
        <group ref={root}>
            {[-0.17, 0.17].map((x, i) => (
                <group key={i} position={[x, 0.44, 0]}>
                    <Capsule args={[0.1, 0.5, 4, 8]}><M color="#4c1d95" g={g} /></Capsule>
                    <mesh position={[0, -0.35, 0.04]}><boxGeometry args={[0.2, 0.16, 0.28]} /><M color="#2e0f6e" g={g} /></mesh>
                </group>
            ))}
            {/* Pattern spots on legs */}
            {[[-0.17, 0.3, 0.11], [0.17, 0.5, 0.11], [-0.17, 0.55, 0.11], [0.17, 0.35, 0.11]].map(([x, y, z], i) => (
                <mesh key={i} position={[x, y, z]}><boxGeometry args={[0.06, 0.06, 0.01]} /><meshBasicMaterial color="#7c3aed" /></mesh>
            ))}
            {/* Arrow launchers on wrists */}
            <mesh ref={arrowL} position={[-0.56, 0.62, 0]} rotation={[0, 0, 0.3]}>
                <cylinderGeometry args={[0.04, 0.02, 0.22, 6]} />
                <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2} />
            </mesh>
            <mesh ref={arrowR} position={[0.56, 0.62, 0]} rotation={[0, 0, -0.3]}>
                <cylinderGeometry args={[0.04, 0.02, 0.22, 6]} />
                <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2} />
            </mesh>
            {/* Torso — breathing */}
            <group ref={torso} position={[0, 0.98, 0]}>
                <RoundedBox args={[0.54, 0.6, 0.32]} radius={0.05}><M color="#7c3aed" g={g} /></RoundedBox>
                <Outline />
                {/* Arrow patterns */}
                {[0.15, 0, -0.15].map((y, i) => (
                    <mesh key={i} position={[0, y, 0.17]}>
                        <cylinderGeometry args={[0.01, 0.07, 0.09, 3]} />
                        <meshBasicMaterial color="#fbbf24" />
                    </mesh>
                ))}
                {/* Leopard spots */}
                {[[-0.15, 0.1], [0.15, -0.05], [-0.18, -0.15]].map(([x, y], i) => (
                    <mesh key={i} position={[x, y, 0.17]}><boxGeometry args={[0.05, 0.05, 0.01]} /><meshBasicMaterial color="#a855f7" /></mesh>
                ))}
            </group>
            {/* Arms — energetic swing */}
            <group ref={armL} position={[-0.4, 0.95, 0]} rotation={[0, 0, 0.3]}>
                <Capsule args={[0.09, 0.44, 4, 8]}><M color="#7c3aed" g={g} /></Capsule>
                <mesh position={[0, -0.28, 0]}><sphereGeometry args={[0.09, 8, 8]} /><M color="#f5c098" g={g} /></mesh>
            </group>
            <group ref={armR} position={[0.4, 0.95, 0]} rotation={[0, 0, -0.28]}>
                <Capsule args={[0.09, 0.44, 4, 8]}><M color="#7c3aed" g={g} /></Capsule>
                <mesh position={[0, -0.28, 0]}><sphereGeometry args={[0.09, 8, 8]} /><M color="#f5c098" g={g} /></mesh>
            </group>
            {/* Tail */}
            <group ref={tail} position={[0, 0.7, -0.18]}>
                <Capsule args={[0.04, 0.52, 4, 8]} rotation={[-0.5, 0, 0]}>
                    <M color="#6d28d9" g={g} />
                </Capsule>
                {/* Arrow-like tip on tail */}
                <mesh position={[0, -0.4, -0.22]} rotation={[-0.5, 0, 0]}><coneGeometry args={[0.06, 0.16, 4]} /><M color="#fbbf24" g={g} /></mesh>
            </group>
            {/* HEAD — playful, fast-moving */}
            <group ref={head} position={[0, 1.67, 0]}>
                <RoundedBox args={[0.38, 0.42, 0.35]} radius={0.06}><M color="#f5c098" g={g} /></RoundedBox>
                <Outline />
                {/* Cat ears */}
                {[-1, 1].map(s => (
                    <group key={s} position={[s * 0.15, 0.25, 0]}>
                        <mesh rotation={[0, 0, s * 0.25]}><coneGeometry args={[0.075, 0.22, 4]} /><M color="#7c3aed" g={g} /></mesh>
                        <mesh rotation={[0, 0, s * 0.25]} position={[0, 0.02, 0]}><coneGeometry args={[0.04, 0.14, 4]} /><meshBasicMaterial color="#f9a8d4" /></mesh>
                    </group>
                ))}
                {/* Spiky blond hair */}
                {[-0.14, -0.07, 0, 0.07, 0.14].map((x, i) => (
                    <mesh key={i} position={[x, 0.26 + Math.abs(i - 2) * 0.02, 0.06]} rotation={[0, 0, (i - 2) * 0.25]}>
                        <coneGeometry args={[0.04, 0.22, 4]} /><M color="#fbbf24" g={g} />
                    </mesh>
                ))}
                <mesh position={[0, 0.18, 0]}><boxGeometry args={[0.36, 0.1, 0.38]} /><M color="#d4a017" g={g} /></mesh>
                {/* Eyebrows raised */}
                {[-0.1, 0.1].map((x, i) => (
                    <mesh key={i} position={[x, 0.14, 0.18]} rotation={[0, 0, i === 0 ? 0.15 : -0.15]}><boxGeometry args={[0.09, 0.02, 0.01]} /><meshBasicMaterial color="#8B4513" /></mesh>
                ))}
                <group position={[0, 0.04, 0.18]}>
                    <AnimeEye x={-0.11} color="#1e3a8a" />
                    <AnimeEye x={0.11} color="#1e3a8a" />
                </group>
                <mesh position={[0, -0.12, 0.18]}><boxGeometry args={[0.1, 0.03, 0.01]} /><meshBasicMaterial color="#d0905a" /></mesh>
            </group>
        </group>
    );
}

// ═══ BLOK ═══
function BlokModel({ g }: { g: THREE.DataTexture }) {
    const root = useRef<THREE.Group>(null);
    useFrame((_, dt) => {
        if (!root.current) return;
        root.current.rotation.y += dt * 1.0;
        root.current.rotation.x += dt * 0.35;
    });
    const faces: { pos: [number, number, number]; rot: [number, number, number]; color: string }[] = [
        { pos: [0.56, 0, 0], rot: [0, Math.PI / 2, 0], color: "#ff2244" },
        { pos: [-0.56, 0, 0], rot: [0, -Math.PI / 2, 0], color: "#2244ff" },
        { pos: [0, 0, 0.56], rot: [0, 0, 0], color: "#ff6600" },
        { pos: [0, 0, -0.56], rot: [0, Math.PI, 0], color: "#22dd44" },
        { pos: [0, 0.56, 0], rot: [-Math.PI / 2, 0, 0], color: "#ff2244" },
        { pos: [0, -0.56, 0], rot: [Math.PI / 2, 0, 0], color: "#ff2244" },
    ];
    return (
        <group position={[0, 0.8, 0]}>
            <group ref={root}>
                <mesh><boxGeometry args={[1.1, 1.1, 1.1]} /><M color="#0f0f22" g={g} /></mesh>
                {faces.map(({ pos, rot, color }, i) => (
                    <group key={i}>
                        <mesh position={pos} rotation={rot as [number, number, number]}>
                            <circleGeometry args={[0.32, 32]} />
                            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.5} />
                        </mesh>
                        <mesh position={pos} rotation={rot as [number, number, number]}>
                            <ringGeometry args={[0.34, 0.44, 32]} />
                            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} transparent opacity={0.6} />
                        </mesh>
                    </group>
                ))}
                <lineSegments><edgesGeometry args={[new THREE.BoxGeometry(1.12, 1.12, 1.12)]} /><lineBasicMaterial color="#ff4466" /></lineSegments>
            </group>
        </group>
    );
}

// ═══ KANKRELAT ═══
function KankrelatModel({ g }: { g: THREE.DataTexture }) {
    const root = useRef<THREE.Group>(null);
    const legs = useRef<THREE.Group[]>([]);
    useFrame((s) => {
        if (root.current) root.current.position.y = Math.sin(s.clock.elapsedTime * 4) * 0.06;
        legs.current.forEach((leg, i) => {
            if (leg) leg.rotation.z = Math.sin(s.clock.elapsedTime * 5 + i * 1.2) * 0.22;
        });
    });
    return (
        <group ref={root} position={[0, 0.5, 0]}>
            <mesh position={[0.1, 0.22, 0]}><sphereGeometry args={[0.44, 14, 12]} /><M color="#7c3d1a" g={g} /></mesh>
            <mesh position={[0.48, 0.17, 0]}><sphereGeometry args={[0.31, 12, 10]} /><M color="#6a3210" g={g} /></mesh>
            <Outline s={1.04} />
            {/* Shell plates */}
            {[-0.18, 0, 0.18].map((z, i) => (
                <mesh key={i} position={[-0.1 + i * 0.05, 0.5, z * 0.38]} rotation={[-0.3, 0, 0]}>
                    <boxGeometry args={[0.28, 0.09, 0.2]} /><M color="#5a2e10" g={g} />
                </mesh>
            ))}
            {/* Eyes */}
            {[0.1, -0.1].map((z, i) => (
                <mesh key={i} position={[0.72, 0.27, z]}><sphereGeometry args={[0.085, 10, 10]} /><meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={5} /></mesh>
            ))}
            {/* Mandibles */}
            {[-1, 1].map(s => (
                <mesh key={s} position={[0.72, 0.06, s * 0.1]} rotation={[0, 0, s * 0.4]}>
                    <boxGeometry args={[0.18, 0.04, 0.05]} /><M color="#4a2008" g={g} />
                </mesh>
            ))}
            {/* 4 legs each side */}
            {[-1, 1].map(side => [-0.25, 0, 0.15, 0.35].map((xOff, j) => (
                <group key={`${side}${j}`} ref={el => { if (el) legs.current[j + (side > 0 ? 4 : 0)] = el; }}
                    position={[-0.05 + xOff * 0.4, 0.12, side * 0.3]}>
                    <Capsule args={[0.05, 0.42, 4, 8]} rotation={[side * 0.5, 0, 0.3 * side]}>
                        <M color="#7c3d1a" g={g} />
                    </Capsule>
                </group>
            )))}
        </group>
    );
}

// ═══ MEGATANK ═══
function MegatankModel({ g }: { g: THREE.DataTexture }) {
    const shell = useRef<THREE.Group>(null);
    const core = useRef<THREE.Mesh>(null);
    useFrame((s, dt) => {
        if (shell.current) shell.current.rotation.z += dt * 0.7;
        if (core.current) {
            (core.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.5 + Math.sin(s.clock.elapsedTime * 6) * 1.2;
        }
    });
    return (
        <group position={[0, 1.05, 0]}>
            <group ref={shell}>
                <mesh><sphereGeometry args={[0.98, 22, 22]} /><M color="#0d0d0d" g={g} /></mesh>
                <mesh><sphereGeometry args={[1.0, 10, 10]} /><meshStandardMaterial color="#111" wireframe /></mesh>
                {[0, Math.PI / 2, Math.PI / 4].map((r, i) => (
                    <Torus key={i} args={[0.99, 0.09, 12, 64]} rotation={[0, 0, r]}>
                        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={2.5} metalness={0.9} />
                    </Torus>
                ))}
                <lineSegments><edgesGeometry args={[new THREE.IcosahedronGeometry(1.0)]} /><lineBasicMaterial color="#ff3333" /></lineSegments>
            </group>
            <mesh ref={core}><sphereGeometry args={[0.3, 14, 14]} /><meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2} transparent opacity={0.88} /></mesh>
            <pointLight intensity={25} color="#ff0000" distance={7} decay={2} />
        </group>
    );
}

// ═══ TOWER ═══
function TowerModel({ active }: { active: boolean }) {
    const rOut = useRef<THREE.Group>(null);
    const rIn = useRef<THREE.Group>(null);
    useFrame((_, dt) => {
        if (rOut.current) rOut.current.rotation.y += dt * 0.55;
        if (rIn.current) rIn.current.rotation.y -= dt * 0.9;
    });
    const c = active ? "#00ff88" : "#00d4ff";
    const e = active ? 3.5 : 2;
    return (
        <group>
            <mesh position={[0, 0.04, 0]}><cylinderGeometry args={[1.1, 1.3, 0.09, 6]} /><meshStandardMaterial color="#111133" emissive={c} emissiveIntensity={0.6} metalness={0.95} /></mesh>
            <mesh position={[0, 0.14, 0]}><cylinderGeometry args={[0.75, 0.75, 0.07, 6]} /><meshStandardMaterial color="#1a1a44" emissive={c} emissiveIntensity={0.4} /></mesh>
            {/* transparent column */}
            <mesh position={[0, 4.5, 0]}><cylinderGeometry args={[0.24, 0.3, 9, 14, 1, true]} /><meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.3} transparent opacity={0.3} side={THREE.DoubleSide} /></mesh>
            <mesh position={[0, 4.5, 0]}><cylinderGeometry args={[0.085, 0.085, 9, 8]} /><meshStandardMaterial color={c} emissive={c} emissiveIntensity={e} /></mesh>
            <group ref={rOut}>
                {[1.2, 2.6, 4.0, 5.4, 6.8].map((h, i) => (
                    <Torus key={i} args={[0.58 + i * 0.05, 0.04, 8, 64]} position={[0, h, 0]} rotation={[Math.PI / 2, 0, i * 0.5]}>
                        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={e} />
                    </Torus>
                ))}
            </group>
            <group ref={rIn}>
                {[2.0, 3.4, 4.8, 6.2].map((h, i) => (
                    <Torus key={i} args={[0.38, 0.025, 6, 48]} position={[0, h, 0]} rotation={[Math.PI / 3, 0, i * 0.8]}>
                        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={e * 0.7} />
                    </Torus>
                ))}
            </group>
            <mesh position={[0, 9.2, 0]}><coneGeometry args={[0.28, 0.7, 8]} /><meshStandardMaterial color={c} emissive={c} emissiveIntensity={e + 1} /></mesh>
            <pointLight position={[0, 5, 0]} intensity={active ? 55 : 28} color={c} distance={26} decay={2} />
            <pointLight position={[0, 0.5, 0]} intensity={active ? 22 : 12} color={c} distance={12} decay={2} />
        </group>
    );
}

// ═══ LYOKO SECTOR — Forest Sector ═══
// Procedural geometry matching the Code Lyoko animated series aesthetic

// A single polygonal terrain tile (varying heights give the chaotic Lyoko ground feel)
function TerrainTile({ x, z, h, color }: { x: number; z: number; h: number; color: string }) {
    return (
        <mesh position={[x, h / 2, z]} castShadow receiveShadow>
            <boxGeometry args={[CELL - 0.06, h, CELL - 0.06]} />
            <meshStandardMaterial color={color} roughness={0.85} metalness={0.1} />
        </mesh>
    );
}

// Lyoko iconic tree: cylinder trunk + flat disc top (exactly like the show)
function LyokoTree({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
    return (
        <group position={[x, 0, z]}>
            {/* Trunk */}
            <mesh position={[0, 1.6 * scale, 0]}>
                <cylinderGeometry args={[0.22 * scale, 0.28 * scale, 3.2 * scale, 7]} />
                <meshStandardMaterial color="#1a3a1a" roughness={0.9} />
            </mesh>
            {/* Flat disc canopy — Code Lyoko signature */}
            <mesh position={[0, 3.4 * scale, 0]}>
                <cylinderGeometry args={[1.4 * scale, 1.1 * scale, 0.35 * scale, 7]} />
                <meshStandardMaterial color="#0d5c2e" roughness={0.7} emissive="#0a4020" emissiveIntensity={0.3} />
            </mesh>
            {/* Second smaller disc */}
            <mesh position={[0, 4.0 * scale, 0]}>
                <cylinderGeometry args={[0.9 * scale, 1.2 * scale, 0.25 * scale, 7]} />
                <meshStandardMaterial color="#115c30" roughness={0.7} emissive="#0d5025" emissiveIntensity={0.3} />
            </mesh>
            {/* Glow at base */}
            <pointLight position={[0, 1, 0]} intensity={1.5} color="#00ff66" distance={4} decay={3} />
        </group>
    );
}

// Lyoko floating rock (decorative)
function FloatingRock({ x, y, z, s = 1 }: { x: number; y: number; z: number; s?: number }) {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((st) => {
        if (ref.current) ref.current.position.y = y + Math.sin(st.clock.elapsedTime * 0.8 + x) * 0.15;
    });
    return (
        <mesh ref={ref} position={[x, y, z]}>
            <dodecahedronGeometry args={[s, 0]} />
            <meshStandardMaterial color="#1a3a2a" roughness={0.8} metalness={0.2}
                emissive="#003311" emissiveIntensity={0.4} />
        </mesh>
    );
}

// Data stream line (the glowing lines that run across Lyoko's terrain)
function DataStream({ x1, z1, x2, z2 }: { x1: number; z1: number; x2: number; z2: number }) {
    const obj = useMemo(() => {
        const pts = [new THREE.Vector3(x1, 0.05, z1), new THREE.Vector3(x2, 0.05, z2)];
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const mat = new THREE.LineBasicMaterial({ color: "#00ffaa", transparent: true, opacity: 0.7 });
        return new THREE.Line(geo, mat);
    }, [x1, z1, x2, z2]);
    return <primitive object={obj} />;
}

function LyokoForestSector() {
    // Build terrain tiles with varying heights — mimics the chaotic polygon floor of Lyoko
    const tiles = useMemo(() => {
        const result = [];
        // Deterministic pseudo-random based on position
        const noise = (x: number, z: number) => {
            const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
            return s - Math.floor(s);
        };
        for (let gx = -2; gx < COLS + 2; gx++) {
            for (let gz = -2; gz < ROWS + 2; gz++) {
                const n = noise(gx, gz);
                const h = 0.12 + n * 0.28; // varying height 0.12..0.40
                const dark = n < 0.35;
                const color = dark ? "#0a1f0f" : n < 0.65 ? "#0e2a14" : "#122e18";
                result.push({ gx, gz, h, color });
            }
        }
        return result;
    }, []);

    // Tree positions — placed around the playfield edges
    const trees = useMemo(() => {
        const t: { x: number; z: number; s: number }[] = [];
        const noise = (x: number, z: number) => { const s = Math.sin(x * 37.5 + z * 19.7) * 43758.5; return s - Math.floor(s); };
        for (let i = -3; i < COLS + 3; i++) {
            for (let j = -3; j < ROWS + 3; j++) {
                // Only outside the playfield or on the border
                if (i >= 0 && i < COLS && j >= 0 && j < ROWS) continue;
                if (noise(i, j) > 0.45) {
                    t.push({ x: i * CELL, z: j * CELL, s: 0.7 + noise(i + 0.5, j) * 0.7 });
                }
            }
        }
        return t;
    }, []);

    // Floating rocks positions
    const rocks = useMemo(() => [
        { x: -4, y: 4, z: 2, s: 0.6 },
        { x: COLS * CELL + 4, y: 5, z: 4, s: 0.8 },
        { x: -5, y: 6.5, z: ROWS * CELL - 3, s: 0.5 },
        { x: COLS * CELL + 3, y: 3.5, z: ROWS * CELL + 2, s: 0.7 },
        { x: 2, y: 8, z: -5, s: 0.9 },
        { x: COLS * CELL - 2, y: 7, z: -4, s: 0.5 },
    ], []);

    return (
        <group>
            {/* === GROUND TILES === */}
            {tiles.map(({ gx, gz, h, color }) => (
                <TerrainTile key={`${gx}-${gz}`} x={gx * CELL} z={gz * CELL} h={h} color={color} />
            ))}

            {/* === GROUND GLOW PLANE (the characteristic Lyoko green ambient light) === */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[(COLS / 2 - 0.5) * CELL, 0.41, (ROWS / 2 - 0.5) * CELL]}>
                <planeGeometry args={[COLS * CELL * 1.1, ROWS * CELL * 1.1, COLS, ROWS]} />
                <meshStandardMaterial color="#003311" transparent opacity={0.35}
                    emissive="#00ff44" emissiveIntensity={0.08} />
            </mesh>

            {/* === DATA STREAMS (glowing lines across the terrain) === */}
            {[
                [0, 0, COLS * CELL, 0],
                [0, ROWS * CELL, COLS * CELL, ROWS * CELL],
                [0, 0, 0, ROWS * CELL],
                [COLS * CELL, 0, COLS * CELL, ROWS * CELL],
                [COLS * CELL / 2, 0, COLS * CELL / 2, ROWS * CELL],
                [0, ROWS * CELL / 2, COLS * CELL, ROWS * CELL / 2],
            ].map(([x1, z1, x2, z2], i) => (
                <DataStream key={i} x1={x1} z1={z1} x2={x2} z2={z2} />
            ))}

            {/* === TREES === */}
            {trees.map((t, i) => <LyokoTree key={i} {...t} />)}

            {/* === FLOATING ROCKS === */}
            {rocks.map((r, i) => <FloatingRock key={i} {...r} />)}

            {/* === LARGE BACKGROUND ROCK FORMATIONS === */}
            {[
                [-8, 0, 8, 4], [-8, 0, -4, 3.5], [COLS * CELL + 7, 0, 5, 5],
                [COLS * CELL + 6, 0, -3, 4], [8, 0, -8, 3.5], [COLS * CELL - 5, 0, -7, 4.5],
            ].map(([x, y, z, s], i) => (
                <mesh key={i} position={[x, s / 2, z]}>
                    <dodecahedronGeometry args={[s as number, 0]} />
                    <meshStandardMaterial color="#0e2016" roughness={0.95} emissive="#002208" emissiveIntensity={0.3} />
                </mesh>
            ))}

            {/* === FAR GROUND PLANE === */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[(COLS / 2 - 0.5) * CELL, -0.1, (ROWS / 2 - 0.5) * CELL]}>
                <planeGeometry args={[COLS * CELL * 6, ROWS * CELL * 6]} />
                <meshStandardMaterial color="#040e06" />
            </mesh>
        </group>
    );
}

// ═══ WRAPPERS ═══
// ═══ AVATAR DISPATCHER ═══
function HeroAvatar({ id, g }: { id: HeroId; g: THREE.DataTexture }) {
    // Attempt to load external generic model, else fallback to primitives
    const fallbackModel = id === "aelita" ? <AelitaModel g={g} /> :
        id === "yumi" ? <YumiModel g={g} /> :
            id === "odd" ? <OddModel g={g} /> :
                <UlrichModel g={g} />;

    // We wrap it in an error boundary and suspense so it doesn't crash the canvas
    return (
        <GLTFErrorBoundary fallback={fallbackModel}>
            <Suspense fallback={fallbackModel}>
                <ExternalCharacterModel modelPath="/models/pohatu.glb" />
            </Suspense>
        </GLTFErrorBoundary>
    );
}
function Hero({ x, y, id, animProgress, prevPos }: {
    x: number; y: number; id: HeroId; animProgress: number; prevPos?: { x: number; y: number };
}) {
    const g = useToon();
    const cx = (prevPos ? prevPos.x + (x - prevPos.x) * animProgress : x) * CELL;
    const cz = (prevPos ? prevPos.y + (y - prevPos.y) * animProgress : y) * CELL;
    const colors: Record<string, string> = { ulrich: "#d4a017", aelita: "#f472b6", yumi: "#cc0000", odd: "#7c3aed" };
    const c = colors[id] ?? "#00d4ff";
    return (
        <group position={[cx, 0, cz]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}><ringGeometry args={[0.82, 1.02, 32]} /><meshBasicMaterial color={c} transparent opacity={0.9} side={THREE.DoubleSide} /></mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}><circleGeometry args={[0.82, 32]} /><meshBasicMaterial color={c} transparent opacity={0.08} /></mesh>

            <HeroAvatar id={id} g={g} />
            <pointLight position={[0, 2.5, 0]} intensity={16} color={c} distance={7} decay={2} />
        </group>
    );
}

function Enemy({ type, x, y, alive }: { type: string; x: number; y: number; alive: boolean }) {
    const g = useToon();
    if (!alive) return null;
    const colors: Record<string, string> = { blok: "#ff2244", kankrelat: "#c2410c", megatank: "#dc2626" };
    const c = colors[type] ?? "#ff0000";
    return (
        <group position={[x * CELL, 0, y * CELL]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}><circleGeometry args={[0.65, 32]} /><meshBasicMaterial color={c} transparent opacity={0.18} /></mesh>
            {type === "blok" && <BlokModel g={g} />}
            {type === "kankrelat" && <KankrelatModel g={g} />}
            {type === "megatank" && <MegatankModel g={g} />}
            {!["blok", "kankrelat", "megatank"].includes(type as string) && <BlokModel g={g} />}
            <pointLight position={[0, 2, 0]} intensity={10} color={c} distance={5} decay={2} />
        </group>
    );
}

// ═══ SCENE ═══
function Scene({ gameState, level, heroId, animProgress, prevState }: {
    gameState: GameState; level: LevelDef; heroId: HeroId; animProgress: number; prevState?: GameState;
}) {
    const g = useToon();
    return (
        <>
            <EnvironmentLighting />

            <LyokoForestSector />
            <Hero x={gameState.heroX} y={gameState.heroY} id={heroId} animProgress={animProgress}
                prevPos={prevState ? { x: prevState.heroX, y: prevState.heroY } : undefined} />
            {gameState.enemies.map(en => <Enemy key={en.id} {...en} />)}
            {level.grid.map((row, y) => row.split("").map((cell, x) => {
                if (cell === "T") return <group key={`t-${x}-${y}`} position={[x * CELL, 0, y * CELL]}><TowerModel active={gameState.towerReached} /></group>;
                if (cell === "X") return (
                    // Obstacles = Lyoko rock formations
                    <group key={`obs-${x}-${y}`} position={[x * CELL, 0, y * CELL]}>
                        <mesh position={[0, 0.8, 0]}>
                            <dodecahedronGeometry args={[0.85, 0]} />
                            <meshStandardMaterial color="#1a3a20" roughness={0.9}
                                emissive="#003311" emissiveIntensity={0.5} />
                        </mesh>
                        <mesh position={[0.3, 0.5, -0.3]}>
                            <dodecahedronGeometry args={[0.55, 0]} />
                            <meshStandardMaterial color="#122a18" roughness={0.9}
                                emissive="#002208" emissiveIntensity={0.4} />
                        </mesh>
                    </group>
                );
                if (cell === "*") return (
                    <Float key={`p-${x}-${y}`} speed={5} floatIntensity={0.4} rotationIntensity={2}>
                        <mesh position={[x * CELL, 0.7, y * CELL]}><octahedronGeometry args={[0.28]} /><meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={5} /></mesh>
                    </Float>
                );
                return null;
            }))}
            {gameState.status === "success" && (
                <Float speed={3} floatIntensity={0.5} rotationIntensity={0}>
                    <Text position={[(COLS / 2) * CELL, 14, (ROWS / 2) * CELL]} fontSize={2.8} color="#00ff88" anchorX="center" anchorY="middle" outlineWidth={0.08} outlineColor="#002211">
                        LEVEL COMPLETED ✓
                    </Text>
                </Float>
            )}
        </>
    );
}

// ═══ EXPORT ═══
export default function LyokoStage3D({ gameState, level, heroId, animProgress, prevState }: {
    gameState: GameState | null; level: LevelDef; heroId: HeroId; animProgress: number; prevState?: GameState;
}) {
    if (!gameState) return null;
    return (
        <div style={{ width: "100%", height: "100%", background: "#010510" }}>
            {/* Initialize camera position directly above the hero for a tight zoomed view */}
            <Canvas camera={{ position: [gameState.heroX * CELL, 12, gameState.heroY * CELL + 12], fov: 50, near: 0.1, far: 700 }}>
                {/* Disable panning to force strict lock on the player. Also set initial target directly. */}
                <OrbitControls makeDefault enablePan={false} enableZoom maxPolarAngle={Math.PI / 2.05} minDistance={4} maxDistance={70} target={[gameState.heroX * CELL, 0, gameState.heroY * CELL]} />
                <CameraController
                    targetX={gameState.heroX * CELL}
                    targetZ={gameState.heroY * CELL}
                    prevX={prevState ? prevState.heroX * CELL : gameState.heroX * CELL}
                    prevZ={prevState ? prevState.heroY * CELL : gameState.heroY * CELL}
                    animProgress={animProgress}
                />
                <Scene gameState={gameState} level={level} heroId={heroId} animProgress={animProgress} prevState={prevState} />
            </Canvas>
        </div>
    );
}
