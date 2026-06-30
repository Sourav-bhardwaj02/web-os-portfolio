import React from 'react';

export default function Timeline() {
  return (
    <div className="app-content">
      <div className="app-title">📅 TIMELINE</div>
      <div className="timeline">
        <div className="timeline-item">
          <div className="timeline-dot"></div>
          <div className="timeline-date">2027</div>
          <div className="timeline-title">🎓 Graduating</div>
          <div className="timeline-desc">B.Tech CS completion at MDU. Seeking full-time roles.</div>
        </div>
        <div className="timeline-item">
          <div className="timeline-dot"></div>
          <div className="timeline-date">2024</div>
          <div className="timeline-title">🏆 Hackathons</div>
          <div className="timeline-desc">Built Artist Bazaar (Gen AI) and Waste Wise (India Innovates).</div>
        </div>
        <div className="timeline-item">
          <div className="timeline-dot"></div>
          <div className="timeline-date">2024</div>
          <div className="timeline-title">💻 Personal Projects</div>
          <div className="timeline-desc">Developed Weather App, Task Manager, and Air Draw.</div>
        </div>
        <div className="timeline-item">
          <div className="timeline-dot"></div>
          <div className="timeline-date">2023</div>
          <div className="timeline-title">🚀 Started B.Tech</div>
          <div className="timeline-desc">Began computer science journey at Maharshi Dayanand University.</div>
        </div>
      </div>
    </div>
  );
}
