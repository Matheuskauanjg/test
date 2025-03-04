import React from 'react';
import './App.css';
import NeuralNetwork from './components/NeuralNetwork';

const App = () => {
  return (
    <div className="App">
      <NeuralNetwork />
      <div className="content">
        <header>
          <h1>Matheus Kauan pinto</h1>
          <p>Programador | 20 anos</p>
        </header>

        <div className="info-container">
          <div className="info-card">
            <h2>Sobre Mim</h2>
            <p>Sou um programador apaixonado por tecnologia e resolução de problemas...</p>
          </div>

          <div className="info-card">
            <h2>Objetivo Profissional</h2>
            <p>Busco oportunidades de estágio nas áreas de Tecnologia da Informação...</p>
          </div>

          <div className="info-card">
            <h2>Formação Acadêmica</h2>
            <ul>
              <li><strong>Ensino Médio Técnico:</strong> Helena Kolody (Conclusão: 2024)</li>
              <li><strong>Análise e Desenvolvimento de Sistemas:</strong> Uninter (Cursando)</li>
            </ul>
          </div>

          <div className="info-card">
            <h2>Habilidades Técnicas</h2>
            <ul>
              <li>HTML, CSS, JavaScript, Python</li>
              <li>React, Manutenção de Hardware</li>
            </ul>
          </div>

          <div className="info-card">
            <h2>Soft Skills</h2>
            <ul>
              <li>Organização e proatividade</li>
              <li>Boa comunicação</li>
            </ul>
          </div>

          <div className="info-card">
            <h2>Projetos Pessoais</h2>
            <ul>
              <li><strong>Rede Neural Animada:</strong> Simulação de aprendizado neural</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
