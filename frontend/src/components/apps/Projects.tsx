import React from 'react';

export default function Projects() {
  const projects = [
    { title: 'Artist Bazaar', desc: 'AI-Powered E-commerce Platform built at Gen AI Hackathon for artisans with role-based access and AI chatbot.', stack: ['React', 'Node.js', 'MongoDB', 'LLM'], emoji: '🎨' },
    { title: 'Waste Wise', desc: 'AI Waste Management System from India Innovates Hackathon using LLM classification and tracking.', stack: ['Python', 'LLM', 'React', 'Node.js'], emoji: '♻️' },
    { title: 'Weather App', desc: 'Responsive web application using OpenWeather API to fetch real-time weather data with optimized UI.', stack: ['JavaScript', 'API', 'HTML', 'CSS'], emoji: '🌤️' },
    { title: 'Task Manager', desc: 'Productivity-focused To-Do app with timers and clean interface to improve efficiency.', stack: ['React', 'TailwindCSS'], emoji: '📝' },
    { title: 'Air Draw', desc: 'Gesture-based drawing app using webcam hand tracking to convert movements into digital strokes.', stack: ['Python', 'Computer Vision'], emoji: '🖌️' },
  ];

  return (
    <div className="app-content">
      <div className="app-title">📁 PROJECTS</div>
      <div className="project-grid">
        {projects.map((p, i) => (
          <div key={i} className="project-card">
            <div className="project-title">{p.emoji} {p.title}</div>
            <div className="project-desc">{p.desc}</div>
            <div className="project-stack">
              {p.stack.map((s, j) => (
                <span key={j} className="stack-badge">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
