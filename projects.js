const DEFAULT_PROJECTS = [
  { id:1, title:"בית פרטי בשרון", category:"residential", tag:"מגורים", location:"הרצליה", year:"2023", area:"320 מ״ר", color:"#c8b89a",
    image:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
    description:"בית פרטי חד-קומתי המשלב חומרים טבעיים עם קווים נקיים. הפרויקט מתמקד בחיבור בין הפנים לחוץ דרך חלונות רצף ומרפסות מוצלות.",
    details:["תכנון אדריכלי מלא","פיקוח עליון","עיצוב פנים","גינון ונוף"]},
  { id:2, title:"מרכז קהילתי", category:"public", tag:"ציבורי", location:"תל אביב", year:"2022", area:"1,200 מ״ר", color:"#8fa3b1",
    image:"https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=80",
    description:"מרכז קהילתי רב-תכליתי בלב שכונה עירונית. הבניין מאורגן סביב חצר פנימית פתוחה המשמשת כמרחב ציבורי פעיל.",
    details:["תכנון אדריכלי","תכנון קונסטרוקציה","ניהול פרויקט","אישורי בנייה"]},
  { id:3, title:"שיפוץ דירה בתל אביב", category:"interior", tag:"פנים", location:"תל אביב", year:"2023", area:"95 מ״ר", color:"#b5a99a",
    image:"https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&q=80",
    description:"שיפוץ מלא של דירת 4 חדרים בבניין ישן. שמרנו על אלמנטים מקוריים כמו תקרות גבוהות ורצפת פרקט.",
    details:["עיצוב פנים","פיקוח ביצוע","בחירת חומרים","תאורה"]},
  { id:4, title:"מתחם מגורים עירוני", category:"urban", tag:"עירוני", location:"חיפה", year:"2021", area:"4,500 מ״ר", color:"#7a8c7e",
    image:"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80",
    description:"מתחם של 24 יחידות דיור בשיפוע הכרמל. הפרויקט מנצל את הטופוגרפיה ליצירת נופים שונים לכל יחידה.",
    details:["תכנון אב","תכנון אדריכלי","תכנון נוף","ייעוץ קיימות"]},
  { id:5, title:"וילה בים המלח", category:"residential", tag:"מגורים", location:"ים המלח", year:"2022", area:"480 מ״ר", color:"#c4a882",
    image:"https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=80",
    description:"וילה נופש המתכתבת עם נוף המדבר והים. חומרים מקומיים כמו אבן ירושלמית ועץ מקומי משתלבים עם בריכה אינסופית.",
    details:["תכנון אדריכלי","עיצוב פנים","תכנון בריכה","פיקוח עליון"]},
  { id:6, title:"בית ספר יסודי", category:"public", tag:"ציבורי", location:"ראשון לציון", year:"2020", area:"2,800 מ״ר", color:"#d4b896",
    image:"https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900&q=80",
    description:"בית ספר יסודי לגיל הרך המתוכנן סביב חוויית הלמידה. כיתות גמישות, חצרות ירוקות ומסדרונות רחבים.",
    details:["תכנון אדריכלי","תכנון פדגוגי","נגישות","ניהול פרויקט"]}
];

// תמיד טוען טרי מ-localStorage
const STORAGE_KEY = 'portfolioProjects';

function getProjects() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch(e) {}
  return DEFAULT_PROJECTS;
}

let currentModalIndex = 0;
let filteredProjects = [];

// CURSOR
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
if (cursor && follower) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    setTimeout(() => {
      follower.style.left = e.clientX + 'px';
      follower.style.top = e.clientY + 'px';
    }, 40);
  });
}

// SCROLL PROGRESS BAR
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = pct + '%';
});

// PARALLAX HERO
window.addEventListener('scroll', () => {
  const hero = document.getElementById('hero');
  const heroContent = hero?.querySelector('.hero-content');
  if (heroContent && window.scrollY < window.innerHeight) {
    heroContent.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    heroContent.style.opacity = 1 - window.scrollY / (window.innerHeight * 0.8);
  }
});

// LOADER
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    const heroImg = document.getElementById('heroImg');
    if (heroImg) heroImg.classList.add('loaded');
  }, 1800);
});

// HEADER SCROLL
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (header) header.classList.toggle('scrolled', window.scrollY > 50);
});

