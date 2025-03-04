import { useEffect } from 'react';
import * as THREE from 'three';

const NeuralNetwork = () => {
  useEffect(() => {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
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
    const geometry = new THREE.SphereGeometry(1, 32, 32);
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
    
      scene.children = scene.children.filter(child => !(child instanceof THREE.Line));

   
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
            connections.push([particles[i], particles[j]]);
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
