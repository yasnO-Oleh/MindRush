const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const DATA_DIR = path.resolve(__dirname);
const PACKS_FILE = path.join(DATA_DIR, 'packs.json');
const RESP_FILE = path.join(DATA_DIR, 'responses.json');
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

function readJSON(file, def) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8') || 'null') || def; } catch(e) { return def; }
}
function writeJSON(file, obj) { fs.writeFileSync(file, JSON.stringify(obj, null, 2)); }

// ensure files exist
if (!fs.existsSync(PACKS_FILE)) writeJSON(PACKS_FILE, [
  { id: 'default', title: 'Default pack', description: 'Стандартне завдання', tasks: [{ id: 't1', label: 'Цільова кнопка', instruction: 'Знайдіть і натисніть кнопку'}] }
]);
if (!fs.existsSync(RESP_FILE)) writeJSON(RESP_FILE, []);

app.get('/api/packs', (req, res) => {
  const packs = readJSON(PACKS_FILE, []);
  res.json(packs.map(p => ({ id: p.id, title: p.title })));
});

app.get('/api/packs/:id', (req, res) => {
  const packs = readJSON(PACKS_FILE, []);
  const p = packs.find(x => x.id === req.params.id);
  if (!p) return res.status(404).json({error: 'not found'});
  res.json(p);
});

app.post('/api/packs', (req, res) => {
  const packs = readJSON(PACKS_FILE, []);
  const id = 'pack-' + Date.now();
  const payload = { id, title: req.body.title || ('Pack ' + id), tasks: req.body.tasks || [] };
  packs.push(payload);
  writeJSON(PACKS_FILE, packs);
  res.json(payload);
});

app.post('/api/responses', (req, res) => {
  const arr = readJSON(RESP_FILE, []);
  arr.push(req.body);
  writeJSON(RESP_FILE, arr);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log('Server running on port', PORT));