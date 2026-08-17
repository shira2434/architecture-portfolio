const _auth = sessionStorage.getItem('adminAuth');
if (_auth !== 'true') {
  window.location.href = 'admin-login.html';
}

const STORAGE_KEY = 'portfolioProjects';
const CAT_LABELS = { residential:'מגורים', public:'ציבורי', interior:'פנים', urban:'עירוני' };
const COLORS = ['#c8b89a','#8fa3b1','#b5a99a','#7a8c7e','#c4a882','#d4b896'];

const DEFAULT_PROJECTS = [
  { id:1, title:"בית פרטי בשרון", category:"residential", tag:"מגורים", location:"הרצליה", year:"2023", area:"320 מ״ר", color:"#c8b89a",
    image:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
    description:"בית פרטי חד-קומתי המשלב חומרים טבעיים עם קווים נקיים.", details:["תכנון אדריכלי מלא","פיקוח עליון","עיצוב פנים","גינון ונוף"] },
  { id:2, title:"מרכז קהילתי", category:"public", tag:"ציבורי", location:"תל אביב", year:"2022", area:"1,200 מ״ר", color:"#8fa3b1",
    image:"https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=80",
    description:"מרכז קהילתי רב-תכליתי בלב שכונה עירונית.", details:["תכנון אדריכלי","תכנון קונסטרוקציה","ניהול פרויקט"] },
  { id:3, title:"שיפוץ דירה בתל אביב", category:"interior", tag:"פנים", location:"תל אביב", year:"2023", area:"95 מ״ר", color:"#b5a99a",
    image:"https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&q=80",
    description:"שיפוץ מלא של דירת 4 חדרים בבניין ישן.", details:["עיצוב פנים","פיקוח ביצוע","בחירת חומרים"] },
  { id:4, title:"מתחם מגורים עירוני", category:"urban", tag:"עירוני", location:"חיפה", year:"2021", area:"4,500 מ״ר", color:"#7a8c7e",
    image:"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80",
    description:"מתחם של 24 יחידות דיור בשיפוע הכרמל.", details:["תכנון אב","תכנון אדריכלי","תכנון נוף"] },
  { id:5, title:"וילה בים המלח", category:"residential", tag:"מגורים", location:"ים המלח", year:"2022", area:"480 מ״ר", color:"#c4a882",
    image:"https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=80",
    description:"וילה נופש המתכתבת עם נוף המדבר והים.", details:["תכנון אדריכלי","עיצוב פנים","תכנון בריכה"] },
  { id:6, title:"בית ספר יסודי", category:"public", tag:"ציבורי", location:"ראשון לציון", year:"2020", area:"2,800 מ״ר", color:"#d4b896",
    image:"https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900&q=80",
    description:"בית ספר יסודי לגיל הרך המתוכנן סביב חוויית הלמידה.", details:["תכנון אדריכלי","תכנון פדגוגי","נגישות"] }
];

// ── State
let projects = loadProjects();
let deleteTargetId = null;
let confirmCallback = null;
let currentImageBase64 = '';
let activeFilter = 'all';
let searchQuery = '';

// ── Storage — אותו מפתח בדיוק כמו projects.js
function loadProjects() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch(e) {}
  // אם אין — שמור את ברירת המחדל ותחזיר
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
  return [...DEFAULT_PROJECTS];
}

function saveProjects() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    updateStats();
  } catch(e) {
    if (e.name === 'QuotaExceededError') {
      // compress base64 images — replace with empty to free space, keep URLs
      const lightProjects = projects.map(p => ({
        ...p,
        image: p.image && p.image.startsWith('data:') ? '' : (p.image || '')
      }));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lightProjects));
        projects = lightProjects;
        updateStats();
        showToast('⚠ תמונות שהועלו הוסרו — האחסון מלא. השתמשי ב-URL במקום', 'error');
      } catch(e2) {
        showToast('האחסון מלא! פתחי הגדרות ← אפס נתונים', 'error');
      }
    } else {
      showToast('שגיאה בשמירה', 'error');
    }
  }
}

// ── Toast
function showToast(msg, type) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast ' + (type || 'success') + ' show';
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Stats
function updateStats() {
  const sc = document.getElementById('statCount');
  const si = document.getElementById('statImages');
  const nb = document.getElementById('navBadge');
  if (sc) sc.textContent = projects.length;
  if (si) si.textContent = projects.filter(p => p.image).length;
  if (nb) nb.textContent = projects.length;
}