// COUNTERS — מתחיל כשנכנס לתצוגה
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  if (!target) return;
  let current = 0;
  const step = target / 40;
  el.textContent = '0';
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { el.textContent = target; clearInterval(timer); }
    else el.textContent = Math.floor(current);
  }, 40);
}
function animateCounters() {
  document.querySelectorAll('.count-num').forEach(animateCounter);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCounter(e.target); counterObserver.unobserve(e.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.count-num').forEach(el => counterObserver.observe(el));

// RENDER PROJECTS — קורא טרי בכל פעם
function renderProjects(filter) {
  filter = filter || 'all';
  const projects = getProjects();
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  filteredProjects = filter === 'all' ? [...projects] : projects.filter(p => p.category === filter);
  grid.innerHTML = '';

  filteredProjects.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'project-card reveal';
    card.dataset.id = p.id;

    const isIdb = p.image && p.image.startsWith('idb:');
    const imgHtml = p.image
      ? `<img class="card-image" ${isIdb ? `data-idb="${p.image.slice(4)}"` : `src="${p.image}"`} alt="${p.title}" loading="lazy" decoding="async" />`
      : `<div class="card-image-placeholder" style="background:${p.color}22;border-bottom:3px solid ${p.color};aspect-ratio:4/3"></div>`;

    card.innerHTML = `
      ${imgHtml}
      <div class="card-overlay">
        <div class="card-overlay-arrow">→</div>
        <div class="card-overlay-content">
          <div class="card-overlay-tag">${p.tag}</div>
          <div class="card-overlay-title">${p.title}</div>
          <div class="card-overlay-meta">${p.location} · ${p.year}</div>
        </div>
      </div>
    `;

    card.addEventListener('click', () => openModal(i));
    grid.appendChild(card);
    setTimeout(() => card.classList.add('visible'), i * 80);
  });

  // load idb images
  grid.querySelectorAll('img[data-idb]').forEach(img => {
    ImgDB.load(img.dataset.idb).then(src => { if (src) { img.src = src; img.classList.add('loaded-img'); } });
  });

  observeReveal();
}

// MODAL
function openModal(index) {
  currentModalIndex = index;
  const p = filteredProjects[index];
  if (!p) return;

  const wrap = document.getElementById('modalImageWrap');
  if (!wrap) return;
  wrap.style.background = '';

  const isIdb = p.image && p.image.startsWith('idb:');
  if (p.image && !isIdb) {
    wrap.innerHTML = `<img id="modalImg" src="${p.image}" alt="${p.title}" /><div class="modal-img-overlay"></div>`;
  } else if (isIdb) {
    wrap.innerHTML = `<img id="modalImg" src="" alt="${p.title}" /><div class="modal-img-overlay"></div>`;
    ImgDB.load(p.image.slice(4)).then(src => { const el = document.getElementById('modalImg'); if (el && src) el.src = src; });
  } else {
    wrap.innerHTML = `<div style="width:100%;height:100%;background:${p.color}33;display:flex;align-items:center;justify-content:center;color:${p.color};font-size:1.2rem">${p.title}</div>`;
  }

  document.getElementById('modalTag').textContent = p.tag;
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalMeta').textContent = `${p.location} · ${p.year} · ${p.area}`;
  document.getElementById('modalDesc').textContent = p.description;
  document.getElementById('modalDetails').innerHTML = (p.details||[]).map(d => `<li>${d}</li>`).join('');

  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('modalClose')?.addEventListener('click', closeModal);
document.getElementById('modalOverlay')?.addEventListener('click', closeModal);
document.getElementById('modalShare')?.addEventListener('click', () => {
  const p = filteredProjects[currentModalIndex];
  if (!p) return;
  const text = `${p.title} — ${p.location} · ${p.year}`;
  if (navigator.share) {
    navigator.share({ title: p.title, text });
  } else {
    navigator.clipboard.writeText(window.location.href + '#projects').then(() => showToast('הקישור הועתק ✓'));
  }
});

document.getElementById('modalPrev')?.addEventListener('click', () => {
  openModal((currentModalIndex - 1 + filteredProjects.length) % filteredProjects.length);
});
document.getElementById('modalNext')?.addEventListener('click', () => {
  openModal((currentModalIndex + 1) % filteredProjects.length);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowLeft') document.getElementById('modalNext')?.click();
  if (e.key === 'ArrowRight') document.getElementById('modalPrev')?.click();
});

// FILTER
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProjects(btn.dataset.filter);
  });
});

// SCROLL REVEAL
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

function observeReveal() {
  document.querySelectorAll('.reveal:not(.visible),.reveal-left:not(.visible),.reveal-right:not(.visible)').forEach(el => observer.observe(el));
}

// observe static elements too
document.querySelectorAll('.reveal-left,.reveal-right').forEach(el => observer.observe(el));

// CONTACT FORM
function handleSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('cName')?.value.trim();
  const email = document.getElementById('cEmail')?.value.trim();
  const subject = document.getElementById('cSubject')?.value.trim();
  const msg = document.getElementById('cMsg')?.value.trim();
  if (!name || !email || !msg) { showToast('אנא מלא את כל השדות הנדרשים'); return; }
  const btn = e.target.querySelector('button[type="submit"]');
  if (btn) { btn.textContent = 'שולח...'; btn.disabled = true; }
  emailjs.send('service_0k1tmil', 'template_a9gdb1m', {
    from_name: name,
    from_email: email,
    subject: subject || 'פנייה מהאתר',
    message: msg
  }).then(() => {
    e.target.innerHTML = '<div class="form-success">✓ ההודעה נשלחה בהצלחה! נחזור אליך בהקדם.</div>';
    showToast('✓ ההודעה נשלחה!');
  }).catch(() => {
    if (btn) { btn.textContent = 'שלח הודעה →'; btn.disabled = false; }
    showToast('שגיאה בשליחה, נסי שוב', 'error');
  });
}

