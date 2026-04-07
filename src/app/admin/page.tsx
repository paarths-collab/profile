"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type TabKey = "basic" | "project" | "experience" | "skill" | "hobby";
type ItemType = "project" | "experience" | "skill" | "hobby";

type BasicInfoPayload = {
  name: string;
  email: string;
  mobile_number: string | null;
  current_college: string | null;
  profile_image: string | null;
  headline: string | null;
  about_text: string | null;
  linkedin: string | null;
  github: string | null;
  description: string | null;
  bio: string | null;
};

type ProjectPayload = {
  name: string;
  one_liner: string;
  tech_stack: string;
  description: string;
  source: string | null;
  link: string | null;
  images: string | null;
};

type ExperiencePayload = {
  company_name: string;
  role: string;
  start_date: string | null;
  end_date: string | null;
  description: string;
};

type SkillPayload = {
  application: string;
  programming_language: string;
  technologies: string;
};

type HobbyPayload = {
  hobby_name: string;
};

type Project = ProjectPayload & { id: number };
type Experience = ExperiencePayload & { id: number };
type Skill = SkillPayload & { id: number };
type Hobby = { id: number; hobby_name?: string; name?: string; description?: string };

const API = "";

export default function AdminPage() {
  const router = useRouter();

  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("basic");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [basicForm, setBasicForm] = useState({
    name: "",
    email: "",
    mobile: "",
    college: "",
    image: "",
    headline: "",
    about: "",
    description: "",
    linkedin: "",
    github: "",
    bio: "",
  });

  const [projectForm, setProjectForm] = useState({
    name: "",
    one_liner: "",
    tech_stack: "",
    description: "",
    source: "",
    link: "",
    images: "",
  });

  const [experienceForm, setExperienceForm] = useState({
    company_name: "",
    role: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  const [skillForm, setSkillForm] = useState({
    application: "",
    programming_language: "",
    technologies: "",
  });

  const [hobbyName, setHobbyName] = useState("");

  const [editState, setEditState] = useState<{ type: ItemType | null; id: number | null }>({
    type: null,
    id: null,
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [hobbies, setHobbies] = useState<Hobby[]>([]);

  useEffect(() => {
    const localToken = localStorage.getItem("token") ?? "";
    const userEmail = localStorage.getItem("user_email") ?? "";

    if (!localToken || !userEmail) {
      router.replace("/login");
      return;
    }

    setToken(localToken);
    setBasicForm((prev) => ({ ...prev, email: userEmail }));
  }, [router]);

  useEffect(() => {
    if (!token) return;
    loadBasicInfoForEdit();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    if (!getIdentifier()) return;

    if (activeTab === "project") void loadProjects();
    if (activeTab === "experience") void loadExperiences();
    if (activeTab === "skill") void loadSkills();
    if (activeTab === "hobby") void loadHobbies();
  }, [activeTab, token]);

  const showMessage = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type });
    window.setTimeout(() => setMessage(null), 5000);
  };

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  });

  const clearEditMode = (type: ItemType) => {
    if (editState.type === type) {
      setEditState({ type: null, id: null });
    }
  };

  const getIdentifier = () => {
    const email = basicForm.email.trim();
    const mobile = basicForm.mobile.trim();

    if (email) return `email=${encodeURIComponent(email)}`;
    if (mobile) return `mobile=${encodeURIComponent(mobile)}`;
    return null;
  };

  const loadBasicInfoForEdit = async () => {
    const identifier = getIdentifier();
    if (!identifier) {
      showMessage("Please enter Email or Mobile first to load data", "error");
      return;
    }

    try {
      const response = await fetch(`${API}/basic-info?${identifier}`);
      if (!response.ok) {
        showMessage("User not found. Fill details to create new.", "error");
        return;
      }

      const data = (await response.json()) as Partial<BasicInfoPayload>;
      setBasicForm((prev) => ({
        ...prev,
        name: data.name ?? "",
        email: data.email ?? prev.email,
        mobile: data.mobile_number ?? "",
        college: data.current_college ?? "",
        image: data.profile_image ?? "",
        headline: data.headline ?? "",
        about: data.about_text ?? "",
        description: data.description ?? "",
        linkedin: data.linkedin ?? "",
        github: data.github ?? "",
        bio: data.bio ?? "",
      }));

      showMessage("Loaded existing info! Make changes and click Save.");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      showMessage(`Error loading data: ${msg}`, "error");
    }
  };

  const saveBasicInfo = async () => {
    const payload: BasicInfoPayload = {
      name: basicForm.name,
      email: basicForm.email,
      mobile_number: basicForm.mobile || null,
      current_college: basicForm.college || null,
      profile_image: basicForm.image || null,
      headline: basicForm.headline || null,
      about_text: basicForm.about || null,
      linkedin: basicForm.linkedin || null,
      github: basicForm.github || null,
      description: basicForm.description || null,
      bio: basicForm.bio || null,
    };

    try {
      const response = await fetch(`${API}/basic-info`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json()) as { detail?: string };
        showMessage(data.detail ?? "Error saving basic info", "error");
        return;
      }

      showMessage("Basic info saved successfully!");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      showMessage(`Error: ${msg}`, "error");
    }
  };

  const addProject = async () => {
    const identifier = getIdentifier();
    if (!identifier) {
      showMessage("Please save basic info first (need email)", "error");
      return;
    }

    const payload: ProjectPayload = {
      name: projectForm.name,
      one_liner: projectForm.one_liner,
      tech_stack: projectForm.tech_stack,
      description: projectForm.description,
      source: projectForm.source || null,
      link: projectForm.link || null,
      images: projectForm.images || null,
    };

    try {
      const isEdit = editState.type === "project" && editState.id !== null;
      const endpoint = isEdit ? `${API}/projects/${editState.id}` : `${API}/projects?${identifier}`;
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json()) as { detail?: string };
        showMessage(data.detail ?? "Error saving project", "error");
        return;
      }

      showMessage(isEdit ? "Project updated!" : "Project added successfully!");
      setProjectForm({ name: "", one_liner: "", tech_stack: "", description: "", source: "", link: "", images: "" });
      clearEditMode("project");
      await loadProjects();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      showMessage(`Error: ${msg}`, "error");
    }
  };

  const addExperience = async () => {
    const identifier = getIdentifier();
    if (!identifier) {
      showMessage("Please save basic info first (need email)", "error");
      return;
    }

    const payload: ExperiencePayload = {
      company_name: experienceForm.company_name,
      role: experienceForm.role,
      start_date: experienceForm.start_date || null,
      end_date: experienceForm.end_date || null,
      description: experienceForm.description,
    };

    try {
      const isEdit = editState.type === "experience" && editState.id !== null;
      const endpoint = isEdit ? `${API}/experiences/${editState.id}` : `${API}/experiences?${identifier}`;
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json()) as { detail?: string };
        showMessage(data.detail ?? "Error saving experience", "error");
        return;
      }

      showMessage(isEdit ? "Experience updated!" : "Experience added successfully!");
      setExperienceForm({ company_name: "", role: "", start_date: "", end_date: "", description: "" });
      clearEditMode("experience");
      await loadExperiences();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      showMessage(`Error: ${msg}`, "error");
    }
  };

  const addSkill = async () => {
    const identifier = getIdentifier();
    if (!identifier) {
      showMessage("Please save basic info first (need email)", "error");
      return;
    }

    const payload: SkillPayload = {
      application: skillForm.application,
      programming_language: skillForm.programming_language,
      technologies: skillForm.technologies,
    };

    try {
      const isEdit = editState.type === "skill" && editState.id !== null;
      const endpoint = isEdit ? `${API}/skills/${editState.id}` : `${API}/skills?${identifier}`;
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json()) as { detail?: string };
        showMessage(data.detail ?? "Error saving skills", "error");
        return;
      }

      showMessage(isEdit ? "Skills updated!" : "Skills added successfully!");
      setSkillForm({ application: "", programming_language: "", technologies: "" });
      clearEditMode("skill");
      await loadSkills();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      showMessage(`Error: ${msg}`, "error");
    }
  };

  const addHobby = async () => {
    const identifier = getIdentifier();
    if (!identifier) {
      showMessage("Please save basic info first (need email)", "error");
      return;
    }

    const payload: HobbyPayload = { hobby_name: hobbyName };

    try {
      const isEdit = editState.type === "hobby" && editState.id !== null;
      const endpoint = isEdit ? `${API}/hobbies/${editState.id}` : `${API}/hobbies?${identifier}`;
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json()) as { detail?: string };
        showMessage(data.detail ?? "Error saving hobby", "error");
        return;
      }

      showMessage(isEdit ? "Hobby updated!" : "Hobby added successfully!");
      setHobbyName("");
      clearEditMode("hobby");
      await loadHobbies();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      showMessage(`Error: ${msg}`, "error");
    }
  };

  const loadProjects = async () => {
    const identifier = getIdentifier();
    if (!identifier) return;

    const response = await fetch(`${API}/projects?${identifier}`);
    if (response.ok) {
      const items = (await response.json()) as Project[];
      setProjects(items);
    }
  };

  const loadExperiences = async () => {
    const identifier = getIdentifier();
    if (!identifier) return;

    const response = await fetch(`${API}/experiences?${identifier}`);
    if (response.ok) {
      const items = (await response.json()) as Experience[];
      setExperiences(items);
    }
  };

  const loadSkills = async () => {
    const identifier = getIdentifier();
    if (!identifier) return;

    const response = await fetch(`${API}/skills?${identifier}`);
    if (response.ok) {
      const items = (await response.json()) as Skill[];
      setSkills(items);
    }
  };

  const loadHobbies = async () => {
    const identifier = getIdentifier();
    if (!identifier) return;

    const response = await fetch(`${API}/hobbies?${identifier}`);
    if (response.ok) {
      const items = (await response.json()) as Hobby[];
      setHobbies(items);
    }
  };

  const deleteByType = async (type: ItemType, id: number) => {
    const confirmed = window.confirm(`Delete this ${type}?`);
    if (!confirmed) return;

    const endpointMap: Record<ItemType, string> = {
      project: `${API}/projects/${id}`,
      experience: `${API}/experiences/${id}`,
      skill: `${API}/skills/${id}`,
      hobby: `${API}/hobbies/${id}`,
    };

    try {
      const response = await fetch(endpointMap[type], {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        showMessage(`Error deleting ${type}`, "error");
        return;
      }

      showMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted`);
      if (type === "project") await loadProjects();
      if (type === "experience") await loadExperiences();
      if (type === "skill") await loadSkills();
      if (type === "hobby") await loadHobbies();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      showMessage(`Error: ${msg}`, "error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_email");
    router.replace("/login");
  };

  return (
    <main className="admin-page">
      <div className="admin-head">
        <Link href="/" className="nav-back">
          ← Back to Portfolio
        </Link>
        <button className="btn btn-secondary" onClick={logout}>
          Logout
        </button>
      </div>

      <h1 style={{ marginBottom: "2rem" }}>Profile Admin</h1>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="admin-tabs">
        {(["basic", "project", "experience", "skill", "hobby"] as TabKey[]).map((tab) => (
          <button
            key={tab}
            className={`admin-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "basic" ? "Basic Info" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "basic" && (
        <section className="admin-form active">
          <div className="form-card">
            <h3>Basic Information</h3>
            <div style={{ marginBottom: "1.5rem" }}>
              <button className="btn btn-secondary" onClick={loadBasicInfoForEdit}>
                Load Existing Info from Email/Mobile
              </button>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={basicForm.name}
                  onChange={(event) => setBasicForm((prev) => ({ ...prev, name: event.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={basicForm.email}
                  readOnly
                  onChange={(event) => setBasicForm((prev) => ({ ...prev, email: event.target.value }))}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  value={basicForm.mobile}
                  onChange={(event) => setBasicForm((prev) => ({ ...prev, mobile: event.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Current College</label>
                <input
                  type="text"
                  value={basicForm.college}
                  onChange={(event) => setBasicForm((prev) => ({ ...prev, college: event.target.value }))}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Profile Image URL</label>
              <input
                type="url"
                value={basicForm.image}
                onChange={(event) => setBasicForm((prev) => ({ ...prev, image: event.target.value }))}
              />
            </div>

            <div className="form-group">
              <label>Headline</label>
              <input
                type="text"
                value={basicForm.headline}
                onChange={(event) => setBasicForm((prev) => ({ ...prev, headline: event.target.value }))}
              />
            </div>

            <div className="form-group">
              <label>About Me Text</label>
              <textarea
                value={basicForm.about}
                onChange={(event) => setBasicForm((prev) => ({ ...prev, about: event.target.value }))}
              />
            </div>

            <div className="form-group">
              <label>Short Description</label>
              <textarea
                value={basicForm.description}
                onChange={(event) => setBasicForm((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>LinkedIn URL</label>
                <input
                  type="url"
                  value={basicForm.linkedin}
                  onChange={(event) => setBasicForm((prev) => ({ ...prev, linkedin: event.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>GitHub URL</label>
                <input
                  type="url"
                  value={basicForm.github}
                  onChange={(event) => setBasicForm((prev) => ({ ...prev, github: event.target.value }))}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={basicForm.bio}
                onChange={(event) => setBasicForm((prev) => ({ ...prev, bio: event.target.value }))}
              />
            </div>

            <div className="form-actions">
              <button className="btn btn-primary" onClick={saveBasicInfo}>
                Save Basic Info
              </button>
            </div>
          </div>
        </section>
      )}

      {activeTab === "project" && (
        <section className="admin-form active">
          <div className="form-card">
            <h3>{editState.type === "project" ? "Edit Project" : "Add Project"}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  value={projectForm.name}
                  onChange={(event) => setProjectForm((prev) => ({ ...prev, name: event.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>One Liner</label>
                <input
                  type="text"
                  value={projectForm.one_liner}
                  onChange={(event) => setProjectForm((prev) => ({ ...prev, one_liner: event.target.value }))}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Tech Stack</label>
                <input
                  type="text"
                  value={projectForm.tech_stack}
                  onChange={(event) => setProjectForm((prev) => ({ ...prev, tech_stack: event.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Source URL</label>
                <input
                  type="url"
                  value={projectForm.source}
                  onChange={(event) => setProjectForm((prev) => ({ ...prev, source: event.target.value }))}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Live Link</label>
                <input
                  type="url"
                  value={projectForm.link}
                  onChange={(event) => setProjectForm((prev) => ({ ...prev, link: event.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Image URLs</label>
                <input
                  type="text"
                  value={projectForm.images}
                  onChange={(event) => setProjectForm((prev) => ({ ...prev, images: event.target.value }))}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={projectForm.description}
                onChange={(event) => setProjectForm((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" onClick={addProject}>
                {editState.type === "project" ? "Update Project" : "Add Project"}
              </button>
            </div>
          </div>

          <div className="form-card">
            <h3>Manage Projects</h3>
            {projects.length === 0 ? (
              <p className="item-subtitle">No items found.</p>
            ) : (
              projects.map((item) => (
                <div className="item-row" key={item.id}>
                  <div className="item-info">
                    <div className="item-title">{item.name}</div>
                    <div className="item-subtitle">{item.one_liner}</div>
                  </div>
                  <div>
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setProjectForm({
                          name: item.name,
                          one_liner: item.one_liner,
                          tech_stack: item.tech_stack,
                          description: item.description,
                          source: item.source ?? "",
                          link: item.link ?? "",
                          images: item.images ?? "",
                        });
                        setEditState({ type: "project", id: item.id });
                      }}
                    >
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => void deleteByType("project", item.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {activeTab === "experience" && (
        <section className="admin-form active">
          <div className="form-card">
            <h3>{editState.type === "experience" ? "Edit Experience" : "Add Experience"}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  value={experienceForm.company_name}
                  onChange={(event) =>
                    setExperienceForm((prev) => ({ ...prev, company_name: event.target.value }))
                  }
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  value={experienceForm.role}
                  onChange={(event) => setExperienceForm((prev) => ({ ...prev, role: event.target.value }))}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="text"
                  value={experienceForm.start_date}
                  onChange={(event) => setExperienceForm((prev) => ({ ...prev, start_date: event.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="text"
                  value={experienceForm.end_date}
                  onChange={(event) => setExperienceForm((prev) => ({ ...prev, end_date: event.target.value }))}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={experienceForm.description}
                onChange={(event) => setExperienceForm((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" onClick={addExperience}>
                {editState.type === "experience" ? "Update Experience" : "Add Experience"}
              </button>
            </div>
          </div>

          <div className="form-card">
            <h3>Manage Experience</h3>
            {experiences.length === 0 ? (
              <p className="item-subtitle">No items found.</p>
            ) : (
              experiences.map((item) => (
                <div className="item-row" key={item.id}>
                  <div className="item-info">
                    <div className="item-title">{item.company_name}</div>
                    <div className="item-subtitle">{item.role}</div>
                  </div>
                  <div>
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setExperienceForm({
                          company_name: item.company_name,
                          role: item.role,
                          start_date: item.start_date ?? "",
                          end_date: item.end_date ?? "",
                          description: item.description,
                        });
                        setEditState({ type: "experience", id: item.id });
                      }}
                    >
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => void deleteByType("experience", item.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {activeTab === "skill" && (
        <section className="admin-form active">
          <div className="form-card">
            <h3>{editState.type === "skill" ? "Edit Skills" : "Add Skills"}</h3>
            <div className="form-group">
              <label>Application</label>
              <input
                type="text"
                value={skillForm.application}
                onChange={(event) => setSkillForm((prev) => ({ ...prev, application: event.target.value }))}
              />
            </div>
            <div className="form-group">
              <label>Programming Languages</label>
              <input
                type="text"
                value={skillForm.programming_language}
                onChange={(event) =>
                  setSkillForm((prev) => ({ ...prev, programming_language: event.target.value }))
                }
              />
            </div>
            <div className="form-group">
              <label>Technologies</label>
              <input
                type="text"
                value={skillForm.technologies}
                onChange={(event) => setSkillForm((prev) => ({ ...prev, technologies: event.target.value }))}
              />
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" onClick={addSkill}>
                {editState.type === "skill" ? "Update Skills" : "Add Skills"}
              </button>
            </div>
          </div>

          <div className="form-card">
            <h3>Manage Skills</h3>
            {skills.length === 0 ? (
              <p className="item-subtitle">No items found.</p>
            ) : (
              skills.map((item) => (
                <div className="item-row" key={item.id}>
                  <div className="item-info">
                    <div className="item-title">{item.application || "Skill Set"}</div>
                    <div className="item-subtitle">
                      {[item.programming_language, item.technologies].filter(Boolean).join(" | ")}
                    </div>
                  </div>
                  <div>
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setSkillForm({
                          application: item.application || "",
                          programming_language: item.programming_language || "",
                          technologies: item.technologies || "",
                        });
                        setEditState({ type: "skill", id: item.id });
                      }}
                    >
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => void deleteByType("skill", item.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {activeTab === "hobby" && (
        <section className="admin-form active">
          <div className="form-card">
            <h3>{editState.type === "hobby" ? "Edit Hobby" : "Add Hobby"}</h3>
            <div className="form-group">
              <label>Hobby Name</label>
              <input type="text" value={hobbyName} onChange={(event) => setHobbyName(event.target.value)} />
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" onClick={addHobby}>
                {editState.type === "hobby" ? "Update Hobby" : "Add Hobby"}
              </button>
            </div>
          </div>

          <div className="form-card">
            <h3>Manage Hobbies</h3>
            {hobbies.length === 0 ? (
              <p className="item-subtitle">No items found.</p>
            ) : (
              hobbies.map((item) => (
                <div className="item-row" key={item.id}>
                  <div className="item-info">
                    <div className="item-title">{item.hobby_name || item.name || "Untitled"}</div>
                    <div className="item-subtitle">{item.description || ""}</div>
                  </div>
                  <div>
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setHobbyName(item.hobby_name || item.name || "");
                        setEditState({ type: "hobby", id: item.id });
                      }}
                    >
                      Edit
                    </button>
                    <button className="btn-delete" onClick={() => void deleteByType("hobby", item.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </main>
  );
}
