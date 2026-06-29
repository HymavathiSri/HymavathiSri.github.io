// NAV scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 60
    ? 'rgba(7,7,16,0.97)'
    : 'rgba(7,7,16,0.85)';
}, { passive: true });

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const mobMenu = document.getElementById('mobMenu');
if (hamburger) {
  hamburger.addEventListener('click', () => mobMenu.classList.toggle('open'));
}
document.querySelectorAll('.mob-menu a').forEach(a => {
  a.addEventListener('click', () => mobMenu.classList.remove('open'));
});

// Skill bar animation on scroll
const skillFills = document.querySelectorAll('.skill-fill');
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = el.style.width;
      el.style.width = '0';
      requestAnimationFrame(() => {
        setTimeout(() => { el.style.width = target; }, 100);
      });
      skillObs.unobserve(el);
    }
  });
}, { threshold: 0.3 });
skillFills.forEach(el => skillObs.observe(el));

// Fade-in on scroll
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.fade').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 70 + 'ms';
  obs.observe(el);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
    }
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
  });
}, { passive: true });

// Project filter
const filterBtns = document.querySelectorAll('.filter-btn');
const projCards = document.querySelectorAll('.proj-card[data-cat]');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projCards.forEach(card => {
      const cats = card.dataset.cat || '';
      if (filter === 'all' || cats.split(' ').includes(filter)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// Contact form
function sendMsg(e) {
  e.preventDefault();
  const note = document.getElementById('fnote');
  note.textContent = '✓ Thanks! I\'ll get back to you soon.';
  e.target.reset();
  setTimeout(() => { note.textContent = ''; }, 4000);
}

// ─── CHAT AI ────────────────────────────────────────────────────────────────
const PORTFOLIO_CONTEXT = `
You are an AI assistant for Hymavathi Gampasani's portfolio website. Answer questions about her background, skills, projects, and experience. Be friendly, concise, and enthusiastic about her work. Always answer in 2-4 sentences max.

About Hymavathi:
- Full name: Hymavathi Gampasani
- B.Tech in Artificial Intelligence & Data Science from St. Mary's Women's Engineering College, Guntur (2021–2025), CGPA 74%
- Location: Hyderabad, India. Open to remote roles globally.
- Email: gampasanihymavathi@gmail.com
- LinkedIn: linkedin.com/in/hymavathi-g
- GitHub: github.com/HymavathiSri
- Targeting: AI, ML, Data Science, Cloud, and Software Engineering roles

Experience:
1. Software Development Intern at Cognifyz Technologies (Nov 2025 – Apr 2026): Worked on real-time Python projects, built and tested features in agile workflows, collaborated cross-functionally.
2. AWS Cloud Computing Intern (May 2025 – Oct 2025): Hands-on with EC2, S3, RDS; deployed scalable cloud applications; learned cloud architecture and cost optimization.

Projects:
1. Automated Road Damage Detection Using UAV Images - YOLOv4, YOLOv5, YOLOv7 on RDD2022 dataset; cross-domain detection across China and Spain; deep CNN benchmark study.
2. Loan Insurance System - Django, SQLite3, JavaScript, Bootstrap; full-stack web app with user auth and admin dashboard.
3. Library Management System - PHP, MySQL, Bootstrap, XAMPP; book inventory, member records, issue/return, fine calculation.
4. Scalable App Deployment on AWS - EC2, S3, RDS; applied during AWS internship; real-world cloud deployments.

Skills: Python, Java, C, JavaScript, SQL, Deep Learning, Computer Vision, TensorFlow, Keras, OpenCV, YOLOv4/5/7, CNN, Django, PHP, HTML/CSS, Bootstrap, MySQL, SQLite, AWS EC2/S3/RDS, Cloud Architecture, Git, GitHub, SDLC, Agile, Software Testing, Data Analysis, Excel.

Certifications & Achievements: Silver Medal in Java internship, Elite+ Badge in Java (78%), 2nd place Science Exhibition (district level), certificates in Java, Data Science, C & Data Structures, Hackathon participant, AWS Cloud Computing certificate.

She is actively seeking opportunities and is open to full-time or remote positions in AI, ML, Data Science, and Software Engineering.
`;

const chatBox = document.getElementById('chatBox');
const chatInput = document.getElementById('chatInput');
let conversationHistory = [];

function appendMsg(role, text, isTyping = false) {
  const msg = document.createElement('div');
  msg.className = 'chat-msg ' + (role === 'user' ? 'user' : 'bot');

  const avatar = document.createElement('div');
  avatar.className = 'chat-avatar';
  avatar.textContent = role === 'user' ? 'You' : 'HG';

  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';

  if (isTyping) {
    bubble.innerHTML = '<div class="chat-typing"><span></span><span></span><span></span></div>';
    msg.id = 'typingMsg';
  } else {
    bubble.textContent = text;
  }

  msg.appendChild(avatar);
  msg.appendChild(bubble);
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}

async function sendChat() {
  const input = chatInput.value.trim();
  if (!input) return;

  chatInput.value = '';
  document.getElementById('chatSuggestions').style.display = 'none';
  appendMsg('user', input);

  conversationHistory.push({ role: 'user', content: input });

  const typingEl = appendMsg('bot', '', true);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: PORTFOLIO_CONTEXT,
        messages: conversationHistory
      })
    });

    const data = await response.json();
    const reply = data.content && data.content[0] ? data.content[0].text : 'Sorry, I had trouble responding. Please try again!';

    typingEl.remove();
    appendMsg('bot', reply);
    conversationHistory.push({ role: 'assistant', content: reply });

  } catch (err) {
    typingEl.remove();
    appendMsg('bot', 'Sorry, I ran into an issue. Feel free to reach out to Hymavathi directly at gampasanihymavathi@gmail.com!');
  }
}

function handleKey(e) {
  if (e.key === 'Enter') sendChat();
}

function askSuggestion(text) {
  chatInput.value = text;
  sendChat();
}
