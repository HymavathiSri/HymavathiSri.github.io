// =====================================================
// HYMAVATHI PORTFOLIO — MAIN SCRIPT
// Network animation + Chat AI + Interactions
// =====================================================

// ── NETWORK CANVAS ANIMATION ──────────────────────
(function () {
  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, dots = [], animId;
  const NUM = 80;
  const MAX_DIST = 140;
  const DOT_R = 2.5;
  const COL_DOT = 'rgba(150,150,160,0.7)';
  const COL_LINE = 'rgba(150,150,160,';

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initDots() {
    dots = [];
    for (let i = 0; i < NUM; i++) {
      dots.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Move dots
    dots.forEach(d => {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0 || d.x > W) d.vx *= -1;
      if (d.y < 0 || d.y > H) d.vy *= -1;
    });

    // Draw lines
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.35;
          ctx.beginPath();
          ctx.strokeStyle = COL_LINE + alpha + ')';
          ctx.lineWidth = 1;
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw dots
    dots.forEach(d => {
      ctx.beginPath();
      ctx.fillStyle = COL_DOT;
      ctx.arc(d.x, d.y, DOT_R, 0, Math.PI * 2);
      ctx.fill();
    });

    animId = requestAnimationFrame(draw);
  }

  resize();
  initDots();
  draw();

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    resize();
    initDots();
    draw();
  });

  // Subtle mouse interaction
  window.addEventListener('mousemove', (e) => {
    dots.forEach(d => {
      const dx = d.x - e.clientX;
      const dy = d.y - e.clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        d.vx += dx * 0.0005;
        d.vy += dy * 0.0005;
        // Clamp speed
        const speed = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
        if (speed > 1.5) { d.vx = (d.vx / speed) * 1.5; d.vy = (d.vy / speed) * 1.5; }
      }
    });
  }, { passive: true });
})();

// ── NAV SCROLL EFFECT ─────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── HAMBURGER MENU ────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobMenu = document.getElementById('mobMenu');
if (hamburger) {
  hamburger.addEventListener('click', () => mobMenu.classList.toggle('open'));
}
document.querySelectorAll('.mob-menu a').forEach(a => {
  a.addEventListener('click', () => mobMenu.classList.remove('open'));
});

// ── SMOOTH SCROLL FOR ANCHORS ─────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 60, behavior: 'smooth' });
    }
  });
});

// ── ACTIVE NAV LINK ───────────────────────────────
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
  });
  document.querySelectorAll('.nav-brand').forEach(a => {
    a.classList.toggle('active', cur === 'home' || cur === '');
  });
}, { passive: true });

// ── FADE IN ON SCROLL ─────────────────────────────
const obs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('in'), (e.target.dataset.delay || 0));
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

document.querySelectorAll('.fade').forEach((el, i) => {
  el.dataset.delay = (i % 5) * 80;
  obs.observe(el);
});

// ── SKILL BAR ANIMATION ───────────────────────────
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const fill = e.target;
      const target = fill.style.width;
      fill.style.width = '0';
      requestAnimationFrame(() => {
        setTimeout(() => { fill.style.width = target; }, 200);
      });
      skillObs.unobserve(fill);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-bar-fill').forEach(el => skillObs.observe(el));

// ── PROJECT FILTER ────────────────────────────────
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

// ── CONTACT FORM ──────────────────────────────────
function sendMsg(e) {
  e.preventDefault();
  const note = document.getElementById('fnote');
  note.textContent = '✓ Thanks! I\'ll get back to you soon.';
  e.target.reset();
  setTimeout(() => { note.textContent = ''; }, 4000);
}

// ── CHAT AI ───────────────────────────────────────
const PORTFOLIO_CONTEXT = `You are an AI assistant for Hymavathi Gampasani's portfolio website. Answer questions about her background, skills, projects, and experience. Be friendly, concise, and enthusiastic about her work. Always answer in 2-4 sentences max.

About Hymavathi:
- Full name: Hymavathi Gampasani
- B.Tech in Artificial Intelligence & Data Science from St. Mary's Women's Engineering College, Guntur (2021–2025), CGPA 74%
- Location: Hyderabad, India. Open to remote roles globally.
- Email: gampasanihymavathi@gmail.com
- LinkedIn: linkedin.com/in/hymavathi-g
- GitHub: github.com/HymavathiSri
- Targeting: AI, ML, Data Science, Cloud, and Software Engineering roles

Experience:
1. Software Development Intern at Cognifyz Technologies (Nov 2025 – Apr 2026): Real-time Python projects, agile workflows, cross-functional collaboration.
2. AWS Cloud Computing Intern (May 2025 – Oct 2025): EC2, S3, RDS; deployed scalable cloud applications; cloud architecture and cost optimization.

Projects:
1. Automated Road Damage Detection Using UAV Images - YOLOv4, YOLOv5, YOLOv7 on RDD2022 dataset; cross-domain detection across China and Spain; deep CNN benchmark study.
2. Loan Insurance System - Django, SQLite3, JavaScript, Bootstrap; full-stack web app with user auth and admin dashboard.
3. Library Management System - PHP, MySQL, Bootstrap, XAMPP; book inventory, member records, issue/return, fine calculation.
4. Scalable App Deployment on AWS - EC2, S3, RDS; applied during AWS internship; real-world cloud deployments.

Skills: Python, Java, C, JavaScript, SQL, Deep Learning, Computer Vision, TensorFlow, Keras, OpenCV, YOLOv4/5/7, CNN, Django, PHP, HTML/CSS, Bootstrap, MySQL, SQLite, AWS EC2/S3/RDS, Git, GitHub, SDLC, Agile, Software Testing, Data Analysis, Excel.

Certifications & Achievements: Silver Medal in Java internship, Elite+ Badge in Java (78%), 2nd place Science Exhibition (district level), certificates in Java, Data Science, C & Data Structures, Hackathon participant, AWS Cloud Computing certificate.

She is actively seeking full-time or remote positions in AI, ML, Data Science, and Software Engineering.`;

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

  const sendBtn = document.getElementById('chatSend');
  chatInput.value = '';
  chatInput.disabled = true;
  sendBtn.disabled = true;

  const sugg = document.getElementById('chatSuggestions');
  if (sugg) sugg.style.display = 'none';

  appendMsg('user', input);
  conversationHistory.push({ role: 'user', content: input });

  const typingEl = appendMsg('bot', '', true);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-ipc': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 300,
        system: PORTFOLIO_CONTEXT,
        messages: conversationHistory
      })
    });

    if (!response.ok) {
      throw new Error('API error: ' + response.status);
    }

    const data = await response.json();
    const reply = (data.content && data.content[0] && data.content[0].text)
      ? data.content[0].text
      : 'I had trouble generating a response. Please try again!';

    typingEl.remove();
    appendMsg('bot', reply);
    conversationHistory.push({ role: 'assistant', content: reply });

  } catch (err) {
    console.error('Chat error:', err);
    typingEl.remove();

    // Fallback: smart local answers
    const reply = getLocalAnswer(input);
    appendMsg('bot', reply);
    conversationHistory.push({ role: 'assistant', content: reply });
  } finally {
    chatInput.disabled = false;
    sendBtn.disabled = false;
    chatInput.focus();
  }
}