// MOBILE MENU
const menuToggle = document.getElementById('menuToggle');
const navUl = document.querySelector('nav ul');
let menuOpen = false;
if (menuToggle && navUl) {
  // overlay
  const menuOverlay = document.createElement('div');
  menuOverlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:199;display:none;backdrop-filter:blur(4px)';
  document.body.appendChild(menuOverlay);

  function openMenu() {
    menuOpen = true;
    navUl.style.cssText = 'display:flex;flex-direction:column;position:fixed;top:0;right:0;bottom:0;width:75%;max-width:300px;background:#0a0a0a;padding:5rem 2rem;gap:2rem;z-index:200;border-left:1px solid rgba(200,169,110,0.15);transition:transform 0.3s ease';
    menuOverlay.style.display = 'block';
    menuToggle.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    menuOpen = false;
    navUl.style.cssText = '';
    menuOverlay.style.display = 'none';
    menuToggle.classList.remove('open');
    document.body.style.overflow = '';
  }
  menuToggle.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
  menuOverlay.addEventListener('click', closeMenu);
  navUl.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

// BACK TO TOP
const backTop = document.createElement('button');
backTop.innerHTML = '↑';
backTop.style.cssText = 'position:fixed;bottom:2rem;right:2rem;width:42px;height:42px;background:var(--black,#080808);border:1px solid rgba(200,169,110,0.4);color:#c8a96e;font-size:1rem;cursor:pointer;z-index:300;opacity:0;transition:all 0.3s;font-family:inherit';
document.body.appendChild(backTop);
window.addEventListener('scroll', () => {
  backTop.style.opacity = window.scrollY > 600 ? '1' : '0';
  backTop.style.pointerEvents = window.scrollY > 600 ? 'auto' : 'none';
});
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
backTop.addEventListener('mouseenter', () => { backTop.style.background = '#c8a96e'; backTop.style.color = '#000'; });
backTop.addEventListener('mouseleave', () => { backTop.style.background = '#080808'; backTop.style.color = '#c8a96e'; });

// SMOOTH ANCHOR SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// TOAST NOTIFICATION
function showToast(msg, duration = 3000) {
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = 'position:fixed;bottom:5rem;left:50%;transform:translateX(-50%) translateY(10px);background:#111;border:1px solid rgba(200,169,110,0.3);color:#c8a96e;padding:0.6rem 1.4rem;font-size:0.78rem;letter-spacing:1px;z-index:9999;opacity:0;transition:all 0.3s;pointer-events:none;white-space:nowrap';
  document.body.appendChild(t);
  requestAnimationFrame(() => { t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(0)'; });
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, duration);
}

// KEYBOARD SHORTCUTS
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowLeft' && document.getElementById('modal')?.classList.contains('open')) document.getElementById('modalNext')?.click();
  if (e.key === 'ArrowRight' && document.getElementById('modal')?.classList.contains('open')) document.getElementById('modalPrev')?.click();
  if (e.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
    e.preventDefault();
    document.querySelector('#contact input')?.focus();
  }
});