// ── Navigation
function switchView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const view = document.getElementById('view-' + name);
  if (view) view.classList.add('active');
  const navItem = document.querySelector('[data-view="' + name + '"]');
  const title = navItem?.dataset.title || '';
  if (navItem) navItem.classList.add('active');
  const tt = document.getElementById('topbarTitle');
  const bc = document.getElementById('breadcrumb');
  if (tt) tt.textContent = title;
  if (bc) bc.textContent = title;
}

function goAdd() { resetForm(); switchView('add'); }

// ── Render Grid
function getFiltered() {
  return projects.filter(p => {
    const matchCat = activeFilter === 'all' || p.category === activeFilter;
    const matchSearch = !searchQuery || p.title.includes(searchQuery) || (p.location || '').includes(searchQuery);
    return matchCat && matchSearch;
  });
}

function renderAdminGrid() {
  updateStats();
  const grid = document.getElementById('adminGrid');
  if (!grid) return;
  const list = getFiltered();

  if (list.length === 0) {
    grid.innerHTML = `<div class="empty-state">
      <svg width="50" height="50" viewBox="0 0 60 60" fill="none"><rect x="8" y="8" width="44" height="44" stroke="#c8a96e" stroke-width="0.8" opacity="0.3"/></svg>
      <p>${searchQuery ? 'לא נמצאו תוצאות' : 'אין פרויקטים — הוסף את הראשון'}</p>
      ${!searchQuery ? '<button class="btn-new" onclick="goAdd()">פרויקט חדש</button>' : ''}
    </div>`;
    return;
  }

  grid.innerHTML = list.map(p => `
    <div class="admin-card" draggable="true" data-id="${p.id}">
      ${p.image && !p.image.startsWith('idb:')
        ? `<img class="admin-card-img" src="${p.image}" alt="${p.title}" loading="lazy" />`
        : p.image && p.image.startsWith('idb:')
          ? `<img class="admin-card-img" data-idb="${p.image.slice(4)}" alt="${p.title}" />`
          : `<div class="admin-card-placeholder" style="border-color:${p.color};color:${p.color}">${p.title}</div>`}
      <div class="admin-card-body">
        <div class="admin-card-tag">${p.tag}</div>
        <div class="admin-card-title">${p.title}</div>
        <div class="admin-card-meta">${[p.location, p.year, p.area].filter(Boolean).join(' · ')}</div>
        <div class="admin-card-actions">
          <button class="btn-edit" onclick="editProject(${p.id})">&#10002; עריכה</button>
          <button class="btn-del" onclick="confirmDeleteProject(${p.id})">&#10005; מחיקה</button>
        </div>
      </div>
    </div>
  `).join('');

  // load idb images
  grid.querySelectorAll('img[data-idb]').forEach(img => {
    ImgDB.load(img.dataset.idb).then(src => { if (src) img.src = src; });
  });

  initDragDrop();
}

// ── Form
function resetForm() {
  const form = document.getElementById('projectForm');
  if (form) form.reset();
  const g = id => document.getElementById(id);
  if (g('editId')) g('editId').value = '';
  if (g('fImageUrl')) g('fImageUrl').value = '';
  if (g('formTitle')) g('formTitle').textContent = 'פרויקט חדש';
  if (g('submitBtn')) g('submitBtn').textContent = '✓ שמור פרויקט';
  if (g('err-title')) g('err-title').textContent = '';
  currentImageBase64 = '';
  showImagePreview(false);
  resetPreviewBox();
}

function resetPreviewBox() {
  const box = document.getElementById('formPreviewBox');
  if (box) box.innerHTML = `<div class="preview-empty"><svg width="28" height="28" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="32" height="32" stroke="#c8a96e" stroke-width="0.8" opacity="0.4"/></svg><span>תצוגה מקדימה</span></div>`;
}

function showImagePreview(show, src) {
  const wrap = document.getElementById('imagePreviewWrap');
  const zone = document.getElementById('uploadZone');
  if (wrap) wrap.style.display = show ? 'block' : 'none';
  if (zone) zone.style.display = show ? 'none' : 'block';
  if (show && src) {
    const img = document.getElementById('imagePreview');
    if (img) img.src = src;
    const box = document.getElementById('formPreviewBox');
    if (box) box.innerHTML = `<img src="${src}" style="width:100%;height:100%;object-fit:cover" />`;
  }
}

