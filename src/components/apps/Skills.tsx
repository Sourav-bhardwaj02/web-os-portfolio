import React, { useEffect } from 'react';

export default function Skills() {
  const skills = [
    { name: 'JavaScript / TypeScript', pct: 90 }, { name: 'React / Tailwind', pct: 85 },
    { name: 'Node.js / Express', pct: 80 }, { name: 'Python', pct: 75 },
    { name: 'HTML / CSS', pct: 95 }, { name: 'MongoDB / PostgreSQL', pct: 78 },
    { name: 'Firebase', pct: 70 }, { name: 'Git / GitHub', pct: 85 },
    { name: 'UI/UX (Figma/Canva)', pct: 80 }, { name: 'Problem Solving', pct: 90 },
  ];

  const [mounted, setMounted] = React.useState(false);
  
  useEffect(() => {
    // Small delay to allow the CSS transition to trigger after mount
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app-content">
      <div className="app-title">⚙️ SKILLS</div>
      <div id="skill-bars">
        {skills.map((s, i) => (
          <div key={i} className="skill-bar-wrap">
            <div className="skill-bar-label"><span>{s.name}</span><span>{s.pct}%</span></div>
            <div className="skill-bar">
              <div 
                className="skill-bar-fill" 
                style={{ width: mounted ? `${s.pct}%` : '0%', transition: 'width 1s ease-out' }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="app-section" style={{ marginTop: '20px' }}>
        <div className="app-section-title">$ ls tools/</div>
        <div>
          <span className="tag">Git</span>
          <span className="tag">GitHub</span>
          <span className="tag">VS Code</span>
          <span className="tag">Figma</span>
          <span className="tag">Canva</span>
        </div>
      </div>
    </div>
  );
}
