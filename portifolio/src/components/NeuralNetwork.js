import { useEffect } from 'react';
import * as THREE from 'three';

const NeuralNetwork = () => {
  useEffect(() => {
    // Configuração básica da cena
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    // Ajusta o tamanho do renderer para preencher o fundo
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x111111, 1); // Cor de fundo para o canvas (escuro)
    
    // Adiciona o canvas ao DOM, mas com um position absolute para ocupar o fundo
    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1'; // Coloca o canvas atrás de outros elementos
    
    document.body.appendChild(canvas);

    const initialParticleCount = 100; // Reduzindo a quantidade inicial de partículas para 100
    const maxDistance = 120; // Distância máxima para a conexão de partículas
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.7, transparent: true });

    // Instanciando objetos reutilizáveis
    const particles = [];
    const connectedGroups = [];
    const connections = [];

    // Função para criar novas partículas dentro da tela
    const createParticle = () => {
      const particle = new THREE.Mesh(geometry, material);
      particle.position.set(
        Math.random() * window.innerWidth - window.innerWidth / 2,
        Math.random() * window.innerHeight - window.innerHeight / 2,
        0
      );
      particle.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.6, // Aumentando a velocidade em 20% (de 0.5 para 0.6)
        (Math.random() - 0.5) * 0.6, // Aumentando a velocidade em 20% (de 0.5 para 0.6)
        0
      );
      particles.push(particle);
      scene.add(particle);
    };

    // Função para conectar as partículas e formar grupos
    const connectParticles = () => {
      // Remover linhas de conexão antigas (evitar renderização excessiva)
      scene.children = scene.children.filter(child => !(child instanceof THREE.Line));

      // Limpar grupos de partículas anteriores
      connectedGroups.length = 0;

      // Conectar as partículas
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const distance = particles[i].position.distanceTo(particles[j].position);

          if (distance < maxDistance) {
            let groupA = null;
            let groupB = null;

            // Verificar se as partículas já estão em grupos
            for (const group of connectedGroups) {
              if (group.includes(particles[i])) {
                groupA = group;
              }
              if (group.includes(particles[j])) {
                groupB = group;
              }
            }

            if (!groupA && !groupB) {
              // Se as partículas não estiverem em grupos, criar um novo grupo
              connectedGroups.push([particles[i], particles[j]]);
            } else if (groupA && !groupB) {
              // Se uma partícula estiver em um grupo, adicionar a outra ao mesmo grupo
              groupA.push(particles[j]);
            } else if (!groupA && groupB) {
              groupB.push(particles[i]);
            } else if (groupA !== groupB) {
              // Se as partículas estiverem em grupos diferentes, unificá-los
              groupA.push(...groupB);
              connectedGroups.splice(connectedGroups.indexOf(groupB), 1);
            }

            // Criar linha de conexão apenas quando necessário
            const material = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.3 });
            const geometry = new THREE.BufferGeometry();
            const points = [particles[i].position, particles[j].position];
            geometry.setFromPoints(points);
            const line = new THREE.Line(geometry, material);
            scene.add(line);
            connections.push([particles[i], particles[j]]);
          }
        }
      }

      // Garantir que cada grupo tenha entre 3 e 6 partículas
      connectedGroups.forEach(group => {
        if (group.length > 6) {
          group.splice(6); // Limitar grupos a 6 partículas
        }
        if (group.length < 3 && particles.length < initialParticleCount) {
          createParticle(); // Adicionar novas partículas até ter 3 partículas por grupo
        }
      });
    };

    // Função para animar as partículas
    const animate = () => {
      requestAnimationFrame(animate);

      // Atualizar a posição das partículas
      particles.forEach(particle => {
        particle.position.add(particle.velocity);

        // Garantir que as partículas não saiam da tela
        if (particle.position.x > window.innerWidth / 2) particle.position.x = -window.innerWidth / 2;
        if (particle.position.x < -window.innerWidth / 2) particle.position.x = window.innerWidth / 2;
        if (particle.position.y > window.innerHeight / 2) particle.position.y = -window.innerHeight / 2;
        if (particle.position.y < -window.innerHeight / 2) particle.position.y = window.innerHeight / 2;

        // Adicionar movimento suave (reduzido)
        particle.velocity.x += Math.random() * 0.05 - 0.025; // Mais fluidez, movimento mais suave
        particle.velocity.y += Math.random() * 0.05 - 0.025;
      });

      // Atualizar conexões e grupos de partículas
      connectParticles();

      // Renderizar a cena
      renderer.render(scene, camera);
    };

    // Ajustar a posição da câmera
    camera.position.z = 500;

    // Criar partículas iniciais
    for (let i = 0; i < initialParticleCount; i++) {
      createParticle();
    }

    // Iniciar animação
    animate();

    // Limpar quando o componente for desmontado
    return () => {
      renderer.dispose();
    };
  }, []);

  return null;
};

export default NeuralNetwork;
