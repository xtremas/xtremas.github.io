const keywordInput = document.querySelector('#keyword-input');
const generateButton = document.querySelector('#generate-button');
const resultsBody = document.querySelector('#results-body');
const resultTitle = document.querySelector('#result-title');
const allCount = document.querySelector('#all-count');
const toast = document.querySelector('#toast');
const minWords = document.querySelector('#min-words');
let currentResults = [];
let activeFilter = 'all';
let callbackId = 0;

function render() {
  const filtered = currentResults.filter(item => activeFilter === 'all' || (activeFilter === 'question' && item.intent === 'Pertanyaan'));
  resultsBody.innerHTML = filtered.map(item => `<tr><td class="keyword">${escapeHtml(item.keyword)}</td><td><span class="intent">${item.intent}</span></td><td class="source">Google Suggest</td><td><button class="row-copy" data-keyword="${escapeHtml(item.keyword)}" title="Salin kata kunci">⧉</button></td></tr>`).join('');
  allCount.textContent = currentResults.length;
}
function escapeHtml(value) { return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character])); }
function fetchSuggestions(seed) {
  return new Promise((resolve, reject) => {
    const callbackName = `kataKunciCallback${Date.now()}${callbackId++}`;
    const script = document.createElement('script');
    const timeout = window.setTimeout(() => { cleanup(); reject(new Error('Request timeout')); }, 8000);
    const cleanup = () => { window.clearTimeout(timeout); delete window[callbackName]; script.remove(); };
    window[callbackName] = data => { cleanup(); resolve(data[1] || []); };
    script.onerror = () => { cleanup(); reject(new Error('Google Suggest tidak merespons')); };
    script.src = `https://suggestqueries.google.com/complete/search?client=firefox&hl=id&callback=${callbackName}&q=${encodeURIComponent(seed)}`;
    document.head.appendChild(script);
  });
}
async function fetchLongTail(seed) {
  const queries = ['', ...'abcdefghijklmnopqrstuvwxyz'.split('')].map(letter => `${seed}${letter ? ` ${letter}` : ''}`);
  const responses = await Promise.allSettled(queries.map(query => fetchSuggestions(query)));
  const minimum = Number(minWords.value);
  const unique = new Set();
  return responses.filter(result => result.status === 'fulfilled').flatMap(result => result.value).filter(keyword => {
    const normalized = keyword.trim().replace(/\s+/g, ' ');
    if (normalized.split(' ').length < minimum || unique.has(normalized.toLowerCase())) return false;
    unique.add(normalized.toLowerCase());
    return true;
  }).slice(0, 100);
}
async function generate(seed = keywordInput.value.trim()) {
  if (!seed) { keywordInput.focus(); showToast('Tulis kata kunci terlebih dahulu'); return; }
  generateButton.disabled = true;
  generateButton.querySelector('span').textContent = 'Mengambil saran...';
  try {
    const suggestions = await fetchLongTail(seed);
    currentResults = suggestions.map(keyword => ({ keyword, intent: /^(apa|apakah|bagaimana|kenapa|mengapa|kapan|dimana|di mana)\b/i.test(keyword) ? 'Pertanyaan' : 'Saran umum' }));
    activeFilter = 'all';
    document.querySelector('#updated-at').textContent = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    currentResults = [];
    showToast('Saran gagal diambil. Coba lagi.');
  } finally {
    generateButton.disabled = false;
    generateButton.querySelector('span').textContent = 'Temukan ide';
  }
  resultTitle.textContent = `Saran untuk “${seed}”`;
  document.querySelectorAll('.tab').forEach(tab => tab.classList.toggle('active', tab.dataset.filter === 'all'));
  render();
}
function showToast(message) { toast.textContent = message; toast.classList.add('show'); window.clearTimeout(showToast.timer); showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2200); }
function copyText(text) {
  if (!navigator.clipboard) { showToast('Salin manual dari hasil yang dipilih'); return; }
  navigator.clipboard.writeText(text).then(() => showToast('Kata kunci disalin'));
}
generateButton.addEventListener('click', () => generate());
keywordInput.addEventListener('keydown', event => { if (event.key === 'Enter') generate(); });
document.querySelectorAll('.example').forEach(button => button.addEventListener('click', () => { keywordInput.value = button.textContent; generate(); }));
minWords.addEventListener('change', () => generate());
document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => { activeFilter = tab.dataset.filter; document.querySelectorAll('.tab').forEach(item => item.classList.toggle('active', item === tab)); render(); }));
document.querySelector('#copy-button').addEventListener('click', () => copyText(currentResults.map(item => item.keyword).join('\n')));
document.querySelector('#export-button').addEventListener('click', () => { const csv = 'Kata kunci,Intensi,Sumber\n' + currentResults.map(item => [item.keyword, item.intent, 'Google Suggest'].map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n'); const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); link.download = 'saran-google-suggest.csv'; link.click(); URL.revokeObjectURL(link.href); showToast('CSV berhasil diunduh'); });
resultsBody.addEventListener('click', event => { const button = event.target.closest('[data-keyword]'); if (button) copyText(button.dataset.keyword); });
generate('kopi susu');