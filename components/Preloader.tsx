"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"
import { gsap } from "gsap"

interface FootballGLTF {
  nodes: {
    FootballBall_White_0: THREE.Mesh
    FootballBall_Black_0: THREE.Mesh
  }
  materials: {
    White: THREE.MeshStandardMaterial
    Black: THREE.MeshStandardMaterial
  }
}

function PreloaderBall() {
  const groupRef = useRef<THREE.Group>(null)
  const { nodes, materials } = useGLTF('/scene.gltf') as unknown as FootballGLTF

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.scale.set(9,9,9)
      // Start with a slight tilt
      groupRef.current.rotation.x = THREE.MathUtils.degToRad(-15)
    }
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      // Rotate around Y axis with a bouncing effect
      groupRef.current.rotation.y += 0.01
      // Add floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2
    }
  })

  // Create new materials with enhanced properties
  useEffect(() => {
    if (materials.White && materials.Black) {
      materials.White = new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.2,
        metalness: 0.8,
        envMapIntensity: 1.5
      })

      materials.Black = new THREE.MeshStandardMaterial({
        color: '#202020',
        roughness: 0.3,
        metalness: 0.7,
        envMapIntensity: 1.2
      })
    }
  }, [materials])

  return (
    <group ref={groupRef}>
      <group>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.FootballBall_White_0.geometry}
          material={materials.White}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.FootballBall_Black_0.geometry}
          material={materials.Black}
        />
      </group>
    </group>
  )
}

export function Preloader() {
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1
      })
    }, 30)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress === 100) {
      // Animate out the preloader
      const tl = gsap.timeline()
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.5,
        delay: 0.5,
        onComplete: () => setIsLoading(false)
      })
    }
  }, [progress])

  if (!isLoading) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        backgroundImage: `
          linear-gradient(
            to bottom,
            rgba(121, 40, 40, 0.92),
            rgba(121, 40, 40, 0.85) 30%,
            rgba(121, 40, 40, 0.95) 100%
          ),
          url('/images/footballstadium.jpg')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'multiply',
      }}
    >
      {/* 3D Football */}
      <div className="w-[300px] h-[300px] mb-8 relative">
        <div 
          className="absolute inset-0 rounded-full bg-[#792828]/20"
          style={{
            boxShadow: '0 0 100px 20px rgba(253, 235, 137, 0.15)'
          }}
        />
        <Canvas
          camera={{ position: [0, 0, 10], fov: 45 }}
          style={{ width: "100%", height: "100%" }}
          shadows
        >
          <ambientLight intensity={1.2} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[512, 512]}
          />
          <directionalLight
            position={[-5, -5, -5]}
            intensity={0.5}
            castShadow
          />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <hemisphereLight
            color="#ffffff"
            groundColor="#000000"
            intensity={0.5}
          />
          <PreloaderBall />
        </Canvas>
      </div>

      {/* Loading Bar */}
      <div className="w-[300px] h-2 bg-[#792828]/30 rounded-full overflow-hidden backdrop-blur-sm">
        <div
          className="h-full bg-[#fdeb89] transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
            boxShadow: '0 0 20px rgba(253, 235, 137, 0.3)'
          }}
        />
      </div>

      {/* Loading Text */}
      <div className="mt-4 text-xl font-semibold text-[#fdeb89] drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
        Loading... {progress}%
      </div>
    </div>
  )
}

useGLTF.preload('/scene.gltf') 