import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useApp } from "../context/AppContext";

export default function ThreeCanvas() {
  const { theme } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Refs to dynamically modify WebGL objects on theme change
  const outerMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const innerMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const starMatRef = useRef<THREE.PointsMaterial | null>(null);
  const floatMatsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const pointLight1Ref = useRef<THREE.PointLight | null>(null);
  const pointLight2Ref = useRef<THREE.PointLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    let width = containerRef.current.clientWidth;
    let height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 24;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Outer Torus Knot geometry - wireframe
    const outerGeometry = new THREE.TorusKnotGeometry(6.5, 2.0, 160, 18);
    const outerMaterial = new THREE.MeshStandardMaterial({
      color: theme === "dark" ? 0x3ebd6a : 0x15803d,
      metalness: 0.95,
      roughness: 0.05,
      wireframe: true,
    });
    outerMatRef.current = outerMaterial;
    const outerMesh = new THREE.Mesh(outerGeometry, outerMaterial);
    scene.add(outerMesh);

    // Inner Core geometry - solid flat-shaded icosahedron for high-tech 3D feeling
    const innerGeometry = new THREE.IcosahedronGeometry(3.5, 1);
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: theme === "dark" ? 0x4ade80 : 0x16a34a,
      metalness: 0.9,
      roughness: 0.1,
      flatShading: true,
      transparent: true,
      opacity: 0.85,
    });
    innerMatRef.current = innerMaterial;
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerMesh);

    // Create a variety of separate floating 3D orbital objects
    const geometries = [
      new THREE.TetrahedronGeometry(1.2),
      new THREE.OctahedronGeometry(1.0),
      new THREE.DodecahedronGeometry(0.9),
      new THREE.TorusGeometry(0.8, 0.25, 8, 24),
      new THREE.BoxGeometry(0.9, 0.9, 0.9),
      new THREE.IcosahedronGeometry(1.1, 0),
    ];

    const darkColors = [0x3ebd6a, 0x4ade80, 0x22c55e, 0x15803d, 0x86efac];
    const lightColors = [0x15803d, 0x16a34a, 0x22c55e, 0x14532d, 0x166534];
    const currentColors = theme === "dark" ? darkColors : lightColors;

    const floatingObjects: Array<{
      mesh: THREE.Mesh;
      initialX: number;
      initialY: number;
      initialZ: number;
      rotationSpeedX: number;
      rotationSpeedY: number;
      rotationSpeedZ: number;
      floatFrequency: number;
      floatAmplitude: number;
      scrollFactor: number;
    }> = [];

    floatMatsRef.current = [];

    // Instantiate 14 floating decorative shapes dispersed in space
    for (let i = 0; i < 14; i++) {
      const geom = geometries[i % geometries.length];
      const mat = new THREE.MeshStandardMaterial({
        color: currentColors[i % currentColors.length],
        metalness: 0.85,
        roughness: 0.15,
        flatShading: i % 2 === 0,
        transparent: true,
        opacity: 0.75,
      });

      floatMatsRef.current.push(mat);

      const mesh = new THREE.Mesh(geom, mat);

      // Distribute widely around the screen boundaries but in a visible range
      const xSign = i % 2 === 0 ? 1 : -1;
      const xRange = (Math.random() * 8 + 8) * xSign; // Left or Right outer region
      const yRange = (Math.random() - 0.5) * 22;      // Vertical spread
      const zRange = (Math.random() - 0.5) * 12 - 2;   // Deep perspective

      mesh.position.set(xRange, yRange, zRange);
      scene.add(mesh);

      floatingObjects.push({
        mesh,
        initialX: xRange,
        initialY: yRange,
        initialZ: zRange,
        rotationSpeedX: (Math.random() - 0.5) * 0.4,
        rotationSpeedY: (Math.random() - 0.5) * 0.4,
        rotationSpeedZ: (Math.random() - 0.5) * 0.2,
        floatFrequency: 0.5 + Math.random() * 1.5,
        floatAmplitude: 0.3 + Math.random() * 0.6,
        scrollFactor: 0.008 + Math.random() * 0.015,
      });
    }

    // Floating Particle Cloud (Starfield) for beautiful parallax background
    const particlesCount = 450;
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < positions.length; i++) {
      positions[i] = (Math.random() - 0.5) * 75; // Spread around coordinates
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.15,
      color: theme === "dark" ? 0x3ebd6a : 0x16a34a,
      transparent: true,
      opacity: theme === "dark" ? 0.6 : 0.35,
    });
    starMatRef.current = particlesMaterial;
    const starField = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(starField);

    // Lighting
    const pointLight = new THREE.PointLight(
      theme === "dark" ? 0x4ade80 : 0x16a34a, 
      theme === "dark" ? 3.0 : 4.0, 
      100
    );
    pointLight.position.set(15, 15, 15);
    pointLight1Ref.current = pointLight;
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(
      theme === "dark" ? 0x3ebd6a : 0x15803d, 
      theme === "dark" ? 2.5 : 3.5, 
      100
    );
    pointLight2.position.set(-15, -15, -15);
    pointLight2Ref.current = pointLight2;
    scene.add(pointLight2);

    const ambientLight = new THREE.AmbientLight(
      0xffffff, 
      theme === "dark" ? 0.25 : 0.6
    );
    ambientLightRef.current = ambientLight;
    scene.add(ambientLight);

    // Mouse and scroll variables
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let currentScrollY = 0;
    let targetScrollY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) - 0.5;
      mouseY = (event.clientY / window.innerHeight) - 0.5;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Animation Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Outer wireframe spins slowly
      outerMesh.rotation.y = elapsedTime * 0.1;
      outerMesh.rotation.z = elapsedTime * 0.03;

      // Inner core rotates in opposite direction to create structural depth
      innerMesh.rotation.x = -elapsedTime * 0.15;
      innerMesh.rotation.y = elapsedTime * 0.08;

      // Glow intensity pulses slowly over time
      innerMaterial.opacity = 0.7 + Math.sin(elapsedTime * 2) * 0.15;

      // Mouse smoothing interpolation (lerp)
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      outerMesh.rotation.x += targetY * 0.5;
      outerMesh.rotation.y += targetX * 0.5;

      innerMesh.rotation.x += targetY * 0.3;
      innerMesh.rotation.y += targetX * 0.3;

      // Scroll interpolation (smooth parallax)
      currentScrollY += (targetScrollY - currentScrollY) * 0.08;
      
      // Elements move vertically at different speeds to create rich spatial parallax
      outerMesh.position.y = -currentScrollY * 0.012;
      innerMesh.position.y = -currentScrollY * 0.012;

      // Animate each of our 14 floating 3D objects separately
      floatingObjects.forEach((obj) => {
        // Individual rotation spin
        obj.mesh.rotation.x += obj.rotationSpeedX * 0.05;
        obj.mesh.rotation.y += obj.rotationSpeedY * 0.05;
        obj.mesh.rotation.z += obj.rotationSpeedZ * 0.05;

        // Passive floating/swaying behavior using custom frequency & amplitude
        const sineWave = Math.sin(elapsedTime * obj.floatFrequency) * obj.floatAmplitude;
        meshYPassiveShift(obj, sineWave, currentScrollY, targetX, targetY);
      });
      
      // Starfield moves upwards slightly to contrast the main geometries moving down
      starField.position.y = currentScrollY * 0.005;
      // Star field also has a very slow passive spin
      starField.rotation.y = elapsedTime * 0.015;

      renderer.render(scene, camera);
    };

    // Helper to calculate position factors cleanly without extra variables
    const meshYPassiveShift = (
      obj: typeof floatingObjects[0], 
      sineWave: number, 
      scrollY: number, 
      mX: number, 
      mY: number
    ) => {
      // Base placement + bobbing + scroll-displacement
      obj.mesh.position.y = obj.initialY + sineWave - scrollY * obj.scrollFactor;
      
      // Fine-tuned interactive cursor sway based on depth (Z Position) coordinate
      const mouseDepthScale = (obj.initialZ + 15) / 15;
      obj.mesh.position.x = obj.initialX + mX * 8 * mouseDepthScale;
      obj.mesh.position.y += -mY * 6 * mouseDepthScale;
    };

    animate();

    // Sizing handling
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      
      const { width: newWidth, height: newHeight } = entries[0].contentRect;
      width = newWidth;
      height = newHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    });

    resizeObserver.observe(containerRef.current);

    // Clean up
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      
      outerGeometry.dispose();
      outerMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();

      // Dispose floating shapes, materials and geometries properly
      geometries.forEach(geo => geo.dispose());
      floatingObjects.forEach(obj => {
        if (Array.isArray(obj.mesh.material)) {
          obj.mesh.material.forEach((m) => m.dispose());
        } else {
          obj.mesh.material.dispose();
        }
      });

      renderer.dispose();
    };
  }, []);

  // Sync theme changes elegantly without rebuilding the whole Canvas instance
  useEffect(() => {
    const isDark = theme === "dark";

    if (outerMatRef.current) {
      outerMatRef.current.color.setHex(isDark ? 0x3ebd6a : 0x15803d);
    }
    if (innerMatRef.current) {
      innerMatRef.current.color.setHex(isDark ? 0x4ade80 : 0x16a34a);
    }
    if (starMatRef.current) {
      starMatRef.current.color.setHex(isDark ? 0x3ebd6a : 0x16a34a);
      starMatRef.current.opacity = isDark ? 0.6 : 0.35;
    }
    floatMatsRef.current.forEach((mat) => {
      mat.color.setHex(isDark ? 0x3ebd6a : 0x15803d);
    });
    if (pointLight1Ref.current) {
      pointLight1Ref.current.color.setHex(isDark ? 0x4ade80 : 0x16a34a);
      pointLight1Ref.current.intensity = isDark ? 3.0 : 4.0;
    }
    if (pointLight2Ref.current) {
      pointLight2Ref.current.color.setHex(isDark ? 0x3ebd6a : 0x15803d);
      pointLight2Ref.current.intensity = isDark ? 2.5 : 3.5;
    }
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = isDark ? 0.25 : 0.6;
    }
  }, [theme]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full -z-10 overflow-hidden bg-bg-space select-none pointer-events-none transition-colors duration-300">
      <canvas ref={canvasRef} className="w-full h-full block opacity-70" />
    </div>
  );
}
