import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField = () => {
  const ref = useRef<THREE.Points>(null!);
  
  // Generate particles in a large sphere
  const particles = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
       // Spread them out in a 3D space
       positions[i * 3] = (Math.random() - 0.5) * 10;
       positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
       positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    // Subtle rotation and drift
    ref.current.rotation.x += delta / 20;
    ref.current.rotation.y += delta / 25;
    
    // Mouse interaction parallax
    const targetX = state.mouse.x * 0.2;
    const targetY = state.mouse.y * 0.2;
    ref.current.position.x += (targetX - ref.current.position.x) * 0.05;
    ref.current.position.y += (targetY - ref.current.position.y) * 0.05;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#22d3ee"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.4}
        />
      </Points>
    </group>
  );
};

const SovereignBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ParticleField />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-60"></div>
    </div>
  );
};

export default SovereignBackground;
