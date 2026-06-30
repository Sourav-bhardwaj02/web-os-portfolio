import React from 'react';

export default function Experience() {
  return (
    <div className="app-content">
      <div className="app-title">💼 EXPERIENCE</div>
      <div className="timeline">
        <div className="timeline-item">
          <div className="timeline-dot"></div>
          <div className="timeline-date">2024</div>
          <div className="timeline-title">Gen AI Hackathon</div>
          <div className="timeline-place">Artist Bazaar</div>
          <div className="timeline-desc">Designed and developed a fullstack AI-powered e-commerce platform enabling artisans to sell products.</div>
        </div>
        <div className="timeline-item">
          <div className="timeline-dot"></div>
          <div className="timeline-date">2024</div>
          <div className="timeline-title">India Innovates Hackathon</div>
          <div className="timeline-place">Waste Wise</div>
          <div className="timeline-desc">Built an AI-driven system for waste classification using LLM models and applied data-driven tracking.</div>
        </div>
        <div className="timeline-item">
          <div className="timeline-dot"></div>
          <div className="timeline-date">2023 — 2027</div>
          <div className="timeline-title">B.Tech Computer Science</div>
          <div className="timeline-place">Maharshi Dayanand University</div>
          <div className="timeline-desc">Pursuing computer science degree with focus on modern web technologies and software engineering.</div>
        </div>
      </div>
    </div>
  );
}
