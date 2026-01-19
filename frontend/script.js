const API = ""; // Uses relative paths - works on any domain

// Tech Icons Helper
function getTechIcon(name) {
    const map = {
        // Languages
        "Python": "python", "JavaScript": "javascript", "Javascript": "javascript",
        "Java": "java", "Java.": "java", "C": "c", "C++": "cplusplus", "C#": "csharp",
        "HTML": "html5", "CSS": "css3", "TypeScript": "typescript",
        "Go": "go", "Rust": "rust", "Ruby": "ruby", "PHP": "php", "Swift": "swift", "Kotlin": "kotlin",

        // Frameworks
        "React": "react", "React.js": "react", "Reactjs": "react", "React Native": "react",
        "Next.js": "nextdotjs", "Node.js": "nodedotjs", "Vue": "vuedotjs", "Angular": "angular",
        "FastAPI": "fastapi", "Flask": "flask", "Django": "django", "Express": "express",
        "Tailwind": "tailwindcss", "TailwindCSS": "tailwindcss",
        "LangChain": "langchain", "LangGraph": "langchain",

        // Databases
        "PostgreSQL": "postgresql", "PostgreSQL (SQL)": "postgresql", "MongoDB": "mongodb",
        "MySQL": "mysql", "SQLite": "sqlite", "Redis": "redis", "Prisma": "prisma",

        // Cloud & DevOps
        "Docker": "docker", "Kubernetes": "kubernetes", "AWS": "amazonaws",
        "Vercel": "vercel", "Render": "render", "Neon": "neon", "Firebase": "firebase",
        "Supabase": "supabase", "Heroku": "heroku", "Linux": "linux",

        // Tools
        "VS Code": "visualstudiocode", "Git": "git", "GitHub": "github", "Github": "github",
        "Jupyter": "jupyter", "Jupyter Notebook": "jupyter", "Google Colab": "googlecolab",
        "Canva": "canva", "Notion": "notion", "Figma": "figma",

        // APIs & Auth
        "JWT": "jsonwebtokens", "REST APIs": "fastapi", "APIs": "fastapi",
        "Authentication": "auth0", "Google OAuth": "google", "OAuth": "auth0", "GraphQL": "graphql",

        // AI/ML
        "TensorFlow": "tensorflow", "PyTorch": "pytorch", "OpenAI": "openai",
        "Streamlit": "streamlit", "LLM Integration": "openai", "Prompt Engineering": "openai"
    };

    // Clean up the name
    let cleanName = name.trim();
    if (cleanName.endsWith('.')) cleanName = cleanName.slice(0, -1);
    if (cleanName.includes('/')) cleanName = cleanName.split('/')[0].trim();
    if (cleanName.includes('(')) cleanName = cleanName.split('(')[0].trim();

    // Only return icon URL if we have a known mapping
    const slug = map[name] || map[cleanName];
    if (!slug) return null; // Unknown tech - don't show broken icon
    return `https://cdn.simpleicons.org/${slug}/white`;
}

// Load Data
async function loadAllData() {
    const urlParams = new URLSearchParams(window.location.search);
    let email = urlParams.get('email');
    let mobile = urlParams.get('mobile');

    // Fallback to default email for public profile
    if (!email && !mobile) {
        email = "paarthgala1@gmail.com"; // Default Public Profile
    }

    let query = '';
    if (email) query = `email=${encodeURIComponent(email)}`;
    else if (mobile) query = `mobile=${encodeURIComponent(mobile)}`;
    else return; // Default static view

    try {
        // 1. Basic Info
        const infoRes = await fetch(`${API}/basic-info?${query}`);
        if (infoRes.ok) {
            const info = await infoRes.json();
            renderBasicInfo(info);
        }

        // 2. Projects
        const projRes = await fetch(`${API}/projects?${query}`);
        if (projRes.ok) {
            const projects = await projRes.json();
            renderProjects(projects);
        }

        // 3. Experience
        const expRes = await fetch(`${API}/experiences?${query}`);
        if (expRes.ok) {
            const experiences = await expRes.json();
            renderExperience(experiences);
        }

        // 4. Skills
        const skillRes = await fetch(`${API}/skills?${query}`);
        if (skillRes.ok) {
            const skills = await skillRes.json();
            renderSkills(skills);
        }



    } catch (e) {
        console.error("Error loading data:", e);
    }
}

// -------- RENDER FUNCTIONS --------

