import React from 'react';

export default function Contact() {
  return (
    <div className="app-content">
      <div className="app-title">📬 CONTACT</div>
      <a className="contact-item" href="mailto:souravbhardwaj2005@gmail.com">
        <span className="contact-icon">📧</span>
        <div className="contact-info">
          <div className="contact-label">Email</div>
          <div className="contact-value">souravbhardwaj2005@gmail.com</div>
        </div>
      </a>
      <a className="contact-item" href="https://github.com/Sourav-bhardwaj02" target="_blank" rel="noreferrer">
        <span className="contact-icon">🐙</span>
        <div className="contact-info">
          <div className="contact-label">GitHub</div>
          <div className="contact-value">Sourav-bhardwaj02</div>
        </div>
      </a>
      <a className="contact-item" href="https://www.linkedin.com/in/sourav-bhardwaj-7ab839297" target="_blank" rel="noreferrer">
        <span className="contact-icon">💼</span>
        <div className="contact-info">
          <div className="contact-label">LinkedIn</div>
          <div className="contact-value">sourav-bhardwaj-7ab839297</div>
        </div>
      </a>
      <div style={{
        marginTop: '20px',
        padding: '14px',
        background: 'rgba(0,255,65,0.04)',
        border: '1px solid rgba(0,255,65,0.12)',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#aaa',
        textAlign: 'center'
      }}>
        <span className="status-dot"></span> Open to new opportunities &amp; collaborations!
      </div>
    </div>
  );
}