// Smart local fallback answers when API is unavailable
function getLocalAnswer(question) {
  const q = question.toLowerCase();

  if (q.includes('deep learning') || q.includes('yolo') || q.includes('computer vision') || q.includes('uav') || q.includes('road')) {
    return "Hymavathi's flagship project is UAV-based Road Damage Detection using YOLOv4, YOLOv5, and YOLOv7 on the RDD2022 dataset — covering cross-domain detection across China and Spain. She has hands-on expertise with TensorFlow, Keras, OpenCV, and CNN architectures for real-world computer vision tasks.";
  }
  if (q.includes('aws') || q.includes('cloud')) {
    return "Hymavathi completed an AWS Cloud Computing Internship (May–Oct 2025) where she deployed scalable applications using EC2, S3, and RDS. She applied cloud architecture principles, fault tolerance, and cost optimization for real-world deployments.";
  }
  if (q.includes('python') || q.includes('programming') || q.includes('language')) {
    return "Python is Hymavathi's primary language — she uses it for deep learning, data analysis, and full-stack development. She's also proficient in Java (Elite+ badge), JavaScript, C, and SQL.";
  }
  if (q.includes('project') || q.includes('built') || q.includes('work')) {
    return "Hymavathi has built 4+ projects: UAV Road Damage Detection (YOLOv7/deep learning), Loan Insurance System (Django full-stack), Library Management System (PHP/MySQL), and Scalable AWS Deployments. Her strongest work is in computer vision and AI.";
  }
  if (q.includes('remote') || q.includes('location') || q.includes('available') || q.includes('hire') || q.includes('job')) {
    return "Hymavathi is based in Hyderabad, India and is fully open to remote roles globally! She's actively seeking full-time positions in AI, ML, Data Science, Cloud, and Software Engineering. Contact her at gampasanihymavathi@gmail.com.";
  }
  if (q.includes('stand out') || q.includes('unique') || q.includes('special') || q.includes('why')) {
    return "Hymavathi combines rare depth in computer vision research (YOLOv7 cross-domain detection) with practical cloud (AWS) and full-stack (Django, PHP) skills. She's completed 2 internships, earned multiple certifications, and built production-ready systems — all as a fresh graduate.";
  }
  if (q.includes('education') || q.includes('degree') || q.includes('btech') || q.includes('college')) {
    return "Hymavathi holds a B.Tech in Artificial Intelligence & Data Science (2021–2025) from St. Mary's Women's Engineering College, Guntur, with a CGPA of 74%. Her final-year project on UAV-based road damage detection using deep CNNs is her standout academic achievement.";
  }
  if (q.includes('intern') || q.includes('experience') || q.includes('work')) {
    return "She has 2 internships: Software Development at Cognifyz Technologies (Nov 2025–Apr 2026) building Python production features in agile teams, and AWS Cloud Computing (May–Oct 2025) deploying scalable cloud-native applications.";
  }
  if (q.includes('contact') || q.includes('email') || q.includes('reach')) {
    return "You can reach Hymavathi at gampasanihymavathi@gmail.com, connect on LinkedIn at linkedin.com/in/hymavathi-g, or explore her code at github.com/HymavathiSri. She responds quickly and is excited about new opportunities!";
  }

  return "Hymavathi is a B.Tech AI & Data Science graduate specializing in deep learning, computer vision, and AWS cloud. She's built YOLOv7-based UAV road detection systems and full-stack web applications, with 2 internships under her belt. She's open to AI, ML, Data, and Software Engineering roles. Feel free to email her at gampasanihymavathi@gmail.com!";
}

function handleKey(e) {
  if (e.key === 'Enter') sendChat();
}

function askSuggestion(text) {
  chatInput.value = text;
  sendChat();
}
