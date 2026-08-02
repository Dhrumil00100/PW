import React, { useEffect, useRef, useState } from "react";
import "./styles/Career.css";
import { config } from "../config";

const getDisplayYear = (period: string) => {
  if (period.includes("Present")) return "NOW";
  if (period.includes(" - ")) {
    return period.split(" - ")[0]; // Show start year for ranges
  }
  return period; // Single year like "2021"
};

const Career = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (timelineRef.current) {
        const parent = timelineRef.current.parentElement;
        if (parent) {
          const rect = parent.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          // Start animating when the top of the container is near the middle of the screen
          const startScroll = windowHeight / 2;
          const scrolled = startScroll - rect.top;
          
          let progress = (scrolled / rect.height) * 100;
          progress = Math.max(0, Math.min(100, progress));
          setScrollProgress(progress);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          Building the <span>Future</span>
        </h2>
        <p className="career-subtitle">
          Turning ideas into AI-powered products, one project at a time.
        </p>
        <div className="career-info">
          <div 
            className="career-timeline" 
            ref={timelineRef}
            style={{ maxHeight: `${scrollProgress}%` }}
          >
            <div className="career-dot"></div>
          </div>
          {config.experiences.map((exp, index) => (
            <div key={index} className="career-info-box">
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{exp.position}</h4>
                  <h5>{exp.company}</h5>
                </div>
                <h3>{getDisplayYear(exp.period)}</h3>
              </div>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;
