// Demo data: expanded list of fake projects
const projects = [
  { name: "AI Safety Mentor", members: ["anubhab@gmail.com","rhea@uni.edu"], github: "https://github.com/teamA/a-safety-mentor", date: "2025-10-15", tags: ["AI","Safety"], desc: "An assistant to help students learn safe AI practices." },
  { name: "Digital Twin of School", members: ["goat@gmail.com","ritu@gmail.com"], github: "https://github.com/teamB/digital-twin", date: "2025-10-14", tags: ["IoT","Simulation"], desc: "A lightweight digital twin to simulate classroom energy use." },
  { name: "Wearable Safety Band", members: ["pbm@gmail.com","aman@gmail.com"], github: "https://github.com/teamC/safety-band", date: "2025-10-13", tags: ["Hardware","Safety"], desc: "Wearable for lone-worker safety with SOS and fall detection." },
  { name: "Smart Evacuation App", members: ["mina@gmail.com","arjun@gmail.com"], github: "https://github.com/teamD/smart-evacuation", date: "2025-10-12", tags: ["Mobile","Crisis"], desc: "Finding optimal evacuation route during emergencies." },
  { name: "HealthMetrics Dashboard", members: ["anubhab@gmail.com"], github: "https://github.com/anubhab7105/HealthMetricsDashboard", date: "2025-09-10", tags: ["Web","Dashboard"], desc: "A responsive health metrics dashboard." },
  { name: "CampusRoom Booker", members: ["sourav@college.edu","tanya@mail.com"], github: "https://github.com/teamE/room-booker", date: "2025-09-01", tags: ["Web","Booking"], desc: "Room booking system for faculty and students." },
  { name: "Secure Cloud Share", members: ["alia@mail.com","dev@mail.com"], github: "https://github.com/teamF/secure-cloud", date: "2025-08-21", tags: ["Cloud","Security"], desc: "Encrypted sharing for cloud files using hybrid crypto." },
  { name: "EcoRoute", members: ["kartik@mail.com"], github: "https://github.com/teamG/ecoroute", date: "2025-07-30", tags: ["Maps","Sustainability"], desc: "Eco-friendly route planner for bikes and e-vehicles." },
  { name: "ExamPrep Bot", members: ["zara@mail.com","jay@mail.com"], github: "https://github.com/teamH/examprep", date: "2025-06-18", tags: ["AI","Education"], desc: "Quiz bot that generates personalized practice tests." },
  { name: "LibrarySight", members: ["dip@mail.com","souma@mail.com"], github: "https://github.com/teamI/librarysight", date: "2025-05-12", tags: ["CV","Accessibility"], desc: "Computer-vision based book locator for libraries." },
  { name: "BudgetBuddy", members: ["neel@mail.com"], github: "https://github.com/teamJ/budgetbuddy", date: "2025-04-03", tags: ["Finance","Web"], desc: "A simple budgeting web app for students." },
  { name: "QuizChain", members: ["pallavi@mail.com"], github: "https://github.com/teamK/quizchain", date: "2025-03-22", tags: ["Blockchain","Education"], desc: "Immutable record of graded quizzes using blockchain." }
];

// Utilities
const el = sel => document.querySelector(sel);
const mk = (tag, cls) => Object.assign(document.createElement(tag), { className: cls || '' });

// Render tags for filters
function renderTagFilters() {
  const container = el('#tag-filters');
  const tags = [...new Set(projects.flatMap(p => p.tags))].sort();
  container.innerHTML = '';
  tags.forEach(t => {
    const btn = mk('button','tag');
    btn.textContent = t;
    btn.addEventListener('click', () => { btn.classList.toggle('active'); applyFilters(); });
    container.appendChild(btn);
  });
}

// Render projects
function renderProjects(list) {
  const container = el('#projects');
  container.innerHTML = '';
  if (list.length === 0) {
    el('#no-results').hidden = false;
    return;
  }
  el('#no-results').hidden = true;

  list.forEach((p, i) => {
    const card = mk('article','card');

    const row = mk('div','row');
    const avatar = mk('div','avatar');
    // initials
    avatar.textContent = p.name.split(' ').slice(0,2).map(s=>s[0]).join('').toUpperCase();

    const meta = mk('div');
    meta.innerHTML = `
      <div class="title">${p.name}</div>
      <div class="meta">${p.members.join(', ')} • ${p.date}</div>
    `;

    row.appendChild(avatar);
    row.appendChild(meta);

    const desc = mk('div'); desc.className = 'meta'; desc.textContent = p.desc;

    const badges = mk('div','badges');
    p.tags.forEach(t => { const b = mk('div','badge'); b.textContent = t; badges.appendChild(b); });

    const actions = mk('div','actions');
    const viewBtn = mk('button','btn btn-outline'); viewBtn.textContent = 'View';
    viewBtn.addEventListener('click', () => openModal(p));
    const ghBtn = mk('a','btn btn-primary'); ghBtn.textContent = 'Open GitHub'; ghBtn.href = p.github; ghBtn.target = '_blank'; ghBtn.rel = 'noopener noreferrer';

    actions.appendChild(viewBtn); actions.appendChild(ghBtn);

    card.appendChild(row);
    card.appendChild(desc);
    card.appendChild(badges);
    card.appendChild(actions);

    container.appendChild(card);
  });
}

// Modal
const modal = el('#modal');
const modalContent = el('#modal-content');
el('#modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
function openModal(p){
  modalContent.innerHTML = `
    <h2>${p.name}</h2>
    <p class="meta">Members: ${p.members.join(', ')} &middot; Submitted: ${p.date}</p>
    <p>${p.desc}</p>
    <p><strong>Tags:</strong> ${p.tags.join(', ')}</p>
    <p><a href="${p.github}" target="_blank" rel="noopener">View on GitHub</a></p>
  `;
  modal.setAttribute('aria-hidden','false');
}
function closeModal(){ modal.setAttribute('aria-hidden','true'); }

// Search + filters
function applyFilters(){
  const query = el('#search').value.trim().toLowerCase();
  const activeTags = [...document.querySelectorAll('#tag-filters .tag.active')].map(n=>n.textContent);
  let result = projects.filter(p => {
    const matchQuery = [p.name, p.members.join(' '), p.tags.join(' '), p.desc, p.github].join(' ').toLowerCase().includes(query);
    const matchTags = activeTags.length === 0 || activeTags.every(t => p.tags.includes(t));
    return matchQuery && matchTags;
  });

  // sort
  const sort = el('#sort').value;
  if (sort === 'newest') result.sort((a,b)=>new Date(b.date)-new Date(a.date));
  if (sort === 'oldest') result.sort((a,b)=>new Date(a.date)-new Date(b.date));
  if (sort === 'name-asc') result.sort((a,b)=>a.name.localeCompare(b.name));

  renderProjects(result);
}

// events
el('#search').addEventListener('input', applyFilters);
el('#sort').addEventListener('change', applyFilters);

// init
renderTagFilters();
applyFilters();
