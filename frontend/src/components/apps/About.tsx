import React from 'react';

export default function About() {
  return (
    <div className="app-content">
      <div className="profile-header">
        <div className="profile-pic">👨‍💻</div>
        <div className="profile-info">
          <h1>SOURAV BHARDWAJ</h1>
          <div className="role">Full Stack Web Developer (Fresher)</div>
          <div className="location">📍  Delhi</div>
          <div className="status"><span className="status-dot"></span>ONLINE</div>
        </div>
      </div>
      <div className="app-section">
        <div className="app-section-title">$ cat bio.txt</div>
        <p style={{ color: '#ccc', fontSize: '13px', lineHeight: 1.8 }}>
          Full-stack web developer skilled in building scalable, responsive applications using modern JavaScript technologies.
          Experience in developing real-world projects including AI-powered platforms and interactive web apps, LLMs. 
          Strong focus on performance, clean architecture, and user-centric design.
        </p>
      </div>
      <div className="app-section">
        <div className="app-section-title">$ ls strengths/</div>
        <div>
          <span className="tag">Problem Solving</span><span className="tag">Team Collaboration</span>
          <span className="tag">Fast Learner</span><span className="tag">UI/UX Focus</span>
        </div>
      </div>
      <div className="app-section">
        <div className="app-section-title">$ whoami</div>
        <div style={{ fontSize: '12px', color: '#aaa', lineHeight: 2 }}>
          <div>OS: Portfolio-OS v1.0.2026</div>
          <div>Shell: /bin/bash</div>
          <div>Terminal: TERMINAL_V1.0.EXE</div>
          <div>Role: Full Stack Web Developer</div>
          <div>Status: Available for opportunities</div>
        </div>
      </div>
    </div>
  );
}
