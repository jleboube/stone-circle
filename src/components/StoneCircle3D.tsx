"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

function Stone({
  position,
  rotation,
  scale,
}: {
  position: [number, number, number];
  rotation: number;
  scale: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.5 + rotation) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={[0, rotation, 0.1]}>
      <boxGeometry args={[0.3 * scale, 1.2 * scale, 0.25 * scale]} />
      <meshStandardMaterial
        color="#4a4a5a"
        roughness={0.8}
        metalness={0.2}
        emissive="#1a1a2a"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

function EnergyBeam({ angle }: { angle: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const x = Math.cos(angle) * 2;
  const z = Math.sin(angle) * 2;

  return (
    <mesh ref={ref} position={[x, 0.5, z]}>
      <cylinderGeometry args={[0.02, 0.02, 3, 8]} />
      <meshBasicMaterial color="#06b6d4" transparent opacity={0.3} />
    </mesh>
  );
}

function EnergyRing() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.1;
      ringRef.current.scale.setScalar(
        1 + Math.sin(state.clock.elapsedTime) * 0.05
      );
    }
  });

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
      <torusGeometry args={[2.2, 0.05, 16, 100]} />
      <meshBasicMaterial color="#0891b2" transparent opacity={0.6} />
    </mesh>
  );
}

function CentralEnergy() {
  const coreRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.scale.setScalar(
        1 + Math.sin(state.clock.elapsedTime * 2) * 0.2
      );
      coreRef.current.rotation.y = state.clock.elapsedTime;
    }
    if (outerRef.current) {
      outerRef.current.scale.setScalar(
        1.5 + Math.sin(state.clock.elapsedTime * 1.5) * 0.3
      );
      outerRef.current.rotation.y = -state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group position={[0, 1, 0]}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.8} />
      </mesh>
      <mesh ref={outerRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#0891b2" transparent opacity={0.2} />
      </mesh>
      <pointLight color="#06b6d4" intensity={2} distance={10} />
    </group>
  );
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(200 * 3);

    for (let i = 0; i < 200; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.random() * 3;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#67e8f9"
        size={0.05}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function StoneCircleScene() {
  const groupRef = useRef<THREE.Group>(null);
  const stoneCount = 12;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  const stones = useMemo(() => {
    return Array.from({ length: stoneCount }, (_, i) => {
      const angle = (i / stoneCount) * Math.PI * 2;
      const radius = 2;
      return {
        position: [
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        rotation: angle,
        scale: 0.8 + Math.random() * 0.4,
      };
    });
  }, []);

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <pointLight position={[0, 3, 0]} color="#06b6d4" intensity={1} />

      <Stars
        radius={50}
        depth={50}
        count={2000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      <group ref={groupRef}>
        {stones.map((stone, i) => (
          <Stone key={i} {...stone} />
        ))}

        <EnergyRing />
        <CentralEnergy />
        <ParticleField />

        {Array.from({ length: 6 }, (_, i) => (
          <EnergyBeam key={i} angle={(i / 6) * Math.PI * 2} />
        ))}
      </group>

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <circleGeometry args={[5, 64]} />
        <meshStandardMaterial
          color="#1a1a2e"
          transparent
          opacity={0.8}
          roughness={1}
        />
      </mesh>
    </>
  );
}

export default function StoneCircle3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-mystic-950 to-black">
        <div className="text-mystic-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 3, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <StoneCircleScene />
      </Canvas>
    </div>
  );
}