function editProject(id) {
  const p = projects.find(x => x.id === id);
  if (!p) return;
  resetForm();
  const s = (elId, val) => { const el = document.getElementById(elId); if (el) el.value = val || ''; };
  s('editId', p.id); s('fTitle', p.title); s('fCategory', p.category || 'residential');
  s('fLocation', p.location); s('fYear', p.year); s('fArea', p.area);
  s('fDesc', p.description); s('fDetails', (p.details || []).join(', '));
  const ft = document.getElementById('formTitle');
  const sb = document.getElementById('submitBtn');
  if (ft) ft.textContent = 'עריכת פרויקט';
  if (sb) sb.textContent = '✓ עדכן פרויקט';
  if (p.image) {
    if (p.image.startsWith('idb:')) {
      ImgDB.load(p.image.slice(4)).then(src => {
        if (src) { currentImageBase64 = src; showImagePreview(true, src); }
      });
    } else {
      currentImageBase64 = '';
      showImagePreview(true, p.image);
      const urlEl = document.getElementById('fImageUrl');
      if (urlEl) urlEl.value = p.image;
    }
  }
  switchView('add');
}

function cancelEdit() { resetForm(); switchView('projects'); }

// ── Image Upload
function handleImageFile(file) {
  if (!file.type.startsWith('image/')) { showToast('קובץ לא תקין', 'error'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const max = 1200;
      let w = img.width, h = img.height;
      if (w > max) { h = Math.round(h * max / w); w = max; }
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      currentImageBase64 = canvas.toDataURL('image/jpeg', 0.82);
      showImagePreview(true, currentImageBase64);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ── Save Project
function saveProject(e) {
  e.preventDefault();
  const titleEl = document.getElementById('fTitle');
  const title = titleEl ? titleEl.value.trim() : '';
  const errEl = document.getElementById('err-title');
  if (!title) { if (errEl) errEl.textContent = 'שדה חובה'; if (titleEl) titleEl.focus(); return; }
  if (errEl) errEl.textContent = '';

  const editId = document.getElementById('editId')?.value;
  const category = document.getElementById('fCategory')?.value || 'residential';
  const get = id => document.getElementById(id)?.value.trim() || '';
  const imageUrl = get('fImageUrl');

  // if uploaded file — save to IndexedDB, store key as image ref
  const projectId = editId ? parseInt(editId) : Date.now();
  const imgKey = 'proj_' + projectId;

  const data = {
    title, category, tag: CAT_LABELS[category],
    location: get('fLocation'), year: get('fYear'), area: get('fArea'),
    description: get('fDesc'),
    details: get('fDetails').split(',').map(s => s.trim()).filter(Boolean),
    image: currentImageBase64 ? 'idb:' + imgKey : (imageUrl || '')
  };

  const finish = () => {
    if (editId) {
      const idx = projects.findIndex(p => p.id === projectId);
      if (idx !== -1) { data.id = projectId; data.color = projects[idx].color; projects[idx] = data; }
      showToast('✓ הפרויקט עודכן');
    } else {
      data.id = projectId;
      data.color = COLORS[projects.length % COLORS.length];
      projects.push(data);
      showToast('✓ הפרויקט נוסף');
    }
    saveProjects();
    renderAdminGrid();
    cancelEdit();
  };

  if (currentImageBase64) {
    ImgDB.save(imgKey, currentImageBase64).then(finish).catch(() => {
      showToast('שגיאה בשמירת תמונה', 'error');
    });
  } else {
    finish();
  }
}

// ── Delete
function confirmDeleteProject(id) {
  deleteTargetId = id;
  const p = projects.find(x => x.id === id);
  const ct = document.getElementById('confirmTitle');
  const cx = document.getElementById('confirmText');
  if (ct) ct.textContent = 'מחיקת פרויקט';
  if (cx) cx.textContent = `האם למחוק את "${p?.title}"?`;
  confirmCallback = () => {
    projects = projects.filter(p => p.id !== deleteTargetId);
    saveProjects();
    renderAdminGrid();
    showToast('הפרויקט נמחק', 'error');
  };
  document.getElementById('confirmOverlay')?.classList.add('open');
}

function closeConfirm() {
  deleteTargetId = null; confirmCallback = null;
  document.getElementById('confirmOverlay')?.classList.remove('open');
}

// ── Settings
function saveSettings() {
  const name = document.getElementById('sName')?.value.trim();
  const tagline = document.getElementById('sTagline')?.value.trim();
  const email = document.getElementById('sEmail')?.value.trim();
  if (name) localStorage.setItem('portfolioName', name);
  if (tagline) localStorage.setItem('portfolioTagline', tagline);
  if (email) localStorage.setItem('portfolioEmail', email);
  showToast('✓ ההגדרות נשמרו');
  const msg = document.getElementById('settingsMsg');
  if (msg) { msg.className = 'smsg ok'; msg.textContent = '✓ נשמר'; setTimeout(() => { msg.textContent = ''; msg.className = 'smsg'; }, 3000); }
}

function changePassword() {
  const oldEl = document.getElementById('sPassOld');
  const newEl = document.getElementById('sPass');
  const confEl = document.getElementById('sPassConfirm');
  const msgEl = document.getElementById('passMsg');
  if (!oldEl || !newEl || !confEl || !msgEl) return;
  const stored = localStorage.getItem('adminPass') || 'studio2025';
  const setMsg = (txt, ok) => { msgEl.className = 'smsg ' + (ok ? 'ok' : 'err'); msgEl.textContent = txt; };
  if (oldEl.value !== stored) { setMsg('✕ הסיסמה הנוכחית שגויה', false); return; }
  if (newEl.value.length < 6) { setMsg('✕ לפחות 6 תווים', false); return; }
  if (newEl.value !== confEl.value) { setMsg('✕ הסיסמאות אינן תואמות', false); return; }
  localStorage.setItem('adminPass', newEl.value);
  setMsg('✓ הסיסמה עודכנה', true);
  oldEl.value = ''; newEl.value = ''; confEl.value = '';
  setTimeout(() => { msgEl.textContent = ''; msgEl.className = 'smsg'; }, 3000);
}

function confirmResetAll() {
  const ct = document.getElementById('confirmTitle');
  const cx = document.getElementById('confirmText');
  if (ct) ct.textContent = 'איפוס כל הפרויקטים';
  if (cx) cx.textContent = 'פעולה זו תמחק את כל הפרויקטים ותחזיר לברירת המחדל.';
  confirmCallback = () => {
    projects = DEFAULT_PROJECTS.map(p => ({...p}));
    saveProjects();
    renderAdminGrid();
    showToast('המערכת אופסה', 'error');
  };
  document.getElementById('confirmOverlay')?.classList.add('open');
}

function clearBase64Images() {
  const count = projects.filter(p => p.image && p.image.startsWith('data:')).length;
  if (count === 0) { showToast('אין תמונות מועלות לנקות'); return; }
  projects = projects.map(p => ({ ...p, image: p.image && p.image.startsWith('data:') ? '' : p.image }));
  saveProjects();
  renderAdminGrid();
  showToast('✓ נוקו ' + count + ' תמונות — האחסון פנוי');
}

function logout() {
  sessionStorage.removeItem('adminAuth');
  window.location.href = 'admin-login.html';
}

// ── Live Editor
function openLiveEditor() {
  window.open('index.html?edit=1', '_blank');
}

function exportData() {
  const data = {
    projects,
    settings: {}
  };
  const SITE_KEYS = [
    'sHeroLine1','sHeroLine2','sHeroLine3','sHeroSub','sHeroLabel','sHeroBtn1','sHeroBtn2','sHeroImg',
    'sCounter1Val','sCounter1Label','sCounter2Val','sCounter2Label','sCounter3Val','sCounter3Label',
    'sLogoName','sLogoSub','sSiteTitle','sFooterLogo','sFooterCopy',
    'sAboutTitle','sAboutTitleEm','sAboutP1','sAboutP2','sAboutBadgeNum','sAboutBadgeText','sAboutImg','sSkills',
    'sContactTitle','sContactTitleEm','sContactSub','sContactEmail','sPhone','sAddress','sSocial',
    'sSrv1Title','sSrv1Desc','sSrv2Title','sSrv2Desc','sSrv3Title','sSrv3Desc','sSrv4Title','sSrv4Desc',
    'sTest1Text','sTest1Name','sTest1Role','sTest2Text','sTest2Name','sTest2Role','sTest3Text','sTest3Name','sTest3Role',
    'sMarquee','sStrip1','sStrip2','sStrip3','sStrip4','sStrip5',
    'sChatName','sChatGreeting','sChatAnswers'
  ];
  SITE_KEYS.forEach(k => { const v = localStorage.getItem(k); if (v) data.settings[k] = v; });
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'studio-backup-' + new Date().toISOString().slice(0,10) + '.json';
  a.click();
  showToast('✓ הגיבוי יוצא בהצלחה');
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (data.projects && Array.isArray(data.projects)) {
        projects = data.projects;
        saveProjects();
      }
      if (data.settings) {
        Object.entries(data.settings).forEach(([k, v]) => localStorage.setItem(k, v));
        loadSiteSettings();
      }
      renderAdminGrid();
      renderStats();
      showToast('✓ הנתונים יובאו בהצלחה');
      const msg = document.getElementById('importMsg');
      if (msg) { msg.className = 'smsg ok'; msg.textContent = '✓ יובא בהצלחה'; setTimeout(() => msg.textContent = '', 3000); }
    } catch(err) {
      showToast('קובץ לא תקין', 'error');
    }
  };
  reader.readAsText(file);
}

// ── Stats
function renderStats() {
  const grid = document.getElementById('statsGrid');
  if (!grid) return;
  const cats = {};
  projects.forEach(p => { cats[p.category] = (cats[p.category] || 0) + 1; });
  const withImg = projects.filter(p => p.image).length;
  const items = [
    { label: 'פרויקטים', val: projects.length, color: 'var(--g)' },
    { label: 'עם תמונה', val: withImg, color: '#4ec870' },
    { label: 'קטגוריות', val: Object.keys(cats).length, color: '#7a9e9f' },
    { label: 'בלי תמונה', val: projects.length - withImg, color: 'var(--m)' },
  ];
  grid.innerHTML = items.map(it => `
    <div style="background:var(--s3);border:1px solid var(--b2);padding:16px;text-align:center">
      <div style="font-family:serif;font-size:2rem;font-weight:300;color:${it.color};line-height:1">${it.val}</div>
      <div style="font-size:9px;letter-spacing:1.5px;color:var(--m);margin-top:4px;text-transform:uppercase">${it.label}</div>
    </div>
  `).join('');
}

// ── Drag & Drop reorder
function initDragDrop() {
  const grid = document.getElementById('adminGrid');
  if (!grid) return;
  let dragSrc = null;
  grid.addEventListener('dragstart', e => {
    dragSrc = e.target.closest('.admin-card');
    if (dragSrc) { dragSrc.style.opacity = '0.4'; e.dataTransfer.effectAllowed = 'move'; }
  });
  grid.addEventListener('dragover', e => {
    e.preventDefault();
    const target = e.target.closest('.admin-card');
    if (target && target !== dragSrc) target.style.borderColor = 'var(--g)';
  });
  grid.addEventListener('dragleave', e => {
    const target = e.target.closest('.admin-card');
    if (target) target.style.borderColor = '';
  });
  grid.addEventListener('drop', e => {
    e.preventDefault();
    const target = e.target.closest('.admin-card');
    if (!target || target === dragSrc) return;
    target.style.borderColor = '';
    const srcId = parseInt(dragSrc.dataset.id);
    const tgtId = parseInt(target.dataset.id);
    const si = projects.findIndex(p => p.id === srcId);
    const ti = projects.findIndex(p => p.id === tgtId);
    if (si !== -1 && ti !== -1) {
      const [moved] = projects.splice(si, 1);
      projects.splice(ti, 0, moved);
      saveProjects();
      renderAdminGrid();
      showToast('סדר הפרויקטים עודכן');
    }
  });
  grid.addEventListener('dragend', e => {
    const card = e.target.closest('.admin-card');
    if (card) card.style.opacity = '';
  });
}


function loadSettings() {
  const name = localStorage.getItem('portfolioName');
  const tagline = localStorage.getItem('portfolioTagline');
  const email = localStorage.getItem('portfolioEmail');
  const sn = document.getElementById('sName');
  const st = document.getElementById('sTagline');
  const se = document.getElementById('sEmail');
  if (name && sn) sn.value = name;
  if (tagline && st) st.value = tagline;
  if (email && se) se.value = email;
}

// שדהות עיצוב האתר
 const SITE_FIELDS = [
  'sHeroLine1','sHeroLine2','sHeroLine3','sHeroSub','sHeroLabel','sHeroBtn1','sHeroBtn2','sHeroImg',
  'sCounter1Val','sCounter1Label','sCounter2Val','sCounter2Label','sCounter3Val','sCounter3Label',
  'sLogoName','sLogoSub','sSiteTitle','sFooterLogo','sFooterCopy',
  'sAboutTitle','sAboutTitleEm','sAboutP1','sAboutP2','sAboutBadgeNum','sAboutBadgeText','sAboutImg','sSkills',
  'sContactTitle','sContactTitleEm','sContactSub','sContactEmail','sPhone','sAddress','sSocial',
  'sSrv1Title','sSrv1Desc','sSrv2Title','sSrv2Desc','sSrv3Title','sSrv3Desc','sSrv4Title','sSrv4Desc',
  'sTest1Text','sTest1Name','sTest1Role','sTest2Text','sTest2Name','sTest2Role','sTest3Text','sTest3Name','sTest3Role',
  'sMarquee','sStrip1','sStrip2','sStrip3','sStrip4','sStrip5',
  'sChatName','sChatGreeting','sChatAnswers'
];

function saveSiteSettings() {
  SITE_FIELDS.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.value.trim()) localStorage.setItem(id, el.value.trim());
  });
  const msg = document.getElementById('siteMsg');
  if (msg) { msg.className = 'smsg ok'; msg.textContent = '✓ נשמר בהצלחה'; setTimeout(() => { msg.textContent = ''; }, 3000); }
  showToast('✓ עיצוב האתר נשמר');
}

