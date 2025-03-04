import { useEffect } from 'react';
import * as THREE from 'three';

const NeuralNetwork = () => {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    // Definindo o tamanho do canvas
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x111111, 1);

    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';

    document.body.appendChild(canvas);

    const initialParticleCount = 100;
    const maxDistance = 120; 
    const geometry = new THREE.SphereGeometry(1, 16, 16);  // Menor resolução para melhorar desempenho
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.7, transparent: true });

    const particles = [];
    const connectedGroups = [];
    const connections = [];

    const createParticle = () => {
      const particle = new THREE.Mesh(geometry, material);
      particle.position.set(
        Math.random() * window.innerWidth - window.innerWidth / 2,
        Math.random() * window.innerHeight - window.innerHeight / 2,
        0
      );
      particle.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.6,
        (Math.random() - 0.5) * 0.6,
        0
      );
      particles.push(particle);
      scene.add(particle);
    };

    const connectParticles = () => {
      // Filtrando partículas para reduzir cálculos de distâncias
      const visibleParticles = particles.filter(p => Math.abs(p.position.x) < window.innerWidth / 2 && Math.abs(p.position.y) < window.innerHeight / 2);

      // Remover linhas de conexão antigas
      scene.children = scene.children.filter(child => !(child instanceof THREE.Line));

      connectedGroups.length = 0;

      for (let i = 0; i < visibleParticles.length; i++) {
        for (let j = i + 1; j < visibleParticles.length; j++) {
          const distance = visibleParticles[i].position.distanceTo(visibleParticles[j].position);

          if (distance < maxDistance) {
            let groupA = null;
            let groupB = null;

            for (const group of connectedGroups) {
              if (group.includes(visibleParticles[i])) {
                groupA = group;
              }
              if (group.includes(visibleParticles[j])) {
                groupB = group;
              }
            }

            if (!groupA && !groupB) {
              connectedGroups.push([visibleParticles[i], visibleParticles[j]]);
            } else if (groupA && !groupB) {
              groupA.push(visibleParticles[j]);
            } else if (!groupA && groupB) {
              groupB.push(visibleParticles[i]);
            } else if (groupA !== groupB) {
              groupA.push(...groupB);
              connectedGroups.splice(connectedGroups.indexOf(groupB), 1);
            }

            const material = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.3 });
            const geometry = new THREE.BufferGeometry();
            const points = [visibleParticles[i].position, visibleParticles[j].position];
            geometry.setFromPoints(points);
            const line = new THREE.Line(geometry, material);
            scene.add(line);
            connections.push([visibleParticles[i], visibleParticles[j]]);
          }
        }
      }

      connectedGroups.forEach(group => {
        if (group.length > 6) {
          group.splice(6);
        }
        if (group.length < 3 && particles.length < initialParticleCount) {
          createParticle(); 
        }
      });
    };

    const animate = () => {
      requestAnimationFrame(animate);

      // Atualização eficiente
      particles.forEach(particle => {
        particle.position.add(particle.velocity);

        if (particle.position.x > window.innerWidth / 2) particle.position.x = -window.innerWidth / 2;
        if (particle.position.x < -window.innerWidth / 2) particle.position.x = window.innerWidth / 2;
        if (particle.position.y > window.innerHeight / 2) particle.position.y = -window.innerHeight / 2;
        if (particle.position.y < -window.innerHeight / 2) particle.position.y = window.innerWidth / 2;

        particle.velocity.x += Math.random() * 0.05 - 0.025;
        particle.velocity.y += Math.random() * 0.05 - 0.025;
      });

      connectParticles();

      renderer.render(scene, camera);
    };

    camera.position.z = 500;

    for (let i = 0; i < initialParticleCount; i++) {
      createParticle();
    }

    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  return null;
};

export default NeuralNetwork;
