export const DEFAULT_DATA = {
  info: {
    name: "Paarth Gala",
    headline: "AI Intern & Backend Developer",
    email: "paarthgala1@gmail.com",
    mobile_number: "+919136144566",
    linkedin: "https://www.linkedin.com/in/paarth-gala-8105022a6",
    github: "https://github.com/paarths-collab",
    profile_image: "/images/profile.jpg",
    about_text: "I am an Artificial Intelligence & Data Science undergraduate with hands-on experience building AI-powered platforms, backend systems, and LLM-driven applications. My work focuses on designing scalable APIs, integrating machine learning and language models, and deploying production-ready systems using modern cloud and containerization tools.\n\nI have built end-to-end products across misinformation analysis, resume evaluation, fintech research, and campus mobility, with a strong emphasis on ethical and responsible AI. I enjoy solving real-world problems by combining technical depth, product thinking, and clean system design, and I am continuously learning at the intersection of AI, backend engineering, and applied research.",
    description: "Building scalable AI systems and backend platforms with LLMs and ethical AI at the core."
  },
  projects: [
    {
      id: 1,
      name: "Aletheia",
      one_liner: "AI-Powered Misinformation Detection Platform",
      tech_stack: "FastAPI, Python, React, Docker, Vercel, APIs",
      description: "Aletheia is an AI-driven misinformation detection platform designed to analyze and verify digital content through claim verification, AI-generated content detection, and deepfake identification. The system combines NLP and deep learning models with LLM-based reasoning to assess content authenticity and generate explainable risk insights. Built with a scalable FastAPI backend, a responsive React.js frontend, and deployed using Docker and Vercel, Aletheia focuses on delivering transparent, ethical, and context-aware AI-powered verification.",
      images: "/images/Aletheia-front.png",
      source: null,
      link: "https://aletheia-mumbaihacks.vercel.app/"
    },
    {
      id: 2,
      name: "Resume Analyzer",
      one_liner: "AI-Powered Resume Evaluation Platform",
      tech_stack: "Python, FastAPI, HTML, CSS, JavaScript, PostgreSQL, Docker, Render, Vercel, Google OAuth",
      description: "An AI-powered platform that evaluates resumes against job descriptions by extracting resume content, performing semantic skill matching, and generating actionable improvement suggestions. The system features secure authentication, scalable backend services, and a responsive web interface for real-world usage.",
      images: "/images/resume-analyzer-front.png",
      source: null,
      link: "https://resume-analyzer-two-beta.vercel.app/"
    },
    {
      id: 3,
      name: "Bloomberg-Quant",
      one_liner: "AI-Driven Financial Analysis & Quantitative Research Tool",
      tech_stack: "Python, FastAPI, React, TypeScript, LangGraph, PostgreSQL, Redis, Docker",
      description: "A comprehensive financial analysis platform offering market overviews, deep stock analysis, quantitative strategy backtesting, and AI-driven investment insights. It enables users to evaluate multiple trading strategies, simulate portfolios through paper trading, and receive personalized recommendations.",
      images: "/images/bloomberg-quant.png",
      source: "https://github.com/paarths-collab/Bloomberg",
      link: null
    },
    {
      id: 4,
      name: "TripSync",
      one_liner: "Campus Mobility & Networking Application",
      tech_stack: "Python, FastAPI, PostgreSQL, Docker, React Native",
      description: "TripSync is a campus-focused mobility platform that enables students to travel safely and cost-effectively while fostering academic collaboration. The application features a FastAPI-based backend for ride matching, authentication, and data management, along with a cross-platform mobile frontend supporting real-time ride tracking and user messaging.",
      images: null,
      source: null,
      link: null
    },
    {
      id: 5,
      name: "RAG System",
      one_liner: "A Retrieval-Augmented Generation system for intelligent document querying.",
      tech_stack: "Python, FastAPI, LangChain, Vector DB",
      description: "This project implements a RAG system that allows users to query their documents using natural language. It uses a vector database to index documents and an LLM to generate accurate answers based on the retrieved context.",
      images: "/images/rag-system.png",
      source: "https://github.com/paarths-collab/rag-system",
      link: "https://rag-system-2mps.onrender.com/"
    },
    {
      id: 6,
      name: "NarrativeSignal",
      one_liner: "AI-Powered News Analysis and Narrative Intelligence Platform",
      tech_stack: "Next.js, React, TypeScript, FastAPI, Python, DuckDB, LangChain, LiteLLM",
      description: "An intelligent news analysis platform that aggregates financial and political news, processes it through advanced NLP and LLM models to identify narrative patterns and market signals. Features real-time trend analysis, sentiment tracking, and AI-powered insights generation for investors and analysts.",
      images: "/images/narrativesignal.png",
      source: "https://github.com/0xSaurabhx/NarrativeSignal",
      link: "https://narrativesignal.vercel.app/"
    }
  ],
  experiences: [
    {
      id: 2,
      company_name: "Client Project",
      role: "NSE News-to-Telegram Automation",
      start_date: "Mar 2026",
      end_date: "Apr 2026",
      description: "Built an automated news intelligence pipeline for a client to deliver real-time NSE (National Stock Exchange) market updates via Telegram. Implemented web scraping infrastructure to ingest financial news from multiple sources, built NLP-based processing to filter and prioritize relevant market signals, and designed a message routing system to deliver curated alerts to Telegram channels with minimal latency. Integrated error handling, retry logic, and monitoring to ensure 99%+ uptime for daily market operations, demonstrating ability to build production-grade backend automation systems."
    },
    {
      id: 1,
      company_name: "SimPPL",
      role: "Fellow Researcher",
      start_date: "Jan 2025",
      end_date: "June 2025",
      description: "Served as CEO and Fellowship Researcher at a Mozilla-funded Responsible AI initiative, leading research and development efforts focused on transparent, fair, and ethical AI systems. Led collaborations with researchers from MIT and NYU to explore scalable, privacy-preserving AI solutions, while overseeing the design and prototyping of tools that promote inclusive and accountable AI. Actively supported open-source initiatives aimed at democratizing access to responsible AI technologies."
    }
  ],
  skills: [
    {
      id: 1,
      programming_language: "Python, JavaScript, TypeScript",
      application: "HTML/CSS, Git, GitHub, Vercel, Render, Neon, Docker",
      technologies: "FastAPI, React, Next.js, Machine Learning, Deep Learning, NLP, OpenCV, RAG, LLM Fine-Tuning, LangChain, LangGraph, CrewAI, PostgreSQL, REST APIs, Authentication, JWT, Google OAuth, LLM Integration, Prompt Engineering"
    }
  ]
};