// ACTIVE NAV HIGHLIGHT ON SCROLL
const sections = ['projects','about','contact'];
const navLinks = document.querySelectorAll('nav a[href^="#"]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) current = id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('nav-active', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });

// CHATBOT
const DEFAULT_ANSWERS = [
  { keys: ['שירות','שירותים','מה אתם','מה את','מציעים','עושים'],
    answer: 'אנחנו מציעים ארבעה שירותים עיקריים:\n\n• <strong>תכנון אדריכלי</strong> — מהרעיון ועד הביצוע\n• <strong>עיצוב פנים</strong> — חומרים, תאורה ואווירה\n• <strong>פיקוח עליון</strong> — ליווי צמוד בשלב הבנייה\n• <strong>תכנון עירוני</strong> — מתחמים ושכונות\n\nרוצה לשמוע עוד על שירות מסוים?',
    followUp: ['תכנון אדריכלי','עיצוב פנים','פיקוח עליון'] },
  { keys: ['תכנון אדריכלי','תכנון','אדריכל'],
    answer: 'תכנון אדריכלי מלא כולל:\n\n• שלב תכנון מקדמי — רעיון ותוכנית ראשונית\n• תוכניות עבודה מפורטות\n• חזיתות, חתכים ופרטים טכניים\n• ליווי מול הרשויות לקבלת היתר\n\nכמה עולה? זה תלוי בגודל הפרויקט — <strong>צרו קשר לייעוץ ראשוני חינם</strong>.',
    followUp: ['כמה עולה?','איך מתחילים?','צור קשר'] },
  { keys: ['עיצוב פנים','פנים','אינטריור'],
    answer: 'עיצוב פנים בסטודיו שלנו כולל:\n\n• תכנון מרחב ותנועה\n• בחירת חומרים, גוונים ומרקמים\n• תכנון תאורה\n• פיקוח על ביצוע הגמרים\n\nעובדים על דירות, בתים פרטיים ומרחבים מסחריים.',
    followUp: ['כמה עולה?','ראיתי פרויקטים','צור קשר'] },
  { keys: ['מחיר','עולה','עלות','תקציב','כסף'],
    answer: 'המחיר תלוי בכמה גורמים:\n\n• <strong>גודל הפרויקט</strong> — מ״ר ומורכבות\n• <strong>סוג השירות</strong> — תכנון בלבד / פיקוח / עיצוב פנים\n• <strong>שלב הפרויקט</strong> — חדש / שיפוץ\n\nמציעים <strong>ייעוץ ראשוני ללא עלות</strong>. השאירו פרטים ונחזור אליכם תוך 24 שעות.',
    followUp: ['איך יוצרים קשר?','מה כולל הייעוץ?'] },
  { keys: ['קשר','ליצור קשר','טלפון','אימייל','מייל','פנייה'],
    answer: 'ניתן ליצור קשר בכמה דרכים:\n\n• <strong>טופס יצירת קשר</strong> — בתחתית הדף\n• <strong>אימייל ישיר</strong> — studio@avital-arch.co.il\n\nמגיבים תוך <strong>24 שעות בימי עסקים</strong>. נשמח לשמוע על הפרויקט שלכם!',
    followUp: ['מה השירותים?','כמה עולה?'] },
  { keys: ['פרויקט','פרויקטים','עבודות','גלריה'],
    answer: 'הגלריה שלנו כוללת פרויקטים מגוונים:\n\n• בתים פרטיים ווילות\n• מרכזים קהילתיים ומבנים ציבוריים\n• שיפוצי דירות\n• מתחמי מגורים עירוניים\n\nתוכלו לסנן לפי קטגוריה בגלריה למעלה בדף.',
    followUp: ['מגורים','ציבורי','עיצוב פנים'] },
  { keys: ['ניסיון','וותק','שנים','היסטוריה'],
    answer: 'הסטודיו פעיל <strong>מעל 8 שנים</strong> בתחום האדריכלות והעיצוב.\n\nבמהלך השנים ביצענו <strong>24+ פרויקטים</strong> וזכינו ב-<strong>12 פרסים</strong> בתחום.\n\nמתמחים בפרויקטים שמשלבים אסתטיקה, פונקציונליות ורגישות לסביבה.',
    followUp: ['ראיתי פרויקטים','מה השירותים?'] },
  { keys: ['כמה זמן','לוח זמנים','משך','מתי'],
    answer: 'משך הפרויקט תלוי בסוגו:\n\n• <strong>עיצוב פנים</strong> — 2–4 חודשים\n• <strong>בית פרטי</strong> — 6–12 חודשים (כולל היתר)\n• <strong>מבנה ציבורי</strong> — 12–24 חודשים\n\nנותנים לוח זמנים מפורט בתחילת כל פרויקט.',
    followUp: ['כמה עולה?','איך מתחילים?'] },
  { keys: ['מתחילים','תהליך','שלבים','איך עובד'],
    answer: 'תהליך העבודה שלנו בשלבים:\n\n<strong>1.</strong> פגישת היכרות ואפיון הצרכים\n<strong>2.</strong> הצעת מחיר ולוח זמנים\n<strong>3.</strong> תכנון ראשוני ואישורכם\n<strong>4.</strong> תכנון מפורט ואישורי בנייה\n<strong>5.</strong> פיקוח על הביצוע\n\nמתחילים בפגישה קצרה — <strong>ללא עלות</strong>!',
    followUp: ['צור קשר','כמה עולה?'] }
];

function getChatAnswer(msg) {
  let answers = [...DEFAULT_ANSWERS];
  try {
    const stored = localStorage.getItem('sChatAnswers');
    if (stored) {
      const extra = JSON.parse(stored);
      Object.entries(extra).forEach(([k, v]) => answers.unshift({ keys: [k], answer: v, followUp: [] }));
    }
  } catch(e) {}
  const lower = msg.toLowerCase();
  for (const item of answers) {
    if (item.keys.some(k => lower.includes(k.toLowerCase()))) return item;
  }
  return { answer: 'תודה על פנייתך! 😊\n\nלא הצלחתי להבין בדיוק מה חיפשת. אפשר לנסות לשאול אחרת, או <strong>ליצור קשר ישירות</strong> ונשמח לעזור.', followUp: ['מה השירותים?','כמה עולה?','איך יוצרים קשר?'] };
}

function getTime() {
  return new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
}

function addChatMsg(text, type, followUp) {
  const msgs = document.getElementById('chatbotMessages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = 'chat-msg ' + type;
  if (type === 'bot') {
    div.innerHTML = text.replace(/\n/g, '<br>') + `<span class="chat-msg-time">${getTime()}</span>`;
  } else {
    div.innerHTML = text + `<span class="chat-msg-time">${getTime()}</span>`;
  }
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;

  if (followUp && followUp.length) {
    const sugg = document.getElementById('chatbotSuggestions');
    if (sugg) {
      sugg.style.display = 'flex';
      sugg.innerHTML = '<span class="chatbot-suggestions-label">שאלות המשך</span>' +
        followUp.map(q => `<button onclick="sendSuggestion('${q}')">${q}</button>`).join('');
    }
  }
}

function sendChatMsg(text) {
  if (!text.trim()) return;
  addChatMsg(text, 'user');
  const sugg = document.getElementById('chatbotSuggestions');
  if (sugg) sugg.style.display = 'none';
  const msgs = document.getElementById('chatbotMessages');
  const typing = document.createElement('div');
  typing.className = 'chat-typing';
  typing.innerHTML = '<span></span><span></span><span></span>';
  msgs.appendChild(typing);
  msgs.scrollTop = msgs.scrollHeight;
  const delay = 600 + Math.random() * 500;
  setTimeout(() => {
    typing.remove();
    const result = getChatAnswer(text);
    addChatMsg(result.answer, 'bot', result.followUp);
  }, delay);
}

function sendSuggestion(text) { sendChatMsg(text); }

document.getElementById('chatbotBtn')?.addEventListener('click', () => {
  document.getElementById('chatbotWindow').classList.toggle('open');
});
document.getElementById('chatbotClose')?.addEventListener('click', () => {
  document.getElementById('chatbotWindow').classList.remove('open');
});
document.getElementById('chatbotSend')?.addEventListener('click', () => {
  const input = document.getElementById('chatbotInput');
  sendChatMsg(input.value);
  input.value = '';
});
document.getElementById('chatbotInput')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const input = document.getElementById('chatbotInput');
    sendChatMsg(input.value);
    input.value = '';
  }
});

