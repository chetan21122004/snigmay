"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, Environment } from "@react-three/drei"
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
  const rotationSpeed = useRef(0.01)
  const bounceHeight = useRef(0.2)

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.scale.set(9, 9, 9)
      groupRef.current.rotation.x = THREE.MathUtils.degToRad(-15)
      
      // Add initial animation
      gsap.to(rotationSpeed, {
        current: 0.03,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      })
      
      gsap.to(bounceHeight, {
        current: 0.4,
        duration: 1.5,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
      })
    }
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      // Smooth rotation with varying speed
      groupRef.current.rotation.y += rotationSpeed.current
      
      // Enhanced floating animation with time-based variation
      const time = state.clock.elapsedTime
      groupRef.current.position.y = Math.sin(time * 2) * bounceHeight.current
      
      // Subtle tilt animation
      groupRef.current.rotation.x = THREE.MathUtils.degToRad(-15) + Math.sin(time) * 0.1
      groupRef.current.rotation.z = Math.cos(time * 0.5) * 0.05
    }
  })

  // Create new materials with enhanced properties
  useEffect(() => {
    if (materials.White && materials.Black) {
      materials.White = new THREE.MeshPhysicalMaterial({
        color: '#ffffff',
        roughness: 0.1,
        metalness: 0.9,
        envMapIntensity: 2.0,
        clearcoat: 0.5,
        clearcoatRoughness: 0.1
      })

      materials.Black = new THREE.MeshPhysicalMaterial({
        color: '#202020',
        roughness: 0.2,
        metalness: 0.8,
        envMapIntensity: 1.8,
        clearcoat: 0.3,
        clearcoatRoughness: 0.2
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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Main background with stadium image */}
      <div 
        className="absolute inset-0 preloader-bg"
        style={{
          backgroundImage: `url('/stadium-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.8) contrast(1.1)',
        }}
      />

      {/* Gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(121, 40, 40, 0.95) 0%,
              rgba(121, 40, 40, 0.85) 50%,
              rgba(121, 40, 40, 0.95) 100%
            )
          `,
          mixBlendMode: 'multiply'
        }}
      />

      {/* Vignette effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.4) 100%)'
        }}
      />

      {/* Content wrapper with glass effect */}
      <div className="relative z-10 w-full max-w-md p-8">
        {/* 3D Football container */}
        <div className="w-[300px] h-[300px] mb-8 relative mx-auto">
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: 'rgba(121, 40, 40, 0.1)',
              backdropFilter: 'blur(8px)',
              boxShadow: `
                0 0 100px 20px rgba(253, 235, 137, 0.15),
                inset 0 0 20px rgba(253, 235, 137, 0.1)
              `
            }}
          />
          <Canvas
            camera={{ position: [0, 0, 10], fov: 45 }}
            style={{ width: "100%", height: "100%" }}
            shadows
          >
            <Environment preset="sunset" />
            <ambientLight intensity={1.2} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={1.5}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <directionalLight
              position={[-5, -5, -5]}
              intensity={0.8}
              castShadow
            />
            <pointLight position={[10, 10, 10]} intensity={1.0} />
            <pointLight position={[-10, -10, -10]} intensity={0.7} />
            <hemisphereLight
              color="#ffffff"
              groundColor="#000000"
              intensity={0.7}
            />
            <PreloaderBall />
          </Canvas>
        </div>

        {/* Loading bar with enhanced effects */}
        <div className="w-[300px] h-3 bg-black/30 rounded-full overflow-hidden backdrop-blur-sm mx-auto">
          <div
            className="h-full bg-secondary transition-all duration-300 ease-out relative"
            style={{
              width: `${progress}%`,
              boxShadow: `
                0 0 20px rgba(253, 235, 137, 0.3),
                inset 0 0 10px rgba(253, 235, 137, 0.2)
              `
            }}
          >
            <div className="absolute inset-0 shine-effect bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </div>

        {/* Loading text with enhanced styling */}
        <div 
          className="mt-6 text-2xl font-bold text-center text-[#fdeb89]"
          style={{ 
            textShadow: `
              0 2px 4px rgba(0,0,0,0.3),
              0 0 20px rgba(253, 235, 137, 0.3)
            `
          }}
        >
          Loading... {progress}%
        </div>
      </div>
    </div>
  )
}

useGLTF.preload('/scene.gltf') 