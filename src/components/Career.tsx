import React, { useEffect, useRef } from "react";
import "./styles/Career.css";
import { config } from "../config";
import { LuGraduationCap, LuCode, LuBot, LuRocket, LuGlobe } from "react-icons/lu";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "education": return <LuGraduationCap />;
    case "development": return <LuCode />;
    case "ai": return <LuBot />;
    case "rocket": return <LuRocket />;
    case "vision": return <LuGlobe />;
    default: return <LuCode />;
  }
};

const Career = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll progress for the timeline line
    const handleScroll = () => {
      if (timelineRef.current && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        // Start filling timeline when the top of container is 1/3 down the screen
        const startScroll = windowHeight / 1.5; 
        const scrolled = startScroll - rect.top;
        
        // Progress reaches 100% when the bottom of container reaches the middle of the screen
        let progress = (scrolled / rect.height) * 100;
        progress = Math.max(0, Math.min(100, progress));
        timelineRef.current.style.height = `${progress}%`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    
    // Intersection Observer for milestones fade + slide up
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, { threshold: 0.2 });
    
    const elements = document.querySelectorAll(".milestone-card");
    elements.forEach(el => observer.observe(el));

    // Mouse tracking for glassmorphism hover glow effect (Linear/Vercel style)
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll(".milestone-card");
      cards.forEach((card) => {
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (card as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
        (card as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);

    // Refresh GSAP ScrollTrigger to ensure downstream pinned sections (like Work)
    // recalculate their start positions based on this component's exact height.
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="career-section section-container" id="journey">
      <div className="career-container">
        <h2>
          Journey Through <span>Technology</span>
        </h2>
        
        <div className="roadmap-container" ref={containerRef}>
          <div className="roadmap-timeline">
            <div className="roadmap-line-bg"></div>
            <div className="roadmap-line-progress" ref={timelineRef}>
              <div className="roadmap-glow-dot"></div>
            </div>
          </div>
          
          <div className="roadmap-milestones">
            {config.experiences.map((exp: any, index: number) => (
              <div key={index} className={`milestone-wrapper ${index % 2 === 0 ? "left" : "right"}`}>
                <div className="milestone-dot">
                  <div className="milestone-icon">{getIcon(exp.icon)}</div>
                </div>
                <div className="milestone-card">
                  <div className="milestone-stage">{exp.stage}</div>
                  <h3 className="milestone-title">{exp.title}</h3>
                  <p className="milestone-desc">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
