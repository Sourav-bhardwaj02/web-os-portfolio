'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { createRoot } from 'react-dom/client';
import ParticleField from '@/components/ParticleField';

import About from '@/components/apps/About';
import Projects from '@/components/apps/Projects';
import Skills from '@/components/apps/Skills';
import Experience from '@/components/apps/Experience';
import Resume from '@/components/apps/Resume';
import Contact from '@/components/apps/Contact';
import Timeline from '@/components/apps/Timeline';

export default function Home() {
  const [themeColor, setThemeColor] = useState('#ffffff');

  useEffect(() => {
    const handleThemeChange = (e: any) => {
      setThemeColor(e.detail?.color || '#00ff41');
    };
    window.addEventListener('themeColorChange', handleThemeChange);

    // Register React App Mounter for vanilla OS.js
    (window as any).mountReactApp = (appId: string, containerId: string) => {
      const container = document.getElementById(containerId);
      if (!container) return;
      
      const root = createRoot(container);
      
      switch (appId) {
        case 'about': root.render(<About />); break;
        case 'projects': root.render(<Projects />); break;
        case 'skills': root.render(<Skills />); break;
        case 'experience': root.render(<Experience />); break;
        case 'resume': root.render(<Resume />); break;
        case 'contact': root.render(<Contact />); break;
        case 'timeline': root.render(<Timeline />); break;
      }
    };

    return () => window.removeEventListener('themeColorChange', handleThemeChange);
  }, []);

  return (
    <>
      {/* BOOT SCREEN */}
      <div id="boot-screen">
        <div id="boot-content">
          <div id="boot-logo">SOURAV-OS</div>
          <div id="boot-subtitle">v1.0.2026 | Portfolio System</div>
          <div id="boot-terminal">
            <div id="boot-lines"></div>
            <div id="boot-bar-wrap">
              <div id="boot-bar-label">Loading kernel modules...</div>
              <div className="boot-bar"><div id="boot-progress"></div></div>
            </div>
          </div>
          <div id="boot-hint">Press any key or wait...</div>
        </div>
      </div>

      {/* LOGIN SCREEN */}
      <div id="login-screen" style={{ display: 'none' }}>
        <div id="login-box">
          <div id="login-avatar">👤</div>
          <div id="login-name">sourav</div>
          <button id="login-btn">Login →</button>
          <div id="login-hint">Click Login to continue</div>
        </div>
      </div>

      {/* DESKTOP */}
      <div id="desktop" style={{ display: 'none' }}>
        <ParticleField color={themeColor} particleShape="sphere" />


        {/* TASKBAR */}
        <div id="taskbar">
          <div id="taskbar-left">
            <div id="taskbar-menu-btn" className="taskbar-btn" title="App Menu">☰ Menu</div>
            <div id="taskbar-term-btn" className="taskbar-btn" title="Open Terminal" onClick={() => (window as any).openApp?.('terminal')}>⬛ Terminal</div>
          </div>
          <div id="taskbar-center">
            <div id="taskbar-clock">00:00</div>
          </div>
          <div id="taskbar-right">
            <div className="taskbar-status">🔊</div>
            <div className="taskbar-status">📶</div>
            <div id="taskbar-date"></div>
          </div>
        </div>

        {/* DESKTOP ICONS */}
        <div id="desktop-icons">
          <div className="desktop-icon" onDoubleClick={() => (window as any).openApp?.('about')} id="icon-about">
            <div className="icon-img">👤</div>
            <div className="icon-label">About</div>
          </div>
          <div className="desktop-icon" onDoubleClick={() => (window as any).openApp?.('projects')} id="icon-projects">
            <div className="icon-img">📁</div>
            <div className="icon-label">Projects</div>
          </div>
          <div className="desktop-icon" onDoubleClick={() => (window as any).openApp?.('skills')} id="icon-skills">
            <div className="icon-img">⚙️</div>
            <div className="icon-label">Skills</div>
          </div>
          <div className="desktop-icon" onDoubleClick={() => (window as any).openApp?.('experience')} id="icon-experience">
            <div className="icon-img">💼</div>
            <div className="icon-label">Experience</div>
          </div>
          <div className="desktop-icon" onDoubleClick={() => (window as any).openApp?.('resume')} id="icon-resume">
            <div className="icon-img">📄</div>
            <div className="icon-label">Resume</div>
          </div>
          <div className="desktop-icon" onDoubleClick={() => (window as any).openApp?.('contact')} id="icon-contact">
            <div className="icon-img">📬</div>
            <div className="icon-label">Contact</div>
          </div>
          <div className="desktop-icon" onDoubleClick={() => (window as any).openApp?.('timeline')} id="icon-timeline">
            <div className="icon-img">📅</div>
            <div className="icon-label">Timeline</div>
          </div>
          <div className="desktop-icon" onDoubleClick={() => (window as any).openApp?.('radar')} id="icon-radar">
            <div className="icon-img">📊</div>
            <div className="icon-label">Radar</div>
          </div>
          <div className="desktop-icon" onDoubleClick={() => (window as any).openApp?.('terminal')} id="icon-terminal">
            <div className="icon-img">⬛</div>
            <div className="icon-label">Terminal</div>
          </div>
          <div className="desktop-icon" onDoubleClick={() => (window as any).openApp?.('tetris')} id="icon-tetris">
            <div className="icon-img">🎮</div>
            <div className="icon-label">Tetris</div>
          </div>
          <div className="desktop-icon" onDoubleClick={() => (window as any).openApp?.('snake')} id="icon-snake">
            <div className="icon-img">🐍</div>
            <div className="icon-label">Snake</div>
          </div>
          <div className="desktop-icon" onDoubleClick={() => (window as any).openApp?.('display')} id="icon-display">
            <div className="icon-img">🖥️</div>
            <div className="icon-label">Display</div>
          </div>
        </div>

        {/* WINDOWS CONTAINER */}
        <div id="windows-container"></div>

        {/* APP MENU POPUP */}
        <div id="app-menu" style={{ display: 'none' }}>
          <div className="menu-item" onClick={() => (window as any).openApp?.('about')}>👤 About Me</div>
          <div className="menu-item" onClick={() => (window as any).openApp?.('projects')}>📁 Projects</div>
          <div className="menu-item" onClick={() => (window as any).openApp?.('skills')}>⚙️ Skills</div>
          <div className="menu-item" onClick={() => (window as any).openApp?.('experience')}>💼 Experience</div>
          <div className="menu-item" onClick={() => (window as any).openApp?.('resume')}>📄 Resume</div>
          <div className="menu-item" onClick={() => (window as any).openApp?.('contact')}>📬 Contact</div>
          <div className="menu-item" onClick={() => (window as any).openApp?.('timeline')}>📅 Timeline</div>
          <div className="menu-item" onClick={() => (window as any).openApp?.('radar')}>📊 Skill Radar</div>
          <div className="menu-item" onClick={() => (window as any).openApp?.('terminal')}>⬛ Terminal</div>
          <div className="menu-divider"></div>
          <div className="menu-item" onClick={() => (window as any).openApp?.('tetris')}>🎮 Tetris</div>
          <div className="menu-item" onClick={() => (window as any).openApp?.('snake')}>🐍 Snake</div>
          <div className="menu-divider"></div>
          <div className="menu-item menu-danger" onClick={() => (window as any).handleShutdown?.()}>⏻ Shutdown</div>
        </div>

      </div>

      {/* SHUTDOWN OVERLAY */}
      <div id="shutdown-screen" style={{ display: 'none' }}>
        <div id="shutdown-content">
          <div id="shutdown-text">System shutting down...</div>
          <div id="shutdown-hint">Thank you for visiting! Refresh to restart.</div>
        </div>
      </div>

      <Script src="/scripts/os.js" strategy="afterInteractive" />
    </>
  );
}
