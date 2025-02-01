import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const StarsInGlobe: React.FC = () => {
  const starField = useRef<THREE.Points | null>(null);

  const createStars = () => {
    const count = 5000;
    const positions: number[] = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 2 - 1;
      const y = Math.random() * 2 - 1;
      const z = Math.random() * 2 - 1;
      const length = Math.sqrt(x * x + y * y + z * z);
      positions.push(x / length);
      positions.push(y / length);
      positions.push(z / length);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
    });

    return new THREE.Points(geometry, material);
  };

  useFrame(() => {
    if (starField.current) {
      starField.current.rotation.y += 0.001;
    }
  });

  return <primitive object={createStars()} ref={starField} />;
};

const Globe: React.FC = () => {
  const globeRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (globeRef.current) {
      if (hovered) {
        globeRef.current.rotation.y += 0.01;
      } else {
        globeRef.current.rotation.y += 0.002;
      }
    }
  });

  return (
    <Sphere
      ref={globeRef}
      args={[1.1, 64, 64]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshStandardMaterial
        map={new THREE.TextureLoader().load(
          "https://unpkg.com/three-globe@2.35.2/example/img/earth-day.jpg"
        )}
      />
    </Sphere>
  );
};

const App: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <Canvas
        style={{ height: "100vh" }}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        <OrbitControls enableZoom={false} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <StarsInGlobe />
        <Globe />
      </Canvas>
    </div>
  );
};

export default App;
