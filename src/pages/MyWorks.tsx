import { useState } from "react";
import { Link } from "react-router-dom";
import { config } from "../config";
import { FaGithub } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import "./MyWorks.css";

// Interface to match config projects structure
interface Project {
  id: number;
  title: string;
  subtitle?: string;
  positioning?: string;
  category: string;
  technologies: string;
  image: string;
  github: string;
  description: string;
}

const MyWorks = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filterTabs = [
    { id: "All", label: "All" },
    { id: "AI", label: "AI & ML" },
    { id: "Web", label: "Web & Full-Stack" },
    { id: "Other", label: "IoT & Other" }
  ];

  const featuredTitles = ["BOIP", "CHRONA", "KULT SALON", "VoteChain", "GameKroy"];

  // Category mapping function matching logic
  const matchesFilter = (projectCategory: string, filter: string): boolean => {
    if (filter === "All") return true;
    const cat = projectCategory.toLowerCase();
    
    if (filter === "AI") {
      return (
        cat.includes("ai") || 
        cat.includes("ml") || 
        cat.includes("assistant") || 
        cat.includes("engine") || 
        cat.includes("learning") ||
        cat.includes("saas")
      );
    }
    if (filter === "Web") {
      return (
        cat.includes("stack") || 
        cat.includes("blockchain") || 
        cat.includes("web") ||
        cat.includes("saas")
      );
    }
    if (filter === "Security") {
      return cat.includes("security");
    }
    if (filter === "Other") {
      return (
        cat.includes("iot") || 
        cat.includes("hardware")
      );
    }
    return false;
  };

  const filteredProjects = config.projects.filter((project: Project) =>
    matchesFilter(project.category, activeFilter)
  );

  const featuredProjects = filteredProjects.filter((project: Project) =>
    featuredTitles.includes(project.title)
  );

  const moreProjects = filteredProjects.filter((project: Project) =>
    !featuredTitles.includes(project.title)
  );

  const renderTechPills = (technologies: string) => {
    return technologies.split(",").map((tech, idx) => (
      <span className="tech-pill" key={idx}>
        {tech.trim()}
      </span>
    ));
  };

  return (
    <div className="myworks-page">
      <div className="myworks-header">
        <Link to="/" className="back-button" data-cursor="disable">
          ← Back to Home
        </Link>
        <h1>
          Things I've <span>Built</span>
        </h1>
        <p className="myworks-subtitle">Selected projects, experiments, and products I've brought to life.</p>
        
        {/* Filtering Tabs */}
        <div className="filter-tabs-container">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              className={`filter-tab-btn ${activeFilter === tab.id ? "active" : ""}`}
              onClick={() => setActiveFilter(tab.id)}
              data-cursor="disable"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="myworks-container">
        {/* Hierarchical View (Only for 'All' filter) */}
        {activeFilter === "All" ? (
          <>
            {/* Featured Projects Section */}
            {featuredProjects.length > 0 && (
              <div className="projects-section">
                <h2 className="section-type-title">Featured Projects</h2>
                <div className="featured-list">
                  {featuredProjects.map((project: Project) => {
                    const absIndex = config.projects.findIndex((p: Project) => p.id === project.id) + 1;
                    const displayIndex = absIndex < 10 ? `0${absIndex}` : absIndex;
                    const isFlagship = project.title === "BOIP";
                    
                    return (
                      <div
                        className={`featured-item ${isFlagship ? "flagship-item" : ""}`}
                        key={project.id}
                      >
                        <div className="featured-image-wrapper">
                          <img src={project.image} alt={project.title} loading="lazy" />
                          <div className="featured-overlay"></div>
                          {isFlagship && <span className="flagship-label-badge">FLAGSHIP PROJECT</span>}
                        </div>
                        <div className="featured-info-wrapper">
                          <div className="project-index">{displayIndex}</div>
                          <span className="project-category">{project.category}</span>
                          <h3>
                            {project.title}
                            {project.subtitle && <span className="project-subtitle-inline"> — {project.subtitle}</span>}
                          </h3>
                          {project.positioning && <p className="project-positioning">{project.positioning}</p>}
                          <p className="project-desc">{project.description}</p>
                          <div className="project-tech-tags">
                            {renderTechPills(project.technologies)}
                          </div>
                          <div className="project-actions">
                            <button
                              className="project-link-btn primary"
                              onClick={() => setSelectedProject(project)}
                              data-cursor="disable"
                            >
                              View Project
                            </button>
                            {project.github && (
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-link-btn secondary"
                                data-cursor="disable"
                              >
                                <FaGithub /> GitHub
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* More Projects Section */}
            {moreProjects.length > 0 && (
              <div className="projects-section more-section">
                <h2 className="section-type-title">More Projects & Experiments</h2>
                <div className="myworks-grid">
                  {moreProjects.map((project: Project) => {
                    const absIndex = config.projects.findIndex((p: Project) => p.id === project.id) + 1;
                    const displayIndex = absIndex < 10 ? `0${absIndex}` : absIndex;
                    
                    return (
                      <div className="myworks-card" key={project.id}>
                        <div className="myworks-card-image">
                          <img src={project.image} alt={project.title} loading="lazy" />
                          <div className="card-number-badge">{displayIndex}</div>
                        </div>
                        <div className="myworks-card-info">
                          <span className="card-category-label">{project.category}</span>
                          <h3>{project.title}</h3>
                          <p className="myworks-card-description">{project.description}</p>
                          <div className="card-tech-tags">
                            {renderTechPills(project.technologies)}
                          </div>
                          <div className="card-actions">
                            <button
                              className="card-action-btn"
                              onClick={() => setSelectedProject(project)}
                              data-cursor="disable"
                            >
                              View Project
                            </button>
                            {project.github && (
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="card-action-link"
                                data-cursor="disable"
                              >
                                Code <FaGithub />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Uniform Filtered View (For other filters) */
          <div className="projects-section">
            <h2 className="section-type-title">
              {filterTabs.find((t) => t.id === activeFilter)?.label} Projects ({filteredProjects.length})
            </h2>
            {filteredProjects.length > 0 ? (
              <div className="myworks-grid filtered-grid">
                {filteredProjects.map((project: Project) => {
                  const absIndex = config.projects.findIndex((p: Project) => p.id === project.id) + 1;
                  const displayIndex = absIndex < 10 ? `0${absIndex}` : absIndex;
                  const isFeatured = featuredTitles.includes(project.title);
                  const isFlagship = project.title === "BOIP";
                  
                  return (
                    <div className={`myworks-card ${isFeatured ? "featured-card-style" : ""} ${isFlagship ? "flagship-card-style" : ""}`} key={project.id}>
                      <div className="myworks-card-image">
                        <img src={project.image} alt={project.title} loading="lazy" />
                        <div className="card-number-badge">{displayIndex}</div>
                        {isFlagship ? (
                          <span className="flagship-badge">Flagship</span>
                        ) : isFeatured ? (
                          <span className="featured-badge">Featured</span>
                        ) : null}
                      </div>
                      <div className="myworks-card-info">
                        <span className="card-category-label">{project.category}</span>
                        <h3>{project.title}</h3>
                        <p className="myworks-card-description">{project.description}</p>
                        <div className="card-tech-tags">
                          {renderTechPills(project.technologies)}
                        </div>
                        <div className="card-actions">
                          <button
                            className="card-action-btn"
                            onClick={() => setSelectedProject(project)}
                            data-cursor="disable"
                          >
                            View Project
                          </button>
                          {project.github && (
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="card-action-link"
                              data-cursor="disable"
                            >
                              Code <FaGithub />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-projects-message">
                <p>No projects found in this category.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="project-modal-backdrop" onClick={() => setSelectedProject(null)}>
          <div className="project-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedProject(null)}>
              <MdClose />
            </button>
            <div className="modal-header">
              <span className="modal-category">{selectedProject.category}</span>
              <h2>
                {selectedProject.title}
                {selectedProject.subtitle && <span className="modal-subtitle"> — {selectedProject.subtitle}</span>}
              </h2>
              {selectedProject.positioning && (
                <p className="modal-positioning">{selectedProject.positioning}</p>
              )}
            </div>

            <div className="modal-image-wrapper">
              <img src={selectedProject.image} alt={selectedProject.title} />
            </div>

            <div className="modal-body">
              {selectedProject.title === "BOIP" ? (
                <>
                  <div className="modal-section">
                    <h4>Overview</h4>
                    <p>
                      BOIP is an ambitious AI-ready business operating platform designed to bring scattered business information and operations into a unified workspace.
                    </p>
                    <p>
                      Small and medium businesses often rely on disconnected tools such as spreadsheets, email, messaging platforms, accounting software, PDFs, and separate business systems. BOIP explores how these fragmented sources can be organized into a single operational layer.
                    </p>
                  </div>

                  <div className="modal-section">
                    <h4>Problem Statement</h4>
                    <p>
                      Businesses often have plenty of data but very little connected intelligence. Information is scattered across spreadsheets, documents, emails, accounting systems, messaging platforms, and other tools, making it difficult to understand the complete state of the business.
                    </p>
                    <p>
                      BOIP explores a unified approach to organizing this information into one operational platform.
                    </p>
                  </div>

                  <div className="modal-section">
                    <h4>Vision</h4>
                    <p className="highlight-box">
                      "Build a live digital operating layer for businesses — connecting their data, documents, operations, and workflows into one intelligent system."
                    </p>
                  </div>

                  <div className="modal-grid-two">
                    <div className="modal-section">
                      <h4>Currently Built Foundation</h4>
                      <ul className="modal-list">
                        <li>Application Architecture & Auth (RBAC)</li>
                        <li>Business Workspace & Dashboard</li>
                        <li>Data Source Management & File Uploads</li>
                        <li>Document Management & Import Foundation</li>
                        <li>PostgreSQL & Redis Infrastructure</li>
                        <li>Neo4j Graph Infrastructure</li>
                        <li>MinIO Object Storage & pgvector capability</li>
                      </ul>
                    </div>
                    <div className="modal-section">
                      <h4>Future Direction</h4>
                      <ul className="modal-list future-list">
                        <li>Advanced AI Agents & Semantic Search</li>
                        <li>Business Intelligence & RAG Integration</li>
                        <li>Automated Workflows & Recommendations</li>
                        <li>Predictive Intelligence & Integrations</li>
                      </ul>
                    </div>
                  </div>

                  <div className="modal-section">
                    <h4>Technology Stack</h4>
                    <div className="tech-stack-details">
                      <div><strong>Frontend:</strong> Next.js, React, TypeScript, Tailwind CSS</div>
                      <div><strong>Backend:</strong> FastAPI, Python</div>
                      <div><strong>Database:</strong> PostgreSQL, pgvector, Neo4j</div>
                      <div><strong>Infrastructure:</strong> Redis, MinIO, Docker</div>
                    </div>
                  </div>
                </>
              ) : selectedProject.title === "CHRONA" ? (
                <>
                  <div className="modal-section">
                    <h4>Overview</h4>
                    <p>
                      CHRONA explores a new category of software: Personal Intelligence. Instead of keeping information isolated across different applications, CHRONA aims to create a unified personal context layer that connects the information a person chooses to provide.
                    </p>
                    <p>
                      The long-term vision is to build a continuously evolving Life Graph and Personal Brain that can help users remember, understand, plan, decide, and eventually take authorized actions.
                    </p>
                  </div>

                  <div className="modal-section">
                    <h4>Problem Statement</h4>
                    <p>
                      Human digital life is fragmented across disconnected systems (email, cloud drives, photos, calendars, notes, banking apps, receipts) that store information but do not understand the relationships between it. Each system contains only part of the user's context.
                    </p>
                    <p>
                      CHRONA explores how these disconnected pieces can become one connected personal intelligence layer.
                    </p>
                  </div>

                  <div className="modal-section">
                    <h4>Vision</h4>
                    <p className="highlight-box">
                      "Build the world's most trusted Personal Intelligence Platform — an intelligent layer that helps every person understand, manage, and act on their digital life."
                    </p>
                  </div>

                  <div className="modal-grid-two">
                    <div className="modal-section">
                      <h4>Product Model</h4>
                      <ul className="modal-list">
                        <li><strong>Data:</strong> User's digital information</li>
                        <li><strong>Memory:</strong> Unified personal context</li>
                        <li><strong>Life Graph:</strong> Relationships between entities</li>
                        <li><strong>Personal Brain:</strong> Contextual reasoning</li>
                        <li><strong>Assistant:</strong> Chat, voice & actions</li>
                      </ul>
                    </div>
                    <div className="modal-section">
                      <h4>Product Evolution</h4>
                      <ul className="modal-list future-list">
                        <li><strong>Remember:</strong> Unified Context Layer</li>
                        <li><strong>Understand:</strong> Relationship Mapping</li>
                        <li><strong>Help & Notice:</strong> Proactive Insights</li>
                        <li><strong>Act & Platform:</strong> Autonomous Execution</li>
                      </ul>
                    </div>
                  </div>

                  <div className="modal-section">
                    <h4>Technology Stack</h4>
                    <div className="tech-stack-details">
                      <div><strong>Frontend:</strong> Next.js, React, Tailwind CSS</div>
                      <div><strong>Backend:</strong> Python, FastAPI</div>
                      <div><strong>Database & Vector:</strong> PostgreSQL, pgvector</div>
                    </div>
                  </div>
                </>
              ) : selectedProject.title === "KULT SALON" ? (
                <>
                  <div className="modal-section">
                    <h4>Overview</h4>
                    <p>
                      KULT SALON is a premium salon website designed to reflect luxury, style, and confidence. Clean, bold, and conversion-focused digital experience combining elegant visual design, responsive development, clear service discovery, and 08+ pages of interactive salon content.
                    </p>
                  </div>

                  <div className="modal-section">
                    <h4>Core Highlights</h4>
                    <ul className="modal-list">
                      <li><strong>08+ Pages:</strong> Complete salon experience including Services, Gallery, Reviews & Booking</li>
                      <li><strong>100% Responsive:</strong> Tested across desktop, laptop, tablet, and mobile devices</li>
                      <li><strong>Fast Performance:</strong> Optimized asset loading, smooth transitions, and high speed</li>
                      <li><strong>SEO Optimized:</strong> Clean semantic HTML, meta descriptions, and search engine foundations</li>
                    </ul>
                  </div>

                  <div className="modal-section">
                    <h4>Development Process</h4>
                    <ol className="modal-list">
                      <li><strong>01 Research:</strong> Understanding the luxury brand identity and target audience</li>
                      <li><strong>02 UI/UX Design:</strong> Crafted clean, bold, and modern aesthetic with gold/red accents</li>
                      <li><strong>03 Development:</strong> Built with performance, responsiveness, and component scalability</li>
                      <li><strong>04 Testing:</strong> Tested for speed, mobile responsiveness, and SEO readiness</li>
                      <li><strong>05 Launch:</strong> Live digital presence ready to deliver real booking results</li>
                    </ol>
                  </div>

                  <div className="modal-section">
                    <h4>Technologies Used</h4>
                    <div className="tech-stack-details">
                      <div><strong>Technologies:</strong> HTML5, CSS3, JavaScript, Bootstrap</div>
                      <div><strong>Focus:</strong> Responsive Design, UI/UX, Performance Optimization</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="modal-section">
                  <h4>About the Project</h4>
                  <p>{selectedProject.description}</p>
                  
                  <h4 style={{ marginTop: "24px" }}>Technologies Used</h4>
                  <div className="project-tech-tags">
                    {renderTechPills(selectedProject.technologies)}
                  </div>
                </div>
              )}

              <div className="modal-actions">
                {selectedProject.github && (
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link-btn primary"
                  >
                    <FaGithub /> View GitHub Repository
                  </a>
                )}
                <button className="project-link-btn secondary" onClick={() => setSelectedProject(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyWorks;
