"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

interface ProductModelProps {
  productSlug: string;
  onError: () => void;
}

/**
 * Placeholder geometry — replace with useGLTF() when real .glb assets are provided.
 * Shape mimics a perfume bottle for visual prototyping.
 */
export function ProductModel({
  productSlug: _productSlug,
  onError: _onError,
}: ProductModelProps): React.JSX.Element {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group>
      {/* Bottle body */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 1.8, 32]} />
        <meshPhysicalMaterial
          color="#C4B8A8"
          roughness={0.1}
          metalness={0.05}
          transmission={0.6}
          thickness={0.5}
        />
      </mesh>
      {/* Bottle cap */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.25, 32]} />
        <meshStandardMaterial color="#1A1814" roughness={0.3} metalness={0.1} />
      </mesh>
    </group>
  );
}
