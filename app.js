// Простий скрипт для збору метрик юзер-тесту + інтеграція паків бекенду
(() => {
  const startBtn = document.getElementById('start-btn');
  const intro = document.getElementById('intro');
  const questionArea = document.getElementById('question-area');
  const targetBtn = document.getElementById('target-btn');
  const submitBtn = document.getElementById('submit-response');
  const exportBtn = document.getElementById('export-btn');
  const resetBtn = document.getElementById('reset-btn');
  const controls = document.getElementById('controls');
  const timeInput = document.getElementById('time-input');
  const commentInput = document.getElementById('comment-input');

  // new elements for pack builder / loader
  const packSelect = document.getElementById('pack-select');
  const loadPackBtn = document.getElementById('load-pack-btn');
  const newPackBtn = document.getElementById('new-pack-btn');
  const packBuilder = document.getElementById('pack-builder');
  const packTitleInput = document.getElementById('pack-title');
  const packQuestionsTextarea = document.getElementById('pack-questions');
  const savePackBtn = document.getElementById('save-pack-btn');

  let testData = JSON.parse(localStorage.getItem('demoapp-test-data') || '[]');
  let taskStart = null;
  let currentPack = null;

  function show(el) { if (el) el.classList.remove('hidden'); }
  function hide(el) { if (el) el.classList.add('hidden'); }

  // Fetch available packs from backend, populate select. Fallback to local only.  
  async function fetchPacks() {
    try {
      const res = await fetch('/api/packs');
      if (!res.ok) throw new Error('no packs');
      const packs = await res.json();
      // clear and add
      packSelect.innerHTML = '<option value="">(локальний)</option>';
      packs.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.title;
        packSelect.appendChild(opt);
      });
    } catch (e) {
      console.warn('Could not load packs from backend:', e.message);
    }
  }

  async function loadPack(id) {
    if (!id) { currentPack = null; return; }
    try {
      const res = await fetch('/api/packs/' + encodeURIComponent(id));
      if (!res.ok) throw new Error('not found');
      currentPack = await res.json();
      // map pack to UI (simple single-task support)
      if (currentPack.tasks && currentPack.tasks.length) {
        const t = currentPack.tasks[0];
        const instr = t.instruction || currentPack.description || 'Виконайте завдання';
        document.querySelector('#task p').textContent = instr;
        targetBtn.textContent = t.label || targetBtn.textContent;
      }
      alert('Пак завантажено: ' + currentPack.title);
    } catch (e) {
      alert('Не вдалося завантажити пакет: ' + e.message);
      currentPack = null;
    }
  }

  startBtn.addEventListener('click', () => {
    hide(intro);
    show(questionArea);
    show(controls);
    hide(packBuilder);
    taskStart = Date.now();
  });

  loadPackBtn.addEventListener('click', () => {
    const id = packSelect.value;
    if (!id) return alert('Виберіть пакет або створіть новий');
    loadPack(id);
  });

  newPackBtn.addEventListener('click', () => {
    // show builder
    show(packBuilder);
  });

  savePackBtn.addEventListener('click', async () => {
    const title = packTitleInput.value || 'Без назви';
    let tasks = [];
    try {
      tasks = JSON.parse(packQuestionsTextarea.value || '[]');
    } catch (e) {
      return alert('JSON в полі питань некоректний');
    }
    const payload = { title, tasks };
    try {
      const res = await fetch('/api/packs', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('save failed');
      const saved = await res.json();
      alert('Пак збережено: ' + saved.id);
      packTitleInput.value = '';
      packQuestionsTextarea.value = '';
      hide(packBuilder);
      await fetchPacks();
    } catch (e) {
      alert('Не вдалося зберегти пакет: ' + e.message + '. Переконайтесь, що сервер запущено.');
    }
  });

  targetBtn.addEventListener('click', () => {
    const clickTime = Date.now();
    const elapsed = Math.round((clickTime - (taskStart || clickTime)) / 1000);
    timeInput.value = elapsed;
    // visual feedback
    targetBtn.textContent = 'Натиснуто';
    setTimeout(() => targetBtn.textContent = (currentPack && currentPack.tasks && currentPack.tasks[0] && currentPack.tasks[0].label) || 'Цільова кнопка', 800);
  });

  submitBtn.addEventListener('click', async () => {
    const entry = {
      timestamp: new Date().toISOString(),
      elapsed_seconds: Number(timeInput.value) || null,
      comment: commentInput.value || '',
      pack_id: currentPack ? currentPack.id : null,
    };
    testData.push(entry);
    localStorage.setItem('demoapp-test-data', JSON.stringify(testData));

    // try to send to backend
    try {
      const res = await fetch('/api/responses', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(entry) });
      if (!res.ok) throw new Error('server error');
    } catch (e) {
      console.warn('Could not send response to backend:', e.message);
    }

    alert('Відповідь збережена');
    timeInput.value = '';
    commentInput.value = '';
  });

  exportBtn.addEventListener('click', () => {
    const dataStr = JSON.stringify(testData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'demoapp-test-results.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  resetBtn.addEventListener('click', () => {
    if (!confirm('Скинути всі збережені результати?')) return;
    testData = [];
    localStorage.removeItem('demoapp-test-data');
    alert('Результати скинуті');
  });

  // init
  fetchPacks();
})();