"use client"

import { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ModelProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
}

interface FootballGLTF {
  nodes: {
    FootballBall_White_0: {
      geometry: THREE.BufferGeometry
    }
    FootballBall_Black_0: {
      geometry: THREE.BufferGeometry
    }
  }
  materials: {
    White: THREE.Material
    Black: THREE.Material
  }
}

export function Model(props: ModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { nodes, materials } = useGLTF('/scene.gltf') as unknown as FootballGLTF

  useFrame((state) => {
    if (groupRef.current) {
      // Rotate the ball
      groupRef.current.rotation.y += 0.01
      // Add floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2
    }
  })

  return (
    <group ref={groupRef} {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={100}>
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

useGLTF.preload('/scene.gltf') 