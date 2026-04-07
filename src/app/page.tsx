"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { DEFAULT_DATA } from "./data";

const getTechIcon = (name: string) => {
  const map: Record<string, string> = {
    Python: "python", JavaScript: "javascript", Javascript: "javascript",
    Java: "java", C: "c", "C++": "cplusplus", "C#": "csharp",
    HTML: "html5", CSS: "css3", TypeScript: "typescript",
    Go: "go", Rust: "rust", Ruby: "ruby", PHP: "php", Swift: "swift", Kotlin: "kotlin",
    React: "react", "Next.js": "nextdotjs", "Node.js": "nodedotjs", Vue: "vuedotjs", Angular: "angular",
    FastAPI: "fastapi", Flask: "flask", Django: "django", Express: "express",
    Tailwind: "tailwindcss", PostgreSQL: "postgresql", MongoDB: "mongodb", MySQL: "mysql",
    Docker: "docker", Kubernetes: "kubernetes", AWS: "amazonaws", Vercel: "vercel",
    Git: "git", GitHub: "github", Figma: "figma", JWT: "jsonwebtokens",
    OpenAI: "openai", LangChain: "langchain", LangGraph: "langchain", Pinecone: "pinecone", Streamlit: "streamlit",
    Redis: "redis"
  };

  let cleanName = name.trim().split(' ')[0].split('(')[0].replace(/\.$/, "");
  const slug = map[name] || map[cleanName];
  return slug ? `https://cdn.simpleicons.org/${slug}/white` : null;
};

