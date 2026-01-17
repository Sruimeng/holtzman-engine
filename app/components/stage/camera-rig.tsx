import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function CameraRig() {
  const { camera, pointer } = useThree()
  const vec = new THREE.Vector3()

  useFrame(() => {
    vec.set(pointer.x * 5, pointer.y * 5 + 2, 25)
    camera.position.lerp(vec, 0.025)
    camera.lookAt(0, 0, 0)
  })

  return null
}
