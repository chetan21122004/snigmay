"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { Model } from "./Football"

function LoadingFallback() {
  return <div className="text-white text-center">Loading 3D Model...</div>
}

export default function ThreeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 200], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <ambientLight intensity={0.8} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          castShadow
        />
        <Model />
      </Suspense>
    </Canvas>
  )
} 