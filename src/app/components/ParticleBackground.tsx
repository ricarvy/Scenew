import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ParticleBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Particles
    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xC4956A,
      size: 1.8,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Lines between close particles
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * particleCount * 3);
    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3)
    );
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xC4956A,
      transparent: true,
      opacity: 0.06,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Mouse
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Animate
    let animFrame: number;
    const animate = () => {
      animFrame = requestAnimationFrame(animate);

      const pos = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3] += velocities[i * 3];
        pos[i * 3 + 1] += velocities[i * 3 + 1];
        pos[i * 3 + 2] += velocities[i * 3 + 2];

        // Boundary wrap
        if (Math.abs(pos[i * 3]) > 60) velocities[i * 3] *= -1;
        if (Math.abs(pos[i * 3 + 1]) > 60) velocities[i * 3 + 1] *= -1;
        if (Math.abs(pos[i * 3 + 2]) > 30) velocities[i * 3 + 2] *= -1;

        // Mouse repulsion
        const dx = pos[i * 3] - mouse.x * 40;
        const dy = pos[i * 3 + 1] - mouse.y * 40;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 15) {
          pos[i * 3] += dx * 0.01;
          pos[i * 3 + 1] += dy * 0.01;
        }
      }
      geometry.attributes.position.needsUpdate = true;

      // Update lines - connect nearby particles
      let lineIndex = 0;
      const lp = lineGeometry.attributes.position.array as Float32Array;
      const maxConnections = 400;
      let connectionCount = 0;

      for (let i = 0; i < particleCount && connectionCount < maxConnections; i += 3) {
        for (let j = i + 3; j < particleCount && connectionCount < maxConnections; j += 3) {
          const dx = pos[i * 3] - pos[j * 3];
          const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
          const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
          const d = dx * dx + dy * dy + dz * dz;
          if (d < 120) {
            lp[lineIndex++] = pos[i * 3];
            lp[lineIndex++] = pos[i * 3 + 1];
            lp[lineIndex++] = pos[i * 3 + 2];
            lp[lineIndex++] = pos[j * 3];
            lp[lineIndex++] = pos[j * 3 + 1];
            lp[lineIndex++] = pos[j * 3 + 2];
            connectionCount++;
          }
        }
      }

      // Zero out remaining
      for (let i = lineIndex; i < lineIndex + 6; i++) {
        lp[i] = 0;
      }

      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.setDrawRange(0, connectionCount * 2);

      particles.rotation.y += 0.0003;
      particles.rotation.x += 0.0001;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}