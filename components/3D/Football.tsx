"use client"

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

type FootballProps = {
  scrollProgress?: number;
};

type GLTFResult = {
  nodes: {
    Football: THREE.Mesh;
  };
  materials: {
    Football_Material: THREE.MeshStandardMaterial;
  };
};

export function Football({ scrollProgress = 0 }: FootballProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const gltf = useGLTF('/models/football.glb');
  const { nodes, materials } = gltf as unknown as GLTFResult;

  useFrame((state) => {
    if (!meshRef.current) return;

    // Rotate based on scroll
    meshRef.current.rotation.y = scrollProgress * Math.PI * 2;
    
    // Add floating animation
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    
    // Smooth rotation
    meshRef.current.rotation.x += 0.001;
    meshRef.current.rotation.z += 0.001;
  });

  return (
    <group dispose={null}>
      <mesh
        ref={meshRef}
        geometry={nodes.Football.geometry}
        scale={[0.5, 0.5, 0.5]}
      >
        <meshStandardMaterial
          map={materials.Football_Material.map}
          normalMap={materials.Football_Material.normalMap}
          roughnessMap={materials.Football_Material.roughnessMap}
          envMapIntensity={1}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload('/models/football.glb'); 