// TESTIMONIALS AUTO-SCROLL
(function() {
  const cards = document.querySelectorAll('.testimonial-card');
  const dotsWrap = document.getElementById('testimonialsDots');
  if (!cards.length || !dotsWrap) return;
  let current = 0;
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 't-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  function goTo(i) {
    current = i;
    const dots = dotsWrap.querySelectorAll('.t-dot');
    dots.forEach((d, j) => d.classList.toggle('active', j === i));
    // on mobile show only active
    if (window.innerWidth < 768) {
      cards.forEach((c, j) => c.style.display = j === i ? 'block' : 'none');
    }
  }
  setInterval(() => goTo((current + 1) % cards.length), 4000);
})();

// LAZY IMAGE FADE IN
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  if (img.complete) { img.classList.add('loaded-img'); }
  else img.addEventListener('load', () => img.classList.add('loaded-img'));
});

// LIVE EDITOR
if (new URLSearchParams(window.location.search).get('edit') === '1') {
  window.addEventListener('load', () => {
    // toolbar
    const bar = document.createElement('div');
    bar.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:99999;background:#0d0d0d;border-bottom:1px solid rgba(200,169,110,0.3);display:flex;align-items:center;gap:8px;padding:8px 16px;font-family:Inter,sans-serif';
    bar.innerHTML = `
      <span style="font-size:10px;color:#c8a96e;letter-spacing:2px;flex:1" id="liveStatus">✎ לחץ על כל טקסט או תמונה לעריכה</span>
      <button id="liveSave" style="padding:5px 16px;background:#c8a96e;border:none;color:#000;font-size:10px;cursor:pointer;letter-spacing:1px;font-family:inherit">✓ שמור</button>
      <button id="liveUndo" style="padding:5px 12px;background:none;border:1px solid rgba(200,169,110,0.3);color:#c8a96e;font-size:10px;cursor:pointer;font-family:inherit">↶ בטל</button>
      <button id="liveReset" style="padding:5px 12px;background:none;border:1px solid rgba(217,79,79,0.3);color:#d94f4f;font-size:10px;cursor:pointer;font-family:inherit">↺ אפס הכל</button>
      <button id="liveExit" style="padding:5px 12px;background:none;border:1px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.5);font-size:10px;cursor:pointer;font-family:inherit">✕ צא ממצב עריכה</button>
      <a href="admin.html" style="padding:5px 12px;border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.4);font-size:10px;text-decoration:none;font-family:inherit">← חזור לניהול</a>
    `;
    document.body.prepend(bar);
    document.body.style.paddingTop = '38px';

    const history = [];
    const status = document.getElementById('liveStatus');

    // inject editable styles
    const style = document.createElement('style');
    style.textContent = `
      [contenteditable]:hover { outline: 1px dashed rgba(200,169,110,0.5) !important; }
      [contenteditable]:focus { outline: 2px solid #c8a96e !important; background: rgba(200,169,110,0.05) !important; }
    `;
    document.head.appendChild(style);

    // make text elements editable
    const sel = 'h1,h2,h3,h4,p,span,a,li,small,em,strong,label';
    document.querySelectorAll(sel).forEach(el => {
      if (el.closest('#liveStatus,#liveSave,#liveUndo,#liveReset,.chatbot-window,.modal,.loader')) return;
      if (el.querySelector('img,svg,canvas,iframe')) return;
      el.setAttribute('contenteditable', 'true');
      el.setAttribute('spellcheck', 'false');
      el.addEventListener('focus', () => {
        history.push({ el, html: el.innerHTML });
        status.textContent = '✎ עורך: ' + el.textContent.trim().slice(0, 40);
      });
      el.addEventListener('input', () => {
        status.textContent = '● שינויים לא שמורים';
        document.getElementById('liveSave').style.background = '#e8c98e';
      });
    });

    // image panel styles
    const imgPanelStyle = document.createElement('style');
    imgPanelStyle.textContent = `
      .live-img-wrap { position:relative; display:inline-block; }
      .live-img-wrap:hover .live-img-btn { opacity:1; }
      .live-img-btn { position:absolute; top:8px; left:8px; z-index:99998; opacity:0; transition:opacity 0.2s;
        background:#0d0d0d; border:1px solid rgba(200,169,110,0.5); color:#c8a96e;
        font-size:10px; letter-spacing:1px; padding:4px 10px; cursor:pointer;
        font-family:Inter,sans-serif; white-space:nowrap; }
      .live-img-btn:hover { background:#c8a96e; color:#000; }
      .live-img-panel { position:fixed; z-index:999999; background:#111; border:1px solid rgba(200,169,110,0.3);
        padding:16px; min-width:300px; box-shadow:0 8px 32px rgba(0,0,0,0.8); font-family:Inter,sans-serif; }
      .live-img-panel-title { font-size:10px; color:#c8a96e; letter-spacing:2px; margin-bottom:12px; }
      .live-img-panel input[type=text] { width:100%; background:rgba(255,255,255,0.05); border:1px solid rgba(200,169,110,0.2);
        color:#fff; padding:7px 10px; font-size:11px; font-family:inherit; outline:none; margin-bottom:8px; direction:ltr; }
      .live-img-panel input[type=text]:focus { border-color:#c8a96e; }
      .live-img-panel-row { display:flex; gap:6px; margin-bottom:8px; }
      .live-img-panel button { flex:1; padding:6px 10px; font-size:10px; letter-spacing:1px;
        cursor:pointer; font-family:inherit; border:none; transition:all 0.2s; }
      .lip-apply { background:#c8a96e; color:#000; }
      .lip-apply:hover { background:#e8c98e; }
      .lip-upload { background:rgba(255,255,255,0.07); color:#fff; border:1px solid rgba(255,255,255,0.15) !important; }
      .lip-upload:hover { background:rgba(255,255,255,0.12); }
      .lip-remove { background:rgba(217,79,79,0.15); color:#d94f4f; border:1px solid rgba(217,79,79,0.3) !important; }
      .lip-remove:hover { background:rgba(217,79,79,0.3); }
      .lip-cancel { background:none; color:rgba(255,255,255,0.3); border:1px solid rgba(255,255,255,0.1) !important; }
      .lip-cancel:hover { color:#fff; }
      .live-img-preview { width:100%; height:80px; object-fit:cover; margin-bottom:8px; border:1px solid rgba(200,169,110,0.1); display:none; }
    `;
    document.head.appendChild(imgPanelStyle);

    let activePanel = null;
    function closeImgPanel() { if (activePanel) { activePanel.remove(); activePanel = null; } }

    function openImgPanel(img, triggerBtn) {
      closeImgPanel();
      const panel = document.createElement('div');
      panel.className = 'live-img-panel';

      const rect = triggerBtn.getBoundingClientRect();
      panel.style.top = (rect.bottom + 6) + 'px';
      panel.style.left = Math.max(8, rect.left - 100) + 'px';

      const preview = document.createElement('img');
      preview.className = 'live-img-preview';
      preview.src = img.src;
      if (img.src && !img.src.startsWith('data:')) preview.style.display = 'block';

      const urlInput = document.createElement('input');
      urlInput.type = 'text';
      urlInput.placeholder = 'הדבק URL של תמונה...';
      urlInput.value = img.src.startsWith('data:') ? '' : img.src;
      urlInput.addEventListener('input', () => {
        if (urlInput.value.trim()) { preview.src = urlInput.value.trim(); preview.style.display = 'block'; }
      });

      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';
      fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
          urlInput.value = '';
          preview.src = ev.target.result;
          preview.style.display = 'block';
          preview.dataset.dataUrl = ev.target.result;
        };
        reader.readAsDataURL(file);
      });

      const row1 = document.createElement('div');
      row1.className = 'live-img-panel-row';

      const btnApply = document.createElement('button');
      btnApply.className = 'lip-apply';
      btnApply.textContent = '✓ החל';
      btnApply.addEventListener('click', () => {
        const newSrc = preview.dataset.dataUrl || urlInput.value.trim();
        if (!newSrc) return;
        history.push({ el: img, attr: 'src', val: img.src });
        img.src = newSrc;
        delete preview.dataset.dataUrl;
        markDirty();
        closeImgPanel();
      });

      const btnUpload = document.createElement('button');
      btnUpload.className = 'lip-upload';
      btnUpload.textContent = '↑ העלה קובץ';
      btnUpload.addEventListener('click', () => fileInput.click());

      const btnRemove = document.createElement('button');
      btnRemove.className = 'lip-remove';
      btnRemove.textContent = '✕ הסר תמונה';
      btnRemove.addEventListener('click', () => {
        if (!confirm('להסיר את התמונה?')) return;
        history.push({ el: img, attr: 'src', val: img.src, hidden: img.style.display });
        history.push({ el: img, attr: 'display', val: img.style.display });
        img.style.display = 'none';
        localStorage.setItem('live_hidden_' + img.id, '1');
        markDirty();
        closeImgPanel();
      });

      const btnCancel = document.createElement('button');
      btnCancel.className = 'lip-cancel';
      btnCancel.textContent = 'ביטול';
      btnCancel.addEventListener('click', closeImgPanel);

      row1.append(btnApply, btnUpload);
      const row2 = document.createElement('div');
      row2.className = 'live-img-panel-row';
      row2.append(btnRemove, btnCancel);

      panel.innerHTML = '<div class="live-img-panel-title">✎ עריכת תמונה</div>';
      panel.append(preview, urlInput, fileInput, row1, row2);
      document.body.appendChild(panel);
      activePanel = panel;
      urlInput.focus();
    }

    function markDirty() {
      status.textContent = '● שינויים לא שמורים';
      document.getElementById('liveSave').style.background = '#e8c98e';
    }

    document.addEventListener('click', e => {
      if (activePanel && !activePanel.contains(e.target) && !e.target.classList.contains('live-img-btn')) closeImgPanel();
    });

    // wrap each image with hover button
    document.querySelectorAll('img').forEach(img => {
      if (img.closest('.loader,.cursor,.live-img-panel')) return;
      if (!img.id) img.id = 'liveimg_' + Math.random().toString(36).slice(2, 7);

      const wrap = document.createElement('div');
      wrap.className = 'live-img-wrap';
      wrap.style.cssText = 'display:block;position:relative;';
      img.parentNode.insertBefore(wrap, img);
      wrap.appendChild(img);

      const btn = document.createElement('button');
      btn.className = 'live-img-btn';
      btn.textContent = '✎ ערוך תמונה';
      btn.addEventListener('click', e => { e.stopPropagation(); openImgPanel(img, btn); });
      wrap.appendChild(btn);
    });

    // exit edit mode
    document.getElementById('liveExit').addEventListener('click', () => {
      window.location.href = 'admin.html';
    });

    // save
    document.getElementById('liveSave').addEventListener('click', () => {
      document.querySelectorAll('[id][contenteditable]').forEach(el => {
        localStorage.setItem('live_' + el.id, el.innerHTML);
      });
      document.querySelectorAll('img[id]').forEach(img => {
        if (img.style.display === 'none') {
          localStorage.setItem('live_hidden_' + img.id, '1');
        } else {
          localStorage.removeItem('live_hidden_' + img.id);
          localStorage.setItem('live_img_' + img.id, img.src);
        }
      });
      status.textContent = '✓ נשמר בהצלחה';
      document.getElementById('liveSave').style.background = '#c8a96e';
    });

    // undo
    document.getElementById('liveUndo').addEventListener('click', () => {
      const last = history.pop();
      if (!last) return;
      if (last.attr === 'display') { last.el.style.display = last.val; }
      else if (last.attr === 'src') { last.el.src = last.val; last.el.style.display = ''; }
      else if (last.attr) { last.el[last.attr] = last.val; }
      else { last.el.innerHTML = last.html; }
      status.textContent = '↶ בוטל';
    });

    // reset
    document.getElementById('liveReset').addEventListener('click', () => {
      if (!confirm('לאפס את כל עריכות החי?')) return;
      Object.keys(localStorage).filter(k => k.startsWith('live_')).forEach(k => localStorage.removeItem(k));
      location.reload();
    });
  });
}

