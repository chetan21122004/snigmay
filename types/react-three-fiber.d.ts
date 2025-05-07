import { Object3D, Material, Mesh } from 'three'

declare module '@react-three/fiber' {
  export interface ThreeElements {
    group: JSX.IntrinsicElements['div'] & { ref?: React.RefObject<Object3D> }
    mesh: JSX.IntrinsicElements['div'] & { ref?: React.RefObject<Mesh> }
    ambientLight: JSX.IntrinsicElements['div']
    directionalLight: JSX.IntrinsicElements['div']
    pointLight: JSX.IntrinsicElements['div']
    hemisphereLight: JSX.IntrinsicElements['div']
  }
} 