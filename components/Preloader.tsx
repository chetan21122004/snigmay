"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, Environment } from "@react-three/drei"
import * as THREE from "three"
import { gsap } from "gsap"
import Image from "next/image"

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
  const bounceHeight = useRef(0.1)

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.scale.set(6, 6, 6)
      groupRef.current.rotation.x = THREE.MathUtils.degToRad(-15)
      
      // Add initial animation with reduced speed
      gsap.to(rotationSpeed, {
        current: 0.02,
        duration: 2.5,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1
      })
      
      gsap.to(bounceHeight, {
        current: 0.2,
        duration: 2,
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
  const leftLogoRef = useRef<HTMLDivElement>(null)
  const rightLogoRef = useRef<HTMLDivElement>(null)

  // Logo animations
  useEffect(() => {
    if (leftLogoRef.current && rightLogoRef.current) {
      // Initial fade in and scale animation
      gsap.fromTo(
        [leftLogoRef.current, rightLogoRef.current],
        {
          opacity: 0,
          scale: 0.8,
          y: 20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.2,
        }
      )

      // Continuous floating animation
      gsap.to([leftLogoRef.current, rightLogoRef.current], {
        y: "10",
        duration: 2,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
      })

      // Continuous glow pulse animation
      const glowTimeline = gsap.timeline({ repeat: -1 })
      
      glowTimeline.to([leftLogoRef.current, rightLogoRef.current], {
        boxShadow: "0 0 30px rgba(253, 235, 137, 0.5)",
        duration: 1.5,
        ease: "power1.inOut",
      })
      
      glowTimeline.to([leftLogoRef.current, rightLogoRef.current], {
        boxShadow: "0 0 15px rgba(253, 235, 137, 0.2)",
        duration: 1.5,
        ease: "power1.inOut",
      })
    }
  }, [])

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
      className="fixed inset-0 z-50 py-10 flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6"
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
      <div className="relative z-10 w-full max-w-5xl p-4 sm:p-6 lg:p-8 mx-auto flex flex-col justify-center items-center">
        {/* Logos and 3D Football container */}
        <div className="flex flex-col items-center justify-center mb-8 lg:mb-12">
          {/* Combined Logo and 3D Football container */}
          <div className="relative">
            {/* Glowing border container */}
            <div 
              className="absolute inset-0 rounded-full animate-glow"
              style={{
                background: `
                  linear-gradient(45deg, 
                    rgba(255, 215, 0, 0.5),
                    rgba(253, 235, 137, 0.8),
                    rgba(255, 215, 0, 0.5)
                  )
                `,
                filter: 'blur(15px)',
                transform: 'scale(1.02)',
              }}
            />
            {/* Larger Logo Container */}
            <div 
              ref={rightLogoRef}
              className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 justify-center items-center  relative rounded-full overflow-hidden bg-black/10 backdrop-blur-sm"
              style={{
                transition: 'transform 0.3s ease',
                border: '2px solid rgba(253, 235, 137, 0.8)',
                boxShadow: `
                  0 0 50px rgba(253, 235, 137, 0.2),
                  inset 0 0 20px rgba(253, 235, 137, 0.2)
                `,
              }}
            >
              <div className="absolute inset-0 flex left-2 top-2  items-center justify-center">
                <Image
                  src="/images/snimayfoundation-logo.png"
                  alt="Snigmay Foundation"
                  width={384}
                  height={384}
                  className="object-contain w-full h-full 
                  "
                  priority
                />
              </div>
            </div>

            {/* 3D Football container - positioned absolutely over the logo */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56">
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'rgba(121, 40, 40, 0.1)',
                  boxShadow: `
                    0 0 60px 10px rgba(253, 235, 137, 0.15),
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
                <ambientLight intensity={0.8} />
                <directionalLight
                  position={[5, 5, 5]}
                  intensity={1.2}
                  castShadow
                  shadow-mapSize={[1024, 1024]}
                />
                <directionalLight
                  position={[-5, -5, -5]}
                  intensity={0.6}
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
          </div>
        </div>

        {/* Loading bar with enhanced effects */}
        <div className="w-full sm:w-[400px] md:w-[450px] lg:w-[500px] h-3 sm:h-4 bg-primary/20 rounded-full overflow-hidden backdrop-blur-sm mx-auto">
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
          className="mt-4 sm:mt-6 text-xl sm:text-2xl font-bold text-center text-secondary"
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