// LIVE EDITS
function applyLiveEdits() {
  Object.keys(localStorage).filter(k => k.startsWith('live_hidden_')).forEach(k => {
    const id = k.replace('live_hidden_', '');
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  Object.keys(localStorage).filter(k => k.startsWith('live_img_')).forEach(k => {
    const id = k.replace('live_img_', '');
    const el = document.getElementById(id);
    if (el) el.src = localStorage.getItem(k);
  });
  Object.keys(localStorage).filter(k => k.startsWith('live_') && !k.startsWith('live_img_') && !k.startsWith('live_hidden_')).forEach(k => {
    const id = k.replace('live_', '');
    const el = document.getElementById(id);
    if (el) el.innerHTML = localStorage.getItem(k);
  });
}

// INIT
function applySettings() {
  const set = (id, val) => { const el = document.getElementById(id); if (el && val) el.textContent = val; };
  const setVal = (id, attr, val) => { const el = document.getElementById(id); if (el && val) el[attr] = val; };

  // Hero
  set('heroLine1', localStorage.getItem('sHeroLine1'));
  set('heroLine2', localStorage.getItem('sHeroLine2'));
  set('heroLine3', localStorage.getItem('sHeroLine3'));
  set('heroSub', localStorage.getItem('sHeroSub'));
  set('heroLabel', localStorage.getItem('sHeroLabel'));
  set('heroBtnPrimary', localStorage.getItem('sHeroBtn1'));
  set('heroBtnSecondary', localStorage.getItem('sHeroBtn2'));
  const heroImg = localStorage.getItem('sHeroImg');
  if (heroImg) setVal('heroImg', 'src', heroImg);

  // Counters
  const c1v = localStorage.getItem('sCounter1Val');
  const c2v = localStorage.getItem('sCounter2Val');
  const c3v = localStorage.getItem('sCounter3Val');
  if (c1v) { const el = document.getElementById('counter1'); if (el) { el.dataset.target = c1v; el.textContent = c1v; } }
  if (c2v) { const el = document.getElementById('counter2'); if (el) { el.dataset.target = c2v; el.textContent = c2v; } }
  if (c3v) { const el = document.getElementById('counter3'); if (el) { el.dataset.target = c3v; el.textContent = c3v; } }
  set('counter1Label', localStorage.getItem('sCounter1Label'));
  set('counter2Label', localStorage.getItem('sCounter2Label'));
  set('counter3Label', localStorage.getItem('sCounter3Label'));

  // Logo & footer
  set('logoName', localStorage.getItem('sLogoName'));
  set('logoSub', localStorage.getItem('sLogoSub'));
  set('footerLogo', localStorage.getItem('sFooterLogo'));
  set('footerCopy', localStorage.getItem('sFooterCopy'));
  const siteTitle = localStorage.getItem('sSiteTitle');
  if (siteTitle) document.title = siteTitle;

  // About
  const aboutTitle = localStorage.getItem('sAboutTitle');
  const aboutTitleEm = localStorage.getItem('sAboutTitleEm');
  if (aboutTitle || aboutTitleEm) {
    const el = document.getElementById('aboutTitle');
    if (el) el.innerHTML = (aboutTitle || 'גישה אדריכלית') + '<br/><em>' + (aboutTitleEm || 'שמאמינה בפרטים') + '</em>';
  }
  set('aboutPara1', localStorage.getItem('sAboutP1'));
  set('aboutPara2', localStorage.getItem('sAboutP2'));
  set('aboutBadgeNum', localStorage.getItem('sAboutBadgeNum'));
  set('aboutBadgeText', localStorage.getItem('sAboutBadgeText'));
  const aboutImg = localStorage.getItem('sAboutImg');
  if (aboutImg) setVal('aboutImg', 'src', aboutImg);
  const skills = localStorage.getItem('sSkills');
  if (skills) {
    const el = document.getElementById('skillsList');
    if (el) el.innerHTML = skills.split(',').map(s => `<span>${s.trim()}</span>`).join('');
  }

  // Contact
  const contactTitle = localStorage.getItem('sContactTitle');
  const contactTitleEm = localStorage.getItem('sContactTitleEm');
  if (contactTitle || contactTitleEm) {
    const el = document.getElementById('contactTitle');
    if (el) el.innerHTML = (contactTitle || 'מוכנים') + '<br/><em>' + (contactTitleEm || 'להתחיל?') + '</em>';
  }
  set('contactSubtitle', localStorage.getItem('sContactSub'));
  set('contactAddress', localStorage.getItem('sAddress'));
  const email = localStorage.getItem('sContactEmail') || localStorage.getItem('sEmail') || localStorage.getItem('portfolioEmail');
  if (email) {
    const el = document.getElementById('contactEmail');
    if (el) { el.textContent = email; el.href = 'mailto:' + email; }
  }
  const phone = localStorage.getItem('sPhone');
  if (phone) {
    set('contactPhone', phone);
  } else {
    const phoneItem = document.getElementById('contactPhone')?.closest('.info-item');
    if (phoneItem) phoneItem.style.display = 'none';
  }

  // Social links
  const social = localStorage.getItem('sSocial');
  if (social) {
    const el = document.getElementById('socialLinks');
    if (el) {
      const icons = { instagram: '📷', facebook: '📘', linkedin: '💼', twitter: '🐦', youtube: '▶' };
      el.innerHTML = social.split(',').map(url => {
        url = url.trim();
        const key = Object.keys(icons).find(k => url.includes(k)) || 'link';
        const icon = icons[key] || '🔗';
        return `<a href="${url}" target="_blank" class="social-link">${icon}</a>`;
      }).join('');
    }
  }

  // Services
  set('srv1Title', localStorage.getItem('sSrv1Title'));
  set('srv2Title', localStorage.getItem('sSrv2Title'));
  set('srv3Title', localStorage.getItem('sSrv3Title'));
  set('srv4Title', localStorage.getItem('sSrv4Title'));
  set('srv1Desc', localStorage.getItem('sSrv1Desc'));
  set('srv2Desc', localStorage.getItem('sSrv2Desc'));
  set('srv3Desc', localStorage.getItem('sSrv3Desc'));
  set('srv4Desc', localStorage.getItem('sSrv4Desc'));

  // Testimonials
  const testData = [
    { text: localStorage.getItem('sTest1Text'), name: localStorage.getItem('sTest1Name'), role: localStorage.getItem('sTest1Role') },
    { text: localStorage.getItem('sTest2Text'), name: localStorage.getItem('sTest2Name'), role: localStorage.getItem('sTest2Role') },
    { text: localStorage.getItem('sTest3Text'), name: localStorage.getItem('sTest3Name'), role: localStorage.getItem('sTest3Role') },
  ];
  const testCards = document.querySelectorAll('.testimonial-card');
  testCards.forEach((card, i) => {
    const d = testData[i];
    if (!d) return;
    const p = card.querySelector('p');
    const strong = card.querySelector('strong');
    const span = card.querySelector('.testimonial-author span');
    const avatar = card.querySelector('.testimonial-avatar');
    if (d.text && p) p.textContent = d.text;
    if (d.name && strong) { strong.textContent = d.name; if (avatar) avatar.textContent = d.name.charAt(0); }
    if (d.role && span) span.textContent = d.role;
  });

  // Marquee
  const marquee = localStorage.getItem('sMarquee');
  if (marquee) {
    const track = document.getElementById('marqueeTrack');
    if (track) {
      const items = marquee.split(',').map(s => s.trim()).filter(Boolean);
      const doubled = [...items, ...items];
      track.innerHTML = doubled.map(t => `<span>${t}</span><span>·</span>`).join('');
    }
  }

  // Image strip
  const stripImgs = document.querySelectorAll('.strip-item img');
  ['sStrip1','sStrip2','sStrip3','sStrip4','sStrip5'].forEach((key, i) => {
    const val = localStorage.getItem(key);
    if (val && stripImgs[i]) stripImgs[i].src = val;
  });

  // Chatbot
  const chatName = localStorage.getItem('sChatName');
  const chatGreeting = localStorage.getItem('sChatGreeting');
  if (chatName) set('chatbotName', chatName);
  if (chatGreeting) set('chatbotGreeting', chatGreeting);
}

const savedEmail = localStorage.getItem('portfolioEmail');
if (savedEmail) {
  const el = document.getElementById('contactEmail');
  if (el) el.textContent = savedEmail;
}
applySettings();
applyLiveEdits();
renderProjects();