// ---------------- MAIN PAGE COMPONENT ----------------
export default function PortfolioPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const data = DEFAULT_DATA;

  const filteredProjects = (data.projects || []).filter((p: any) =>
    searchQuery === "" ||
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tech_stack?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFullSkills = () => {
    const skillSet = new Set<string>();
    (data.skills || []).forEach((s: any) => {
      [s.application, s.programming_language, s.technologies].forEach(str => {
        if (str) str.split(',').forEach((v: string) => skillSet.add(v.trim()));
      });
    });
    return Array.from(skillSet);
  };

  const { info } = data;

  return (
    <>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <a href="#hero" className="logo">Portfolio</a>
          <div className={`nav-links ${mobileNavOpen ? 'mobile-active' : ''}`}>
            {mobileNavOpen && <button className="close-mobile-nav" onClick={() => setMobileNavOpen(false)}>×</button>}
            <a href="#hero" onClick={() => setMobileNavOpen(false)}>Home</a>
            <a href="#about" onClick={() => setMobileNavOpen(false)}>About</a>
            <a href="#experience" onClick={() => setMobileNavOpen(false)}>Experience</a>
            <a href="#projects" onClick={() => setMobileNavOpen(false)}>Projects</a>
            <a href="#skills" onClick={() => setMobileNavOpen(false)}>Skills</a>
            <a href="#contact" onClick={() => setMobileNavOpen(false)}>Contact</a>
          </div>
          <button className="nav-toggle" onClick={() => setMobileNavOpen(true)}>☰</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero">
        <div className="hero-content">
          <div className="hero-badge">Available for work</div>
          <h1 className="hero-title">{info.name}</h1>
          <p className="hero-subtitle">{info.headline}</p>
          <p className="hero-description">
            Building digital experiences that matter. Passionate about creating elegant solutions to complex problems.
          </p>
          <div className="hero-buttons">
            <a href="#projects" className="btn btn-primary">View Projects →</a>
            <a href="#contact" className="btn btn-secondary">Get in Touch</a>
          </div>
          <div className="hero-social">
            {info.github && <a href={info.github} target="_blank" className="social-link">GitHub</a>}
            {info.linkedin && <a href={info.linkedin} target="_blank" className="social-link">LinkedIn</a>}
          </div>
        </div>
        <div className="hero-visual">
          {info.profile_image && (
            <img 
              src={info.profile_image.startsWith('/') ? info.profile_image : (info.profile_image.includes('drive.google.com') ? `https://drive.google.com/uc?export=view&id=${info.profile_image.match(/file\/d\/([^\/]+)/)?.[1]}` : info.profile_image)} 
              alt="Profile" 
              className="profile-img-hero loaded" 
            />
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section about">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">About Me</span>
            <h2 className="section-title">Crafting digital experiences with precision and creativity</h2>
          </div>
          <div className="about-content">
            <div className="about-text">
              <p>{info.about_text || "I'm a passionate developer who loves turning ideas into reality through code."}</p>
            </div>
            <div className="about-stats">
              <div className="stat-item">
                <span className="stat-number">{data.projects.length}</span>
                <span className="stat-label">Projects</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="section experience">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Experience</span>
            <h2 className="section-title">Professional Journey</h2>
          </div>
          <div className="timeline">
            {data.experiences.map((exp: any) => (
              <div key={exp.id} className="timeline-item">
                <div className="timeline-header">
                  <div>
                    <h3 className="timeline-role">{exp.role}</h3>
                    <h4 className="timeline-company">{exp.company_name}</h4>
                  </div>
                  <span className="timeline-date">{exp.start_date} - {exp.end_date || "Present"}</span>
                </div>
                <p className="timeline-desc">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section projects">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">My Work</span>
            <h2 className="section-title">Featured Projects</h2>
          </div>
          <div className="project-filters">
            <div className="project-search-container">
              <input 
                type="text" 
                className="project-search-input" 
                placeholder="Search projects..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="projects-grid">
            {filteredProjects.length > 0 ? filteredProjects.map((p: any) => (
              <div key={p.id} className="project-row">
                <div className="project-content">
                  <div className="project-header">
                    <h3 className="project-title">{p.name}</h3>
                    <p className="project-oneliner">{p.one_liner}</p>
                    <div className="project-tech-logos">
                      {p.tech_stack?.split(',').map((tech: string, i: number) => {
                        const icon = getTechIcon(tech.trim());
                        return icon ? (
                          <span key={i} className="tech-indicator-wrap" aria-hidden="true">
                            <img
                              src={icon}
                              alt=""
                              className="tech-logo"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                                if (fallback) fallback.style.display = "inline-block";
                              }}
                            />
                            <span className="tech-indicator-dot tech-indicator-fallback" />
                          </span>
                        ) : (
                          <span key={i} className="tech-indicator-dot" aria-hidden="true" />
                        );
                      })}
                    </div>
                  </div>
                  <p className="project-description">{p.description}</p>
                  <div className="project-links">
                    {p.source && <a href={p.source} target="_blank" className="project-link">GitHub</a>}
                    {p.link && <a href={p.link} target="_blank" className="project-link">Live Demo ↗</a>}
                  </div>
                </div>
                <div className="project-images">
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 4000 }}
                    loop={true}
                    className="mySwiper"
                  >
                    {(p.images ? p.images.split(',') : []).map((img: string, i: number) => (
                      <SwiperSlide key={i}>
                        <img src={img.trim()} alt={p.name} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            )) : <p style={{textAlign: 'center', color: 'var(--text-muted)'}}>No projects found</p>}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section skills">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Skills</span>
            <h2 className="section-title">Technologies I Work With</h2>
          </div>
          <div className="logo-marquee">
            <div className="logo-marquee-track">
              <div className="logo-marquee-content">
                {[...getFullSkills(), ...getFullSkills()].map((skill, i) => {
                  const icon = getTechIcon(skill);
                  return (
                    <div key={i} className="logo-marquee-item">
                      {icon && <img src={icon} alt={skill} />}
                      <span>{skill}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section contact">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Get In Touch</span>
            <h2 className="section-title">Let's Work Together</h2>
          </div>
          <div className="contact-content">
            <p className="contact-email">{info.email}</p>
            <p className="contact-phone">{info.mobile_number}</p>
            <div className="contact-links">
              {info.github && <a href={info.github} target="_blank" className="contact-link">GitHub →</a>}
              {info.linkedin && <a href={info.linkedin} target="_blank" className="contact-link">LinkedIn →</a>}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>© 2024 {info.name}. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
