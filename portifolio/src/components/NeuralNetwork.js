import { useEffect } from 'react';
import * as THREE from 'three';

const NeuralNetwork = () => {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });

    // Definindo o tamanho do canvas e ajustando para preencher a tela inteira
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x111111, 1);

    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';

    document.body.appendChild(canvas);

    // Detecção de dispositivos móveis
    const isMobile = window.innerWidth <= 768;  // Detecta se é mobile
    const initialParticleCount = isMobile ? 20 : 100;  // Menos partículas no celular
    const maxDistance = 120; // Distância máxima para as conexões

    const geometry = new THREE.SphereGeometry(isMobile ? 3 : 1, 32, 32);  // Partículas maiores no celular
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

    const removeOldConnections = () => {
      // Remove as conexões antigas da cena para evitar acumular objetos
      connections.forEach(connection => {
        scene.remove(connection);
        connection.geometry.dispose(); // Libera a memória da geometria
        connection.material.dispose(); // Libera a memória do material
      });
      connections.length = 0; // Limpa o array
    };

    const connectParticles = () => {
      removeOldConnections(); // Remove as conexões antigas

      connectedGroups.length = 0;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const distance = particles[i].position.distanceTo(particles[j].position);

          if (distance < maxDistance) {
            let groupA = null;
            let groupB = null;

            for (const group of connectedGroups) {
              if (group.includes(particles[i])) {
                groupA = group;
              }
              if (group.includes(particles[j])) {
                groupB = group;
              }
            }

            if (!groupA && !groupB) {
              connectedGroups.push([particles[i], particles[j]]);
            } else if (groupA && !groupB) {
              groupA.push(particles[j]);
            } else if (!groupA && groupB) {
              groupB.push(particles[i]);
            } else if (groupA !== groupB) {
              groupA.push(...groupB);
              connectedGroups.splice(connectedGroups.indexOf(groupB), 1);
            }

            const material = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.3 });
            const geometry = new THREE.BufferGeometry();
            const points = [particles[i].position, particles[j].position];
            geometry.setFromPoints(points);
            const line = new THREE.Line(geometry, material);
            scene.add(line);
            connections.push(line);
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

      particles.forEach(particle => {
        particle.position.add(particle.velocity);

        if (particle.position.x > window.innerWidth / 2) particle.position.x = -window.innerWidth / 2;
        if (particle.position.x < -window.innerWidth / 2) particle.position.x = window.innerWidth / 2;
        if (particle.position.y > window.innerHeight / 2) particle.position.y = -window.innerHeight / 2;
        if (particle.position.y < -window.innerHeight / 2) particle.position.y = window.innerHeight / 2;

        particle.velocity.x += Math.random() * 0.05 - 0.025; // Mais fluidez, movimento mais suave
        particle.velocity.y += Math.random() * 0.05 - 0.025;
      });

      connectParticles();
      renderer.render(scene, camera);
    };

    // Ajustando a câmera para telas pequenas
    camera.position.z = isMobile ? 200 : 500; // Câmera mais próxima no celular

    // Criação das partículas
    for (let i = 0; i < initialParticleCount; i++) {
      createParticle();
    }

    animate();

    // Atualiza o tamanho do canvas e o ajuste da cena quando a janela for redimensionada
    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });

    return () => {
      // Limpeza final para liberar todos os recursos
      particles.forEach(particle => {
        scene.remove(particle);
        particle.geometry.dispose();
        particle.material.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return null;
};

export default NeuralNetwork;