function renderBasicInfo(info) {
    // Text fields
    if (info.name) document.getElementById("heroName").textContent = info.name;
    if (info.headline) document.getElementById("heroDescription").textContent = info.headline;

    // About Section
    if (info.about_text) document.getElementById("aboutText").innerText = info.about_text;

    // Profile Image
    const profileImg = document.getElementById('profileImage');
    if (profileImg && info.profile_image) {
        let imgUrl = info.profile_image;

        // Auto-convert Google Drive sharing links to direct image URL
        const driveMatch = imgUrl.match(/drive\.google\.com\/file\/d\/([^\/]+)/);
        if (driveMatch) {
            imgUrl = `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
        }

        profileImg.src = imgUrl;
        profileImg.style.display = 'block';
        profileImg.onload = () => profileImg.classList.add('loaded');
        profileImg.onerror = () => { profileImg.style.display = 'none'; console.error('Profile image failed to load:', imgUrl); };
    }

    // Links - FIXED REDIRECTION
    const updates = [
        { id: "heroLinkedin", val: info.linkedin, attr: "href" },
        { id: "heroGithub", val: info.github, attr: "href" },
        { id: "contactEmail", val: info.email, prefix: "Email: " },
        { id: "contactPhone", val: info.mobile_number, prefix: "Phone: " },
        { id: "contactLinkedin", val: info.linkedin, attr: "href" },
        { id: "contactGithub", val: info.github, attr: "href" },
    ];

    updates.forEach(({ id, val, prefix, attr }) => {
        const el = document.getElementById(id);
        if (el) {
            if (attr) {
                if (val) {
                    el.href = val;
                    el.target = "_blank"; // Force new tab
                    el.style.display = el.classList.contains('social-link') ? 'flex' : 'inline-flex';
                    el.removeAttribute('onclick'); // Clear any interference
                } else {
                    el.href = '#';
                    el.style.display = 'none';
                }
            } else {
                el.textContent = val ? (prefix || "") + val : "";
                if (!val && id.includes("contact")) el.style.display = "none";
            }
        }
    });

    document.getElementById("footerName").textContent = info.name || "Your Name";
}

function renderProjects(projects) {
    const grid = document.getElementById("projectsGrid"); // Legacy container
    const projectsContainer = document.getElementById("projects"); // Main section

    // We use .project-row elements now, usually appended to a specific container
    // But index.html implementation creates them inside 'projectsGrid' usually?
    // Let's check index.html structure. It has id="projectsGrid" inside .container

    if (!grid) return;

    if (projects.length === 0) {
        grid.innerHTML = `<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">No projects added yet</p>`;
        return;
    }

    // Update count
    const countEl = document.getElementById('projectCount');
    if (countEl) countEl.textContent = projects.length;

    // Generate HTML
    grid.innerHTML = projects.map(p => {
        // Tech stack - deduplicate icons
        const uniqueIcons = new Set();
        const techStackHtml = p.tech_stack ? p.tech_stack.split(',').map(t => {
            const tech = t.trim();
            const iconUrl = getTechIcon(tech);
            if (!iconUrl) return '';

            // Avoid duplicate icons (e.g. FastAPI and REST APIs both mapping to fastapi icon)
            if (uniqueIcons.has(iconUrl)) return '';
            uniqueIcons.add(iconUrl);

            return `<img src="${iconUrl}" title="${tech}" alt="${tech}" class="tech-logo">`;
        }).join('') : '';

        // Images for Swiper
        const images = p.images ? p.images.split(',') : [];
        const imagesHtml = images.length > 0 ? images.map(img =>
            `<div class="swiper-slide"><img src="${img.trim()}" alt="${p.name}" loading="lazy"></div>`
        ).join('') : `<div class="swiper-slide"><div style="color:#666">No images</div></div>`;

        return `
        <div class="project-row" data-tech="${p.tech_stack || ''}">
            <div class="project-content">
                <div class="project-header">
                    <h3 class="project-title">${p.name}</h3>
                    <p class="project-oneliner">${p.one_liner}</p>
                    <div class="project-tech-logos">${techStackHtml}</div>
                </div>
                <p class="project-description">${p.description}</p>
                <div class="project-links">
                    ${p.source ? `<a href="${p.source}" target="_blank" class="project-link">GitHub <img src="https://cdn.simpleicons.org/github/white" style="width:16px;height:16px;"></a>` : ""}
                    ${p.link ? `<a href="${p.link}" target="_blank" class="project-link">Live Demo ↗</a>` : ""}
                </div>
            </div>
            <div class="project-images">
                <!-- Swiper -->
                <div class="swiper mySwiper">
                    <div class="swiper-wrapper">
                        ${imagesHtml}
                    </div>
                    <div class="swiper-button-next"></div>
                    <div class="swiper-button-prev"></div>
                    <div class="swiper-pagination"></div>
                </div>
            </div>
        </div>
    `}).join("");

    // Initialize Swiper for each project
    try {
        document.querySelectorAll(".mySwiper").forEach(swiperEl => {
            new Swiper(swiperEl, {
                loop: true,
                pagination: { el: swiperEl.querySelector(".swiper-pagination"), clickable: true },
                navigation: { nextEl: swiperEl.querySelector(".swiper-button-next"), prevEl: swiperEl.querySelector(".swiper-button-prev") },
                autoplay: { delay: 4000, disableOnInteraction: false },
            });
        });
    } catch (e) {
        console.error("Swiper init error:", e);
    }

    renderFilters(projects);
}

function renderFilters(projects) {
    const filterContainer = document.getElementById("projectFilters");
    if (!filterContainer) return;

    // Only search - no buttons
    filterContainer.innerHTML = `
        <div class="project-search-container">
            <input type="text" id="projectSearch" class="project-search-input" placeholder="Search projects...">
        </div>
    `;

    const searchInput = document.getElementById('projectSearch');
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        filterProjects(query);
    });
}

