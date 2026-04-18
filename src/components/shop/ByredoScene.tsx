"use client";

import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Group, Object3D } from "three";

// ─────────────────────────────────────────
// Camera waypoints — world space (model is ~1 unit tall after 0.1 scale)
// ─────────────────────────────────────────
const CAM_POS: THREE.Vector3[] = [
  new THREE.Vector3(0, 0.6, 3.2),    // 0: front full shot
  new THREE.Vector3(2.2, 1.8, 2.4),  // 1: upper-right diagonal
  new THREE.Vector3(3.6, 0.5, 0.4),  // 2: side shot
  new THREE.Vector3(0.3, 4.2, 0.9),  // 3: top-view (cap open)
  new THREE.Vector3(0.4, 5.5, 2.0),  // 4: top-view further (cap closed)
  new THREE.Vector3(0, 0.6, 3.2),    // 5: front again
];

const CAM_TARGET: THREE.Vector3[] = [
  new THREE.Vector3(0, 0.5, 0),   // 0
  new THREE.Vector3(0, 0.5, 0),   // 1
  new THREE.Vector3(0, 0.5, 0),   // 2
  new THREE.Vector3(0, 1.0, 0),   // 3: look at top of bottle
  new THREE.Vector3(0, 0.9, 0),   // 4
  new THREE.Vector3(0, 0.5, 0),   // 5
];

// Cap lift in world-space Y (cap base is at ~0.93)
const CAP_LIFT = 0.7;

/** Smooth easeInOut for inter-stage interpolation */
function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/** Map progress 0-1 → interpolated camera pos/target across 6 waypoints */
function getCameraTarget(progress: number): {
  pos: THREE.Vector3;
  target: THREE.Vector3;
} {
  const p = Math.min(Math.max(progress, 0), 0.9999) * 5; // 0 → 4.999
  const from = Math.floor(p);
  const to = from + 1;
  const t = easeInOut(p - from);

  return {
    pos: new THREE.Vector3().lerpVectors(CAM_POS[from], CAM_POS[to], t),
    target: new THREE.Vector3().lerpVectors(
      CAM_TARGET[from],
      CAM_TARGET[to],
      t
    ),
  };
}

/**
 * Cap Y offset (world space):
 *   progress 0 → 0.333  (stages 0-1): closed
 *   progress 0.333 → 0.5 (stage 2): opens
 *   progress 0.5 → 0.667 (stage 3): fully open
 *   progress 0.667 → 0.833 (stage 4): closes
 *   progress 0.833 → 1    (stage 5): closed
 */
function getCapLift(progress: number): number {
  const p = progress * 6; // 0 - 6
  if (p <= 2) return 0;
  if (p <= 3) return THREE.MathUtils.smoothstep(p - 2, 0, 1) * CAP_LIFT;
  if (p <= 4) return CAP_LIFT;
  if (p <= 5)
    return (1 - THREE.MathUtils.smoothstep(p - 4, 0, 1)) * CAP_LIFT;
  return 0;
}

// ─────────────────────────────────────────
// Scene controller (runs inside Canvas)
// ─────────────────────────────────────────
interface ByredoSceneProps {
  progressRef: React.RefObject<number>;
}

export function ByredoScene({
  progressRef,
}: ByredoSceneProps): React.JSX.Element {
  const { camera } = useThree();
  const groupRef = useRef<Group>(null);
  const capRef = useRef<Object3D | null>(null);

  // Smoothed camera state (lerped each frame)
  const smoothPos = useRef(CAM_POS[0].clone());
  const smoothTarget = useRef(CAM_TARGET[0].clone());

  // Cap initial Y (set once after model loads)
  const capBaseY = useRef<number | null>(null);

  const { scene } = useGLTF("/assets/3D/byredo.glb");

  // Find cap mesh by name after GLTF loads
  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.name.toLowerCase().includes("cap")) {
        capRef.current = obj;
        capBaseY.current = obj.position.y;
      }
    });

    // Centre model vertically: offset so bottle centre ≈ Y=0
    if (groupRef.current) {
      const box = new THREE.Box3().setFromObject(groupRef.current);
      const centre = box.getCenter(new THREE.Vector3());
      groupRef.current.position.set(-centre.x, -centre.y, -centre.z);
    }
  }, [scene]);

  useFrame((_, delta) => {
    const progress = progressRef.current ?? 0;

    // ── Camera smooth lerp
    const { pos, target } = getCameraTarget(progress);
    const speed = 1 - Math.pow(0.04, delta); // frame-rate independent lerp
    smoothPos.current.lerp(pos, speed);
    smoothTarget.current.lerp(target, speed);
    camera.position.copy(smoothPos.current);
    camera.lookAt(smoothTarget.current);

    // ── Cap lift animation
    if (capRef.current && capBaseY.current !== null) {
      const lift = getCapLift(progress);
      capRef.current.position.y = capBaseY.current + lift;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/assets/3D/byredo.glb");
