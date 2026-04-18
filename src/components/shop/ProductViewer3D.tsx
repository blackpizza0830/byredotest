"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { ByredoScene } from "./ByredoScene";

interface ProductViewer3DProps {
  productSlug: string;
  progressRef: React.RefObject<number>;
}

export function ProductViewer3D({
  productSlug: _productSlug,
  progressRef,
}: ProductViewer3DProps): React.JSX.Element {
  return (
    <div className="relative h-full bg-[#ececec]">
      <Canvas
        camera={{ position: [0, 0.6, 3.2], fov: 42 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        onCreated={({ gl }) => {
          gl.setClearColor("#ececec", 1);
        }}
      >
        <color attach="background" args={["#ececec"]} />

        <Suspense fallback={null}>
          {/* Environment — background:false 로 HDRI가 배경에 노출되지 않게 */}
          <Environment preset="studio" background={false} />

          {/* ── 조명: 위쪽 메인 1 + 측/후방 보조 2 */}
          <ambientLight intensity={0.25} />

          {/* 메인 라이트 — 위쪽 중앙 */}
          <directionalLight
            position={[0, 6, 3]}
            intensity={2.5}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.001}
          />

          {/* 보조 라이트 1 — 왼쪽 뒤 */}
          <directionalLight
            position={[-4, 3, -3]}
            intensity={0.8}
            color="#e8dfd4"
          />

          {/* 보조 라이트 2 — 오른쪽 뒤 */}
          <directionalLight
            position={[4, 2, -3]}
            intensity={0.6}
            color="#d4dce8"
          />

          {/* GLB 모델 + 카메라/캡 애니메이션 */}
          <ByredoScene progressRef={progressRef} />

          {/* 바닥 소프트 그림자 */}
          <ContactShadows
            position={[0, -0.7, 0]}
            opacity={0.45}
            scale={4}
            blur={2.5}
            far={2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