function filterProjects(searchQuery) {
    const rows = document.querySelectorAll('.project-row');
    rows.forEach(row => {
        const textContent = row.textContent.toLowerCase();
        const techStack = (row.dataset.tech || '').toLowerCase();
        // Search in both text content and tech stack
        if (!searchQuery || textContent.includes(searchQuery) || techStack.includes(searchQuery)) {
            row.style.display = 'grid';
        } else {
            row.style.display = 'none';
        }
    });
}

function renderSkills(skills) {
    const grid = document.getElementById("skillsGrid");
    const marquee = document.getElementById("skillsMarquee");
    const marqueeCopy = document.getElementById("skillsMarqueeCopy");

    if (skills.length === 0) {
        if (grid) grid.innerHTML = '';
        if (marquee) marquee.innerHTML = '';
        if (marqueeCopy) marqueeCopy.innerHTML = '';
        return;
    }

    // Extract ALL skills and deduplicate
    const skillSet = new Set();
    skills.forEach(s => {
        if (s.application) {
            s.application.split(',').forEach(app => {
                const trimmed = app.trim();
                if (trimmed) skillSet.add(trimmed);
            });
        }
        if (s.programming_language) {
            s.programming_language.split(',').forEach(lang => {
                const trimmed = lang.trim();
                if (trimmed) skillSet.add(trimmed);
            });
        }
        if (s.technologies) {
            s.technologies.split(',').forEach(tech => {
                const trimmed = tech.trim();
                if (trimmed) skillSet.add(trimmed);
            });
        }
    });

    // Render marquee items - show all, fallback to text only if no icon
    const marqueeItems = Array.from(skillSet).map(skill => {
        const iconUrl = getTechIcon(skill);

        if (!iconUrl) {
            // Text only version
            return `<span class="logo-marquee-item text-only">
                <span>${skill}</span>
            </span>`;
        }

        return `<span class="logo-marquee-item">
            <img src="${iconUrl}" alt="${skill}" onerror="this.style.display='none'">
            <span>${skill}</span>
        </span>`;
    }).join('');

    if (marquee) marquee.innerHTML = marqueeItems;
    if (marqueeCopy) marqueeCopy.innerHTML = marqueeItems;

    // Clear grid (only marquee)
    if (grid) grid.innerHTML = '';
}

function renderExperience(experiences) {
    const timeline = document.getElementById("experienceTimeline");
    if (!timeline) return;

    if (experiences.length === 0) {
        timeline.innerHTML = `<p style="color: var(--text-muted); text-align: center;">No experience added yet</p>`;
        return;
    }

    // Calculate Experience Duration in Months
    let minDate = new Date();
    let hasDates = false;

    experiences.forEach(exp => {
        if (exp.start_date) {
            const date = new Date(exp.start_date);
            if (!isNaN(date.getTime()) && (date < minDate || !hasDates)) {
                minDate = date;
                hasDates = true;
            }
        }
    });

    const countEl = document.getElementById('expCount');
    if (countEl && hasDates) {
        const now = new Date();
        const months = (now.getFullYear() - minDate.getFullYear()) * 12 + (now.getMonth() - minDate.getMonth());

        if (months < 12) {
            const displayMonths = Math.max(1, months);
            countEl.textContent = displayMonths + " Months";
            const label = countEl.nextElementSibling;
            if (label) label.textContent = "Experience";
        } else {
            const years = Math.floor(months / 12);
            countEl.textContent = years + "+";
            const label = countEl.nextElementSibling;
            if (label) label.textContent = "Years Exp";
        }
    } else if (countEl && experiences.length > 0) {
        countEl.textContent = experiences.length;
        const label = countEl.nextElementSibling;
        if (label) label.textContent = "Positions";
    }

    timeline.innerHTML = experiences.map(exp => `
        <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <span class="timeline-date">${exp.start_date || ""} - ${exp.end_date || "Present"}</span>
                <h3 class="timeline-title">${exp.role}</h3>
                <h4 class="timeline-subtitle">${exp.company_name}</h4>
                <p class="timeline-desc">${exp.description}</p>
            </div>
        </div>
    `).join("");
}



// -------- AUTO LOAD --------
document.addEventListener("DOMContentLoaded", () => {
    loadAllData();
});

// Expose functions for onclick handlers
window.loadAllData = loadAllData;

// Smooth scroll - only for internal section links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        // Only handle internal links like #projects, #about, etc.
        // Skip links that are just "#" (placeholder for dynamic URLs)
        if (href && href.length > 1 && href.startsWith('#')) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
            }
        }
    });
});