function loadSiteSettings() {
  SITE_FIELDS.forEach(id => {
    const val = localStorage.getItem(id);
    const el = document.getElementById(id);
    if (val && el) el.value = val;
  });

  // autosave on every change
  let autoTimer;
  SITE_FIELDS.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      clearTimeout(autoTimer);
      autoTimer = setTimeout(() => {
        SITE_FIELDS.forEach(fid => {
          const fel = document.getElementById(fid);
          if (fel && fel.value.trim()) localStorage.setItem(fid, fel.value.trim());
        });
        showToast('\u2713 \u05e0\u05e9\u05de\u05e8 \u05d0\u05d5\u05d8\u05d5\u05de\u05d8\u05d9\u05ea');
      }, 600);
    });
  });
}

// ── Init
document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const view = item.dataset.view;
      if (view === 'add') resetForm();
      switchView(view);
    });
  });

  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.addEventListener('input', e => { searchQuery = e.target.value.trim(); renderAdminGrid(); });

  document.querySelectorAll('.chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.cat;
      renderAdminGrid();
    });
  });

  const uploadZone = document.getElementById('uploadZone');
  const fileInput = document.getElementById('fImage');
  if (uploadZone) {
    uploadZone.addEventListener('click', () => fileInput?.click());
    uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
    uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
    uploadZone.addEventListener('drop', e => { e.preventDefault(); uploadZone.classList.remove('drag-over'); if (e.dataTransfer.files[0]) handleImageFile(e.dataTransfer.files[0]); });
  }
  if (fileInput) fileInput.addEventListener('change', () => { if (fileInput.files[0]) handleImageFile(fileInput.files[0]); });

  // URL field live preview
  const urlField = document.getElementById('fImageUrl');
  if (urlField) {
    urlField.addEventListener('input', () => {
      const url = urlField.value.trim();
      if (url) { currentImageBase64 = ''; showImagePreview(true, url); }
      else { showImagePreview(false); resetPreviewBox(); }
    });
  }

  const removeImg = document.getElementById('removeImg');
  if (removeImg) removeImg.addEventListener('click', () => {
    currentImageBase64 = '';
    if (fileInput) fileInput.value = '';
    showImagePreview(false);
    resetPreviewBox();
  });

  const form = document.getElementById('projectForm');
  if (form) form.addEventListener('submit', saveProject);

  const confirmOk = document.getElementById('confirmOk');
  if (confirmOk) confirmOk.addEventListener('click', () => { if (confirmCallback) confirmCallback(); closeConfirm(); });

  renderAdminGrid();
  loadSettings();
  loadSiteSettings();
  renderStats();
  initDragDrop();

  // mobile sidebar toggle
  const toggle = document.getElementById('sidebarToggle');
  if (toggle) {
    const show = () => { if (window.innerWidth <= 640) toggle.style.display = 'block'; else toggle.style.display = 'none'; };
    show(); window.addEventListener('resize', show);
    document.addEventListener('click', e => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar && !sidebar.contains(e.target) && !toggle.contains(e.target)) sidebar.classList.remove('open');
    });
  }
});
