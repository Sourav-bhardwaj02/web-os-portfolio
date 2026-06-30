import React from 'react';

export default function Resume() {
  return (
    <div className="app-content">
      <div className="app-title">📄 RESUME</div>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <a 
          href="#" 
          style={{
            display: 'inline-block',
            padding: '10px 24px',
            background: 'rgba(0,255,65,0.1)',
            border: '1px solid rgba(0,255,65,0.4)',
            color: 'var(--green)',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,255,65,0.2)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,255,65,0.1)'}
        >
          ⬇ Download PDF Resume
        </a>
      </div>
      <div className="resume-section-title">EDUCATION</div>
      <div className="resume-item">
        <div className="resume-item-header">
          <span className="resume-item-title">B.Tech Computer Science</span>
          <span className="resume-item-date">2023–2027</span>
        </div>
        <div className="resume-item-sub">Maharshi Dayanand University</div>
        <div className="resume-item-desc">Focused on data structures, algorithms, and modern web development.</div>
      </div>
      <div className="resume-section-title">PROJECTS & EXPERIENCE</div>
      <div className="resume-item">
        <div className="resume-item-header">
          <span className="resume-item-title">Gen AI & India Innovates Hackathons</span>
          <span className="resume-item-date">2024</span>
        </div>
        <div className="resume-item-sub">AI-Powered Web Apps</div>
        <div className="resume-item-desc">Built Artist Bazaar (E-commerce with AI chatbot) and Waste Wise (LLM waste tracking).</div>
      </div>
      <div className="resume-section-title">SKILLS</div>
      <div className="resume-item-desc">JavaScript, TypeScript, HTML, CSS, Python, React, Tailwind, Node.js, Express, MongoDB, PostgreSQL, Firebase</div>
      <div className="resume-section-title">STRENGTHS</div>
      <div className="resume-item-desc">Problem Solving | Team Collaboration | Fast Learner | UI/UX Focus</div>
    </div>
  );
